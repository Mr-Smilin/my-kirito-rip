import React, { useState, useEffect, useRef, useMemo } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { localStorageService } from "../services/localStorage";

const BGMPlayer = ({ defaultPlay = false }) => {
	const [isPlaying, setIsPlaying] = useState(() => {
		const savedState = localStorageService.getMusicState();
		return savedState ?? defaultPlay;
	});
	const [autoplayBlocked, setAutoplayBlocked] = useState(false);
	const audioRef = useRef(null);
	const musicPath = useMemo(
		() => `${process.env.PUBLIC_URL}/music/ed1.mp3`,
		[]
	);

	// 音頻播放狀態管理
	useEffect(() => {
		const audioElement = audioRef.current;
		if (!audioElement) return;

		if (isPlaying) {
			audioElement.play().catch((error) => {
				console.log("播放失敗:", error);
				if (error.name === "NotAllowedError") {
					setAutoplayBlocked(true); // 標記自動播放被阻擋
				}
				setIsPlaying(false);
			});
		} else {
			audioElement.pause();
		}

		localStorageService.setMusicState(isPlaying);

		return () => {
			audioElement.pause();
		};
	}, [isPlaying]);

	// 監聽用戶首次交互
	useEffect(() => {
		const handleFirstInteraction = () => {
			if (autoplayBlocked && defaultPlay) {
				setIsPlaying(true);
			}
			// 移除事件監聽器
			document.removeEventListener("click", handleFirstInteraction);
		};

		if (autoplayBlocked) {
			document.addEventListener("click", handleFirstInteraction);
		}

		return () => {
			document.removeEventListener("click", handleFirstInteraction);
		};
	}, [autoplayBlocked, defaultPlay]);

	const togglePlay = () => {
		setIsPlaying((prev) => !prev);
	};

	return (
		<div className="fixed left-4 bottom-4 z-50">
			<audio ref={audioRef} src={musicPath} loop preload="auto" />
			<button
				onClick={togglePlay}
				className="bg-black/30 backdrop-blur-sm hover:bg-black/40 
                 text-white rounded-full p-3 transition-all duration-300
                 flex items-center gap-2 group"
			>
				{isPlaying ? (
					<Volume2 className="w-6 h-6" />
				) : (
					<VolumeX className="w-6 h-6" />
				)}
				<span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300">
					{isPlaying ? "背景音樂開啟" : "背景音樂關閉"}
				</span>
			</button>
		</div>
	);
};

export { BGMPlayer };
