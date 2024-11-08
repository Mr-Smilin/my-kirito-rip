import React, { useState, useEffect } from "react";
import { SAOLoading } from "./SAOLoading";

const TransitionWrapper = ({ children, loading }) => {
	const [showContent, setShowContent] = useState(false);
	const [showLoader, setShowLoader] = useState(true);

	useEffect(() => {
		if (!loading && showLoader) {
			// 當載入完成時，開始過渡動畫
			const contentTimer = setTimeout(() => {
				setShowContent(true);
				// 等內容開始顯示後，再淡出載入器
				const loaderTimer = setTimeout(() => {
					setShowLoader(false);
				}, 600); // 等待內容淡入一半後再移除載入器
				return () => clearTimeout(loaderTimer);
			}, 200);
			return () => clearTimeout(contentTimer);
		}
	}, [loading]);

	return (
		<div className="relative min-h-screen">
			{/* 主內容 */}
			<div
				className={`transition-opacity duration-1000 ease-in-out
          ${showContent ? "opacity-100" : "opacity-0"}`}
			>
				{children}
			</div>

			{/* 載入器和過渡層 */}
			{showLoader && (
				<div
					className={`fixed inset-0 z-50 transition-opacity duration-500 ease-in-out bg-black
            ${showContent ? "opacity-0" : "opacity-100"}`}
				>
					<SAOLoading />
				</div>
			)}
		</div>
	);
};

export { TransitionWrapper };
