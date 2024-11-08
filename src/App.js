import React, { useState, useEffect, useRef } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Checkbox } from "./components/ui/checkbox";
import { Label } from "./components/ui/label";
import { Alert, AlertDescription } from "./components/ui/alert";
import { BackgroundImages } from "./components/background/BackgroundImages";
import { CommentList } from "./components/CommentList";
import { MarqueeSystem } from "./components/MarqueeSystem";
import { apiService } from "./services/api";
import { localStorageService } from "./services/localStorage";

function App() {
	const [count, setCount] = useState(0);
	const commentSectionRef = useRef(null);
	const [comments, setComments] = useState([]);
	const [isAnonymous, setIsAnonymous] = useState(false);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);
	const [formData, setFormData] = useState({
		name: "",
		url: "",
		content: "",
	});

	// 添加用戶名鎖定狀態
	const [isNameLocked, setIsNameLocked] = useState(false);

	// 初始化數據
	useEffect(() => {
		const initializeData = async () => {
			try {
				setLoading(true);

				// 檢查儲存的用戶名
				const savedUsername = localStorageService.getUsername();
				if (savedUsername) {
					setFormData((prev) => ({ ...prev, name: savedUsername }));
					setIsNameLocked(true);
				}

				// 檢查 localStorage
				const localData = localStorageService.getData();

				if (!localData || localStorageService.needsUpdate()) {
					const apiData = await apiService.initialize();
					setCount(apiData?.count);
					setComments(apiData?.comments);
					localStorageService.setData(apiData);
				} else {
					setCount(localData.count);
					setComments(localData.comments);
				}
			} catch (error) {
				console.error("初始化失敗:", error);
				const localData = localStorageService.getData();
				if (localData) {
					setCount(localData.count);
					setComments(localData.comments);
				}
			} finally {
				setLoading(false);
			}
		};

		initializeData();
	}, []);

	// 更新計數時同時更新 localStorage
	const handleCountUpdate = (newCount) => {
		setCount(newCount);

		// 更新本地存儲
		const localData = localStorageService.getData() || { comments: [] };
		localStorageService.setData({
			...localData,
			count: newCount,
		});

		// 發送 API 請求
		apiService.incrementCount(newCount).catch(console.error);
	};

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

	// 提交留言時同時更新 localStorage
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

		// 如果不是匿名且有姓名，儲存用戶名
		if (!isAnonymous && formData.name) {
			localStorageService.setUsername(formData.name);
		}

		// 更新 state
		setComments((prev) => [...prev, newComment]);

		// 更新本地存儲
		const localData = localStorageService.getData() || { count };
		localStorageService.setData({
			...localData,
			comments: [...(localData.comments || []), newComment],
		});

		// 重置表單
		setFormData((prev) => ({
			...prev,
			url: "",
			content: "",
		}));

		// 發送 API 請求
		apiService.addComment(newComment).catch(console.error);
	};

	if (loading) {
		return (
			<div className="h-screen flex items-center justify-center">載入中...</div>
		);
	}

	return (
		<div className="snap-y snap-mandatory h-screen overflow-y-auto">
			{/* 背景圖片層 */}
			<BackgroundImages totalImages={7} />

			{/* 彈幕層 */}
			<MarqueeSystem comments={comments} />

			{/* 計數器區塊 */}
			<section className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white snap-start relative">
				<div className="text-6xl font-bold mb-8 z-20">{count}</div>
				<Button
					size="lg"
					className="text-lg px-8 py-6 h-auto z-20"
					onClick={() => handleCountUpdate(count + 1)}
				>
					上香
				</Button>

				<div
					className="absolute bottom-8 cursor-pointer animate-bounce"
					onClick={() =>
						commentSectionRef.current?.scrollIntoView({ behavior: "smooth" })
					}
				>
					<div className="flex flex-col items-center text-gray-500 z-20">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 14l-7 7m0 0l-7-7m7 7V3"
							/>
						</svg>
						<span className="mt-2">往下滾動查看留言板</span>
					</div>
				</div>
			</section>

			{/* 留言板區塊 */}
			<section
				ref={commentSectionRef}
				className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-50 snap-start relative overflow-hidden"
			>
				{/* 留言表單 */}
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
									<Label htmlFor="name">
										姓名 * {isNameLocked && "(已鎖定)"}
									</Label>
									<Input
										id="name"
										name="name"
										value={formData.name}
										onChange={handleInputChange}
										disabled={isNameLocked}
										maxLength={8}
									/>
									<p className="text-xs text-gray-500">
										{formData.name.length}/8
									</p>
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
									<p className="text-xs text-gray-500">
										{formData.url.length}/200
									</p>
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
			</section>

			{/* 留言列表區塊 */}
			<CommentList comments={comments} />
		</div>
	);
}

export default App;
