import React, { useState, useEffect, useRef } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Checkbox } from "./components/ui/checkbox";
import { Label } from "./components/ui/label";
import { Alert, AlertDescription } from "./components/ui/alert";
import { BackgroundImages } from "./components/background/BackgroundImages";
import { CommentList } from "./components/CommentList";
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

	// 彈幕狀態管理
	const [activeMarqueeSet, setActiveMarqueeSet] = useState(1); // 1 或 2，表示當前活動的彈幕組
	const [marqueeSet1, setMarqueeSet1] = useState([]); // 第一組彈幕
	const [marqueeSet2, setMarqueeSet2] = useState([]); // 第二組彈幕
	const containerRef = useRef(null);

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

	// 計算安全的垂直間距
	const calculateSafePosition = (existingPositions) => {
		let position;
		let attempts = 0;
		const maxAttempts = 50;

		do {
			position = 30 + Math.random() * 100;
			const isSafe = existingPositions.every(
				(pos) => Math.abs(pos - position) > 8
			);

			if (isSafe || attempts >= maxAttempts) break;
			attempts++;
		} while (true);

		return position;
	};

	// 初始化一組新的彈幕位置
	const createNewMarqueeSet = (comments) => {
		const safePositions = [];
		return comments.map((comment) => {
			const safeTop = calculateSafePosition(safePositions);
			safePositions.push(safeTop);
			return {
				comment,
				right: -100, // 從右側開始
				top: safeTop,
				speed: 0.2 + Math.random() * 0.2,
				fontSize: Math.floor(Math.random() * (28 - 18 + 1)) + 18,
			};
		});
	};

	// 初始化彈幕
	useEffect(() => {
		if (!comments.length) return;

		// 初始化第一組彈幕
		setMarqueeSet1(createNewMarqueeSet(comments));
	}, [comments.length]);

	// 彈幕動畫
	useEffect(() => {
		if (!containerRef.current || !comments.length) return;

		const animationFrame = setInterval(() => {
			if (activeMarqueeSet === 1) {
				setMarqueeSet1((prev) => {
					const newSet = prev.map((item) => ({
						...item,
						right: item.right + item.speed,
					}));

					// 調整切換條件，確保彈幕完全離開畫面才切換
					if (newSet.every((item) => item.right > 100)) {
						setMarqueeSet2(createNewMarqueeSet(comments));
						setActiveMarqueeSet(2);
					}

					return newSet;
				});
			} else {
				setMarqueeSet2((prev) => {
					const newSet = prev.map((item) => ({
						...item,
						right: item.right + item.speed,
					}));

					if (newSet.every((item) => item.right > 100)) {
						setMarqueeSet1(createNewMarqueeSet(comments));
						setActiveMarqueeSet(1);
					}

					return newSet;
				});
			}
		}, 16);

		return () => clearInterval(animationFrame);
	}, [activeMarqueeSet, comments]);

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
			<div
				ref={containerRef}
				className="fixed inset-0 pointer-events-none overflow-hidden z-10"
			>
				{/* 第一組彈幕 */}
				{marqueeSet1.map((item) => (
					<div
						key={`set1-${item.comment.id}`}
						className="absolute whitespace-nowrap"
						style={{
							right: `${item.right}%`,
							top: `${item.top}%`,
							transform: "translateZ(0)",
							fontSize: `${item.fontSize}px`,
							color: "rgba(59, 130, 246, 0.8)",
							textShadow: "0 0 1px rgba(0,0,0,0.1)",
							transition: "right 16ms linear",
						}}
					>
						{item.comment.name
							? `${item.comment.name}: ${item.comment.content}`
							: `匿名: ${item.comment.content}`}
					</div>
				))}

				{/* 第二組彈幕 */}
				{marqueeSet2.map((item) => (
					<div
						key={`set2-${item.comment.id}`}
						className="absolute whitespace-nowrap"
						style={{
							right: `${item.right}%`,
							top: `${item.top}%`,
							transform: "translateZ(0)",
							fontSize: `${item.fontSize}px`,
							color: "rgba(59, 130, 246, 0.8)",
							textShadow: "0 0 1px rgba(0,0,0,0.1)",
							transition: "right 16ms linear",
						}}
					>
						{item.comment.name
							? `${item.comment.name}: ${item.comment.content}`
							: `匿名: ${item.comment.content}`}
					</div>
				))}
			</div>

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
