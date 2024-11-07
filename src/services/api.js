const API_BASE_URL = "your-api-base-url";

// API 服務
export const apiService = {
	// 獲取初始化數據
	async initialize() {
		try {
			const response = await fetch(`${API_BASE_URL}/initialize`);
			if (!response.ok) throw new Error("初始化失敗");
			return await response.json();
		} catch (error) {
			console.error("初始化錯誤:", error);
			throw error;
		}
	},

	// 更新計數
	async updateCount(count) {
		try {
			const response = await fetch(`${API_BASE_URL}/count`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ count }),
			});
			if (!response.ok) throw new Error("更新計數失敗");
			return await response.json();
		} catch (error) {
			console.error("更新計數錯誤:", error);
			throw error;
		}
	},

	// 新增留言
	async addComment(comment) {
		try {
			const response = await fetch(`${API_BASE_URL}/comments`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(comment),
			});
			if (!response.ok) throw new Error("新增留言失敗");
			return await response.json();
		} catch (error) {
			console.error("新增留言錯誤:", error);
			throw error;
		}
	},
};
