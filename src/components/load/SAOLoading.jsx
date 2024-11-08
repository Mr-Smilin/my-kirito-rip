import React from "react";

const SAOLoading = () => {
	return (
		<div className="h-screen w-full flex items-center justify-center bg-black">
			<div className="relative flex flex-col items-center">
				{/* 外層菱形 */}
				<div className="relative w-48 h-48 animate-[spin_3s_linear_infinite]">
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="w-48 h-48 border-4 border-blue-400/30 rotate-45" />
					</div>
				</div>

				{/* 內層菱形 */}
				<div className="absolute w-32 h-32 animate-[spin_2s_linear_infinite]">
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="w-32 h-32 border-4 border-blue-400 rotate-45" />
					</div>
				</div>

				{/* 中心SAO標誌 */}
				<div className="absolute w-24 h-24 flex items-center justify-center">
					<div className="w-24 h-24 bg-blue-500/10 rotate-45 border-2 border-blue-400">
						<div className="absolute inset-0 flex items-center justify-center -rotate-45">
							<span className="text-blue-400 font-bold text-lg tracking-wider">
								SAO
							</span>
						</div>
					</div>
				</div>

				{/* 底部系統文字 */}
				<div className="absolute -bottom-16 text-center">
					<div className="text-blue-400 font-bold tracking-[0.2em] animate-pulse">
						SYSTEM LOADING
					</div>
					<div className="mt-2 flex justify-center space-x-1">
						{[...Array(3)].map((_, i) => (
							<div
								key={i}
								className="w-2 h-2 bg-blue-400 animate-pulse"
								style={{
									animationDelay: `${i * 200}ms`,
								}}
							/>
						))}
					</div>
				</div>

				{/* 裝飾性光效 */}
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="w-full h-full animate-[ping_2s_ease-in-out_infinite]">
						<div className="w-48 h-48 border border-blue-400/20 rotate-45" />
					</div>
				</div>
			</div>
		</div>
	);
};

export { SAOLoading };
