import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";
import { localStorageService } from "../../services/localStorage";
import { apiService } from "../../services/api";

export const CommentForm = ({
	onCommentSubmit,
	count, // 用於更新本地存儲
}) => {
	const [isAnonymous, setIsAnonymous] = useState(false);
	const [error, setError] = useState("");
	const [isNameLocked, setIsNameLocked] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		url: "",
		content: "",
	});

	// 初始化用戶名
	useEffect(() => {
		const savedUsername = localStorageService.getUsername();
		if (savedUsername) {
			setFormData((prev) => ({ ...prev, name: savedUsername }));
			setIsNameLocked(true);
		}
	}, []);

	// 更新表單處理函數，添加字數限制
	const handleInputChange = (e) => {
		const { name, value } = e.target;

		// 根據不同欄位應用不同的長度限制
		let limitedValue = value;
		switch (name) {
			case "name":
				limitedValue = value.slice(0, 8);
				break;
			case "url":
				limitedValue = value.slice(0, 200);
				break;
			case "content":
				limitedValue = value.slice(0, 2000);
				break;
			default:
				break;
		}

		setFormData((prev) => ({
			...prev,
			[name]: limitedValue,
		}));
		setError("");
	};

	const validateForm = () => {
		if (!isAnonymous && !formData.name.trim()) {
			setError("非匿名留言需要填寫姓名");
			return false;
		}
		if (!formData.content.trim()) {
			setError("請填寫留言內容");
			return false;
		}
		return true;
	};

	const getTaipeiTime = () => {
		const now = new Date();
		const taipeiTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);
		return taipeiTime.toISOString();
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		const newComment = {
			id: Date.now(),
			content: formData.content,
			timestamp: getTaipeiTime(),
			...(isAnonymous
				? {}
				: {
						name: formData.name,
						url: formData.url,
				  }),
		};

		try {
			// 如果不是匿名且有姓名，儲存用戶名
			if (!isAnonymous && formData.name) {
				localStorageService.setUsername(formData.name);
			}

			// 更新本地存儲
			const localData = localStorageService.getData() || { count };
			localStorageService.setData({
				...localData,
				comments: [...(localData.comments || []), newComment],
			});

			// 發送 API 請求
			apiService.addComment(newComment).catch(console.error);

			// 通知父組件
			onCommentSubmit(newComment);

			// 重置表單
			setFormData((prev) => ({
				...prev,
				url: "",
				content: "",
			}));
		} catch (error) {
			console.error("提交評論失敗:", error);
			setError("提交失敗，請稍後再試");
		}
	};

	return (
		<div className="relative w-full max-w-md z-20 bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg">
			<form onSubmit={handleSubmit} className="space-y-4">
				{error && (
					<Alert variant="destructive">
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				<div className="flex items-center space-x-2">
					<Checkbox
						id="anonymous"
						checked={isAnonymous}
						onCheckedChange={setIsAnonymous}
					/>
					<Label htmlFor="anonymous">匿名留言</Label>
				</div>

				{!isAnonymous && (
					<>
						<div className="space-y-2">
							<Label htmlFor="name">姓名 * {isNameLocked && "(已鎖定)"}</Label>
							<Input
								id="name"
								name="name"
								value={formData.name}
								onChange={handleInputChange}
								disabled={isNameLocked}
								maxLength={8}
							/>
							<p className="text-xs text-gray-500">{formData.name.length}/8</p>
						</div>

						<div className="space-y-2">
							<Label htmlFor="url">URL</Label>
							<Input
								id="url"
								name="url"
								value={formData.url}
								onChange={handleInputChange}
								maxLength={200}
							/>
							<p className="text-xs text-gray-500">{formData.url.length}/200</p>
						</div>
					</>
				)}

				<div className="space-y-2">
					<Label htmlFor="content">留言內容 *</Label>
					<Textarea
						id="content"
						name="content"
						value={formData.content}
						onChange={handleInputChange}
						rows={4}
						maxLength={2000}
					/>
					<p className="text-xs text-gray-500">
						{formData.content.length}/2000
					</p>
				</div>

				<Button type="submit" className="w-full">
					送出留言
				</Button>
			</form>
		</div>
	);
};
