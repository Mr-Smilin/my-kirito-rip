const API_BASE_URL =
	"https://script.google.com/macros/s/AKfycbwBwjne5BTqNBc1W1n0hVDo8jjmB2d8-QAjUM8iJOPy0_2xX6reQ07ow4RH3hpC9Xwo/exec";

export const apiService = {
	// 獲取初始化數據
	async initialize() {
		try {
			const response = await fetch(API_BASE_URL);
			if (!response.ok) throw new Error("初始化失敗");
			const result = await response.json();
			return result.data;
		} catch (error) {
			console.error("初始化錯誤:", error);
			throw error;
		}
	},

	// 更新計數（增加指定數量）
	async incrementCount(increment = 1) {
		try {
			const response = await fetch(API_BASE_URL, {
				redirect: "follow",
				method: "POST",
				body: JSON.stringify({
					action: "updateCount",
					count: increment,
				}),
				headers: {
					"Content-Type": "text/plain;charset=utf-8",
				},
			});

			if (!response.ok) throw new Error("更新計數失敗");
			const result = await response.json();
			return result.data;
		} catch (error) {
			console.error("更新計數錯誤:", error);
			throw error;
		}
	},

	// 新增留言
	async addComment(comment) {
		try {
			const response = await fetch(API_BASE_URL, {
				redirect: "follow",
				method: "POST",
				body: JSON.stringify(comment),
				headers: {
					"Content-Type": "text/plain;charset=utf-8",
				},
			});

			if (!response.ok) throw new Error("新增留言失敗");
			const result = await response.json();
			return result.data;
		} catch (error) {
			console.error("新增留言錯誤:", error);
			throw error;
		}
	},
};
