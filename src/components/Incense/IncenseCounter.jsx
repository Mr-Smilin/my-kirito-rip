import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "../ui/button";
import { localStorageService } from "../../services/localStorage";
import { apiService } from "../../services/api";

const CLICK_RANGE = 5; // 點擊範圍
const DELAY_BEFORE_API = 3000; // API 延遲時間 (3秒)

export const IncenseCounter = ({ onScrollToComments, initialCount = 0 }) => {
	const [count, setCount] = useState(initialCount);
	const [cooldown, setCooldown] = useState(0);
	const [clickCount, setClickCount] = useState(0);
	const cooldownTimerRef = useRef(null);
	const apiTimerRef = useRef(null);
	const pendingClicksRef = useRef(0);

	// 監聽 initialCount 的變化
	useEffect(() => {
		setCount(initialCount);
	}, [initialCount]);

	// 更新冷卻時間的函數
	const updateCooldown = useCallback(() => {
		const remaining = localStorageService.getRemainingCooldown();
		setCooldown(remaining);

		if (remaining > 0) {
			cooldownTimerRef.current = setTimeout(() => {
				updateCooldown();
			}, 1000);
		} else {
			clearTimeout(cooldownTimerRef.current);
		}
	}, []);

	// 組件掛載時檢查冷卻狀態
	useEffect(() => {
		updateCooldown();
		return () => {
			clearTimeout(cooldownTimerRef.current);
			clearTimeout(apiTimerRef.current);
		};
	}, [updateCooldown]);

	// 發送 API 請求的函數
	const sendApiRequest = useCallback(async (clicks) => {
		try {
			await apiService.incrementCount(clicks);
			pendingClicksRef.current = 0; // 重置待發送次數
		} catch (error) {
			console.error("增加計數失敗:", error);
		}
	}, []);

	// 處理計數更新
	const handleCountUpdate = () => {
		if (cooldown > 0) {
			return;
		}

		// 增加點擊計數
		const newClickCount = clickCount + 1;
		setClickCount(newClickCount);
		pendingClicksRef.current += 1;

		// 更新總計數
		const newCount = count + 1;
		setCount(newCount);

		// 更新本地存儲
		const localData = localStorageService.getData() || { comments: [] };
		localStorageService.setData({
			...localData,
			count: newCount,
		});

		// 清除現有的 API 定時器
		clearTimeout(apiTimerRef.current);

		// 如果達到點擊範圍
		if (newClickCount >= CLICK_RANGE) {
			setClickCount(0); // 重置點擊計數
			localStorageService.setLastIncenseTime(); // 設置冷卻時間
			updateCooldown();
		}

		// 設置新的 API 定時器
		apiTimerRef.current = setTimeout(() => {
			if (pendingClicksRef.current > 0) {
				sendApiRequest(pendingClicksRef.current);
			}
		}, DELAY_BEFORE_API);
	};

	return (
		<section className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white snap-start relative">
			<div className="text-6xl font-bold mb-8 z-20">{count}</div>
			<Button
				size="lg"
				className="text-lg px-8 py-6 h-auto z-20"
				onClick={handleCountUpdate}
				disabled={cooldown > 0}
			>
				{cooldown > 0 ? `冷卻中 (${Math.ceil(cooldown / 1000)}秒)` : "上香"}
			</Button>

			<div
				className="absolute bottom-8 cursor-pointer animate-bounce"
				onClick={onScrollToComments}
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
	);
};
