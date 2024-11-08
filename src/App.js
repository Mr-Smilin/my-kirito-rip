import React, { useState, useEffect, useRef } from "react";
import { BackgroundImages } from "./components/background/BackgroundImages";
import { CommentList } from "./components/Comment/CommentList";
import { CommentSection } from "./components/Comment/CommentSection";
import { MarqueeSystem } from "./components/MarqueeSystem";
import { IncenseCounter } from "./components/Incense/IncenseCounter";
import { SAOTransition } from "./components/load/SAOTransition";
import { BGMPlayer } from "./components/BGMPlayer";
import { Kirito } from "./components/bouns/EasterEgg";
import { apiService } from "./services/api";
import { localStorageService } from "./services/localStorage";

function App() {
	const [count, setCount] = useState(0);
	const commentSectionRef = useRef(null);
	const [comments, setComments] = useState([]);
	const [loading, setLoading] = useState(true);

	// 初始化數據
	useEffect(() => {
		const initializeData = async () => {
			try {
				setLoading(true);

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
				setTimeout(() => {
					setLoading(false);
				}, 1500);
			}
		};

		initializeData();
	}, []);

	const handleCommentSubmit = (newComment) => {
		setComments((prev) => [...prev, newComment]);
	};

	const handleScrollToComments = () => {
		commentSectionRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<SAOTransition loading={loading}>
			<div className="snap-y snap-mandatory h-screen overflow-y-auto">
				{/* 背景圖片層 */}
				<BackgroundImages totalImages={13} />

				{/* 彈幕層 */}
				<MarqueeSystem comments={comments} />

				{/* 計數器區塊 */}
				<IncenseCounter
					initialCount={count}
					onScrollToComments={handleScrollToComments}
				/>

				{/* 留言板區塊 */}
				<CommentSection
					commentSectionRef={commentSectionRef}
					count={count}
					onCommentSubmit={handleCommentSubmit}
				/>

				{/* 留言列表區塊 */}
				<CommentList comments={comments} />

				{/* 音樂盒 */}
				<BGMPlayer defaultPlay={true} />

				{/* 彩蛋 */}
				<Kirito />
			</div>
		</SAOTransition>
	);
}

export default App;
