const STORAGE_KEY = "kirito-rip-data";
const USERNAME_KEY = "kirito-rip-username";
const LAST_INCENSE_KEY = "kirito-rip-last-incense";
const MUSIC_STATE_KEY = "kirito-rip-music-state";
const COOLDOWN_DURATION = 3 * 60 * 1000; // 300秒冷卻時間

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

	// 儲存最後上香時間
	setLastIncenseTime() {
		localStorage.setItem(LAST_INCENSE_KEY, new Date().toISOString());
	},

	// 檢查是否可以上香
	canBurnIncense() {
		const lastIncenseTime = localStorage.getItem(LAST_INCENSE_KEY);
		if (!lastIncenseTime) return true;

		const lastTime = new Date(lastIncenseTime).getTime();
		const currentTime = new Date().getTime();
		return currentTime - lastTime >= COOLDOWN_DURATION;
	},

	// 獲取剩餘冷卻時間（毫秒）
	getRemainingCooldown() {
		const lastIncenseTime = localStorage.getItem(LAST_INCENSE_KEY);
		if (!lastIncenseTime) return 0;

		const lastTime = new Date(lastIncenseTime).getTime();
		const currentTime = new Date().getTime();
		const remaining = COOLDOWN_DURATION - (currentTime - lastTime);
		return Math.max(0, remaining);
	},

	// 檢查是否需要更新
	needsUpdate() {
		const data = this.getData();
		if (!data || !data.lastUpdated) return true;

		const lastUpdated = new Date(data.lastUpdated);
		const now = new Date();
		const minutesDiff = (now - lastUpdated) / (1000 * 60);

		return minutesDiff > 5;
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

	// 獲取音樂狀態
	getMusicState() {
		const state = localStorage.getItem(MUSIC_STATE_KEY);
		return state === null ? null : state === "true";
	},

	// 設置音樂狀態
	setMusicState(isPlaying) {
		localStorage.setItem(MUSIC_STATE_KEY, isPlaying.toString());
	},
};
