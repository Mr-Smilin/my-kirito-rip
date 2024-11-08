import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { localStorageService } from "../services/localStorage";

const BGMPlayer = () => {
	const [isPlaying, setIsPlaying] = useState(false);
	const audioRef = useRef(null);

	const musicPath = `${process.env.PUBLIC_URL}/music/ed1.mp3`;

	useEffect(() => {
		// 從 localStorage 讀取初始狀態
		const savedState = localStorageService.getMusicState();
		setIsPlaying(savedState);
	}, []);

	useEffect(() => {
		if (audioRef.current) {
			if (isPlaying) {
				audioRef.current.play().catch((error) => {
					// 處理自動播放政策限制
					console.log("Auto-play prevented:", error);
					setIsPlaying(false);
				});
			} else {
				audioRef.current.pause();
			}
			// 保存狀態到 localStorage
			localStorageService.setMusicState(isPlaying);
		}
	}, [isPlaying]);

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
