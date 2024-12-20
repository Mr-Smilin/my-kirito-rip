/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: 0 },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: 0 },
				},
				// 左下角動畫
				leftBottomIn: {
					"0%": {
						transform: "translate(-100%, 100%) rotate(-30deg)",
						opacity: "0",
					},
					"100%": {
						transform: "translate(0, 0) rotate(0deg)",
						opacity: "1",
					},
				},
				leftBottomOut: {
					"0%": {
						transform: "translate(0, 0) rotate(0deg)",
						opacity: "1",
					},
					"100%": {
						transform: "translate(-100%, 100%) rotate(-30deg)",
						opacity: "0",
					},
				},

				// 上方中心動畫
				topCenterIn: {
					"0%": {
						transform: "translateX(100%)",
						opacity: "0",
					},
					"100%": {
						transform: "translateX(-50%)",
						opacity: "1",
					},
				},
				topCenterOut: {
					"0%": {
						transform: "translateX(-50%)",
						opacity: "1",
					},
					"100%": {
						transform: "translateX(-100%)",
						opacity: "0",
					},
				},

				// 右側隨機動畫
				rightRandomIn: {
					"0%": {
						transform: "translate(100%, -50%) scale(0.8)",
						opacity: "0",
					},
					"100%": {
						transform: "translate(0, -50%) scale(1)",
						opacity: "1",
					},
				},
				rightRandomOut: {
					"0%": {
						transform: "translate(0, -50%) scale(1)",
						opacity: "1",
					},
					"100%": {
						transform: "translate(100%, -50%) scale(0.8)",
						opacity: "0",
					},
				},

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
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				leftBottom:
					"leftBottomIn 1s ease-out forwards, leftBottomOut 1s ease-in 4s forwards",
				topCenter:
					"topCenterIn 1.5s ease-out forwards, topCenterOut 1.5s ease-in 3.5s forwards",
				rightRandom:
					"rightRandomIn 1s ease-out forwards, rightRandomOut 1s ease-in 4s forwards",
			},
		},
	},
	plugins: [],
};
