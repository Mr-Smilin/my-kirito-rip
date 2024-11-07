import React, { useState, useEffect, useRef } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Checkbox } from "./components/ui/checkbox";
import { Label } from "./components/ui/label";
import { Alert, AlertDescription } from "./components/ui/alert";
import { apiService } from "./services/api";

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

	// 初始化數據
	useEffect(() => {
		const initializeData = async () => {
			try {
				setLoading(true);
				const data = await apiService.initialize();
				setCount(data.count);
				setComments(data.comments);
			} catch (error) {
				setError("載入數據失敗");
			} finally {
				setLoading(false);
			}
		};

		initializeData();
	}, []);

	// 更新計數 - 不等待 API 響應
	const handleCountUpdate = (newCount) => {
		setCount(newCount);
		// 非同步發送更新請求，不等待結果
		apiService.updateCount(newCount).catch(console.error);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
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

	// 提交留言 - 不等待 API 響應
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		const newComment = {
			id: Date.now(),
			content: formData.content,
			timestamp: getTaipeiTime(),
			fontSize: Math.floor(Math.random() * (18 - 12 + 1)) + 12,
			...(isAnonymous
				? {}
				: {
						name: formData.name,
						url: formData.url,
				  }),
		};

		// 立即更新前端數據
		setComments((prev) => [...prev, newComment]);
		setFormData({ name: "", url: "", content: "" });
		setError("");

		// 非同步發送到後端，不等待結果
		apiService.addComment(newComment).catch(console.error);
	};

	// 彈幕動畫
	const [marqueePosArray, setMarqueePosArray] = useState([]);
	const containerRef = useRef(null);

	useEffect(() => {
		if (!containerRef.current) return;

		// 計算安全的垂直間距
		const calculateSafePosition = (existingPositions) => {
			let position;
			let attempts = 0;
			const maxAttempts = 50;

			do {
				position = 10 + Math.random() * 80;
				const isSafe = existingPositions.every(
					(pos) => Math.abs(pos - position) > 8
				);

				if (isSafe || attempts >= maxAttempts) break;
				attempts++;
			} while (true);

			return position;
		};

		// 初始化彈幕位置
		const initializePositions = () => {
			const safePositions = [];
			const newMarqueePos = comments.map(() => {
				const safeTop = calculateSafePosition(safePositions);
				safePositions.push(safeTop);
				return {
					right: Math.random() * -50 - 100,
					top: safeTop,
					speed: 0.2 + Math.random() * 0.5,
				};
			});
			setMarqueePosArray(newMarqueePos);
		};

		initializePositions();

		const animationFrame = setInterval(() => {
			setMarqueePosArray((prev) =>
				prev.map((pos) => ({
					...pos,
					right:
						pos.right > window.innerWidth + 100 ? -100 : pos.right + pos.speed,
				}))
			);
		}, 16);

		return () => clearInterval(animationFrame);
	}, [comments.length]);

	if (loading) {
		return (
			<div className="h-screen flex items-center justify-center">載入中...</div>
		);
	}

	return (
		<div className="snap-y snap-mandatory h-screen overflow-y-auto">
			{/* 計數器區塊 */}
			<section className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white snap-start relative">
				<div className="text-6xl font-bold mb-8">{count}</div>
				<Button
					size="lg"
					className="text-lg px-8 py-6 h-auto"
					onClick={() => handleCountUpdate(count + 1)}
				>
					增加數字
				</Button>

				<div
					className="absolute bottom-8 cursor-pointer animate-bounce"
					onClick={() =>
						commentSectionRef.current?.scrollIntoView({ behavior: "smooth" })
					}
				>
					<div className="flex flex-col items-center text-gray-500">
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
				{/* 彈幕層 */}
				<div
					ref={containerRef}
					className="absolute inset-0 pointer-events-none"
				>
					{comments.map((comment, index) => (
						<div
							key={comment.id}
							className="absolute whitespace-nowrap"
							style={{
								right: `${marqueePosArray[index]?.right || 0}%`,
								top: `${marqueePosArray[index]?.top || 0}%`,
								transform: "translateZ(0)",
								fontSize: `${comment.fontSize || 14}px`,
								color: "rgba(59, 130, 246, 0.4)",
								textShadow: "0 0 1px rgba(0,0,0,0.1)",
								transition: "right 16ms linear",
							}}
						>
							{comment.name
								? `${comment.name}: ${comment.content}`
								: `匿名: ${comment.content}`}
						</div>
					))}
				</div>

				{/* 留言表單 */}
				<div className="w-full max-w-md z-10 bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg">
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
									<Label htmlFor="name">姓名 *</Label>
									<Input
										id="name"
										name="name"
										value={formData.name}
										onChange={handleInputChange}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="url">URL</Label>
									<Input
										id="url"
										name="url"
										value={formData.url}
										onChange={handleInputChange}
									/>
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
							/>
						</div>

						<Button type="submit" className="w-full">
							送出留言
						</Button>
					</form>
				</div>
			</section>
		</div>
	);
}

export default App;
