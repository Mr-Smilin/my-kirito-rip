import React, { useState, useEffect } from "react";
import { SAOLoading } from "./SAOLoading";

const SAOTransition = ({ children, loading }) => {
	const [showContent, setShowContent] = useState(false);
	const [showLoader, setShowLoader] = useState(true);
	const [startTransition, setStartTransition] = useState(false);

	useEffect(() => {
		if (!loading && showLoader) {
			// 開始過渡動畫
			setTimeout(() => {
				setStartTransition(true);
				// 等待掃描動畫開始後顯示內容
				setTimeout(() => {
					setShowContent(true);
					// 最後移除載入器
					setTimeout(() => {
						setShowLoader(false);
					}, 1000);
				}, 1000);
			}, 200);
		}
	}, [loading]);

	return (
		<div className="relative min-h-screen">
			{/* 主內容 */}
			<div
				className={`transition-opacity duration-1000 ease-out
          ${showContent ? "opacity-100" : "opacity-0"}`}
			>
				{children}
			</div>

			{/* SAO 過渡效果 */}
			{showLoader && (
				<div
					className={`fixed inset-0 z-50 bg-black ${
						startTransition
							? "transition-opacity duration-500 opacity-0"
							: "opacity-100"
					}`}
				>
					{/* 載入動畫 */}
					<div
						className={`transition-opacity duration-300 ${
							startTransition ? "opacity-0" : "opacity-100"
						}`}
					>
						<SAOLoading />
					</div>

					{/* 掃描線效果 */}
					{startTransition && (
						<>
							{/* 主掃描線 */}
							<div className="absolute inset-0 z-10">
								<div
									className="h-[200%] w-full absolute top-0 animate-[scan_1.5s_linear_forwards]"
									style={{
										background: `
                      linear-gradient(
                        to bottom,
                        transparent 0%,
                        #0088ff 45%,
                        #0088ff 55%,
                        transparent 100%
                      )
                    `,
									}}
								/>
							</div>

							{/* 網格效果 */}
							<div
								className="absolute inset-0 opacity-30"
								style={{
									backgroundImage: `
                    linear-gradient(0deg, transparent 24%, 
                      rgba(0, 136, 255, 0.3) 25%, 
                      rgba(0, 136, 255, 0.3) 26%, 
                      transparent 27%, transparent 74%, 
                      rgba(0, 136, 255, 0.3) 75%, 
                      rgba(0, 136, 255, 0.3) 76%, 
                      transparent 77%, transparent),
                    linear-gradient(90deg, transparent 24%, 
                      rgba(0, 136, 255, 0.3) 25%, 
                      rgba(0, 136, 255, 0.3) 26%, 
                      transparent 27%, transparent 74%, 
                      rgba(0, 136, 255, 0.3) 75%, 
                      rgba(0, 136, 255, 0.3) 76%, 
                      transparent 77%, transparent)
                  `,
									backgroundSize: "50px 50px",
								}}
							/>

							{/* 光粒子效果 */}
							<div className="absolute inset-0 overflow-hidden">
								{[...Array(20)].map((_, i) => (
									<div
										key={i}
										className="absolute w-1 h-1 bg-blue-400 rounded-full animate-[particle_2s_linear_forwards]"
										style={{
											left: `${Math.random() * 100}%`,
											animationDelay: `${Math.random() * 1000}ms`,
											opacity: Math.random() * 0.5 + 0.5,
										}}
									/>
								))}
							</div>
						</>
					)}
				</div>
			)}
		</div>
	);
};

// 需要在 tailwind.config.js 添加的配置
const tailwindConfig = {
	theme: {
		extend: {
			keyframes: {
				scan: {
					"0%": { transform: "translateY(-50%)" },
					"100%": { transform: "translateY(100%)" },
				},
				particle: {
					"0%": {
						transform: "translateY(-100vh)",
						opacity: 1,
					},
					"100%": {
						transform: "translateY(100vh)",
						opacity: 0,
					},
				},
			},
		},
	},
};

export { SAOTransition };
