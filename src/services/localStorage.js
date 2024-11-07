const STORAGE_KEY = "kirito-rip-data";
const USERNAME_KEY = "kirito-rip-username";

export const localStorageService = {
	// 從 localStorage 讀取數據
	getData() {
		try {
			const data = localStorage.getItem(STORAGE_KEY);
			return data ? JSON.parse(data) : null;
		} catch (error) {
			console.error("讀取 localStorage 失敗:", error);
			return null;
		}
	},

	// 儲存數據到 localStorage
	setData(data) {
		try {
			const storageData = {
				count: data?.count,
				comments: data?.comments,
				lastUpdated: new Date().toISOString(),
			};
			localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
		} catch (error) {
			console.error("儲存到 localStorage 失敗:", error);
		}
	},

	// 檢查是否需要更新
	needsUpdate() {
		const data = this.getData();
		if (!data || !data.lastUpdated) return true;

		const lastUpdated = new Date(data.lastUpdated);
		const now = new Date();
		const hoursDiff = (now - lastUpdated) / (1000 * 60 * 60);

		// return hoursDiff > 1;
		return true;
	},

	// 獲取儲存的用戶名
	getUsername() {
		return localStorage.getItem(USERNAME_KEY) || "";
	},

	// 儲存用戶名
	setUsername(username) {
		if (username) {
			localStorage.setItem(USERNAME_KEY, username);
		}
	},
};
