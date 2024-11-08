import React, { useState, useEffect, useRef } from "react";

const MarqueeSystem = ({ comments }) => {
	// 活躍的彈幕列表
	const [activeMarquees, setActiveMarquees] = useState([]);
	// 待發送的彈幕隊列
	const [queue, setQueue] = useState([]);
	// 防抖動控制
	const [isProcessing, setIsProcessing] = useState(false);
	// 容器參考
	const containerRef = useRef(null);
	// 追踪批次計時器
	const batchTimerRef = useRef(null);
	// 用於生成唯一ID
	const uniqueIdCounterRef = useRef(0);
	// 最大彈幕數量限制
	const MAX_ACTIVE_MARQUEES = 30;
	// 每批次發送數量
	const BATCH_SIZE = 6;

	useEffect(() => {
		if (!comments.length) return;
		// 隨機選擇起始索引
		const startIndex = Math.floor(Math.random() * comments.length);

		// 重新排序數組，保持相對順序但從新的起點開始
		const reorderedComments = [
			...comments.slice(startIndex),
			...comments.slice(0, startIndex),
		];

		setQueue(reorderedComments);
	}, [comments]);

	// 生成唯一ID的輔助函數
	const generateUniqueId = () => {
		uniqueIdCounterRef.current += 1;
		return `marquee-${Date.now()}-${uniqueIdCounterRef.current}`;
	};

	const calculateSafePosition = (existingPositions) => {
		let position;
		let attempts = 0;
		const maxAttempts = 50;

		do {
			position = 5 + Math.random() * 90;
			const isSafe = existingPositions.every(
				(pos) => Math.abs(pos - position) > 6
			);

			if (isSafe || attempts >= maxAttempts) break;
			attempts++;
		} while (true);

		return position;
	};

	const createNewMarquee = (comment, existingPositions) => {
		return {
			id: generateUniqueId(), // 使用新的唯一ID生成方法
			comment,
			right: -100,
			top: calculateSafePosition(existingPositions),
			speed: 0.15 + Math.random() * 0.3,
			fontSize: Math.floor(Math.random() * (28 - 18 + 1)) + 18,
			createdAt: Date.now(), // 添加創建時間戳以幫助追踪
		};
	};

	const extractNewBatch = () => {
		try {
			if (queue.length === 0) return [];

			const currentPositions = activeMarquees.map((m) => m.top);
			const newBatch = [];

			// 創建新批次時確保不會超出隊列長度
			const batchSize = Math.min(BATCH_SIZE, queue.length);

			for (let i = 0; i < batchSize; i++) {
				const comment = queue[i];
				const newMarquee = createNewMarquee(comment, [
					...currentPositions,
					...newBatch.map((m) => m.top),
				]);
				newBatch.push(newMarquee);
			}

			// 更新隊列：將使用過的彈幕移到隊列末尾
			setQueue((prevQueue) => [
				...prevQueue.slice(batchSize),
				...prevQueue.slice(0, batchSize),
			]);

			return newBatch;
		} catch (err) {
			console.error("彈幕批次處理錯誤:", err);
			return [];
		}
	};

	const addNewBatch = () => {
		if (isProcessing) return;
		setIsProcessing(true);
		const newBatch = extractNewBatch();
		if (newBatch.length > 0) {
			setActiveMarquees((prev) => {
				// 移除任何超過25秒的彈幕，防止潛在的記憶體問題
				const now = Date.now();
				const filtered = prev
					.filter((m) => now - m.createdAt < 25000)
					.slice(0, MAX_ACTIVE_MARQUEES);
				return [...filtered, ...newBatch];
			});
		}
		setTimeout(() => setIsProcessing(false), 100);
	};

	useEffect(() => {
		if (!containerRef.current || queue.length === 0) return;

		// 初始批次
		if (activeMarquees.length === 0) {
			addNewBatch();
		}

		const animationInterval = setInterval(() => {
			setActiveMarquees((prev) => {
				const now = Date.now();
				return prev
					.filter((item) => now - item.createdAt < 25000) // 確保沒有過期的彈幕
					.map((item) => ({
						...item,
						right: item.right + item.speed,
					}))
					.filter((item) => item.right <= 100);
			});
		}, 16);

		const checkAndAddNewBatch = () => {
			if (activeMarquees.length < 10) {
				const delay = 500 + Math.random() * 500;
				batchTimerRef.current = setTimeout(() => {
					addNewBatch();
					checkAndAddNewBatch();
				}, delay);
			} else {
				batchTimerRef.current = setTimeout(checkAndAddNewBatch, 500);
			}
		};

		checkAndAddNewBatch();

		return () => {
			clearInterval(animationInterval);
			if (batchTimerRef.current) {
				clearTimeout(batchTimerRef.current);
			}
		};
	}, [queue.length, activeMarquees.length]);

	useEffect(() => {
		return () => {
			setActiveMarquees([]);
			setQueue([]);
			if (batchTimerRef.current) {
				clearTimeout(batchTimerRef.current);
			}
		};
	}, []);

	return (
		<div
			ref={containerRef}
			className="fixed inset-0 pointer-events-none overflow-hidden z-10"
		>
			{activeMarquees.map((item) => (
				<div
					key={item.id}
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
						: `不知名的封弊者: ${item.comment.content}`}
				</div>
			))}
		</div>
	);
};

export { MarqueeSystem };
