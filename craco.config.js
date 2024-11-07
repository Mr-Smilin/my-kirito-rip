const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
	webpack: {
		configure: (webpackConfig) => {
			webpackConfig.optimization = {
				minimize: true,
				minimizer: [
					new TerserPlugin({
						terserOptions: {
							compress: {
								drop_console: true,
								drop_debugger: true,
							},
							format: {
								comments: false,
							},
							mangle: {
								safari10: true,
							},
						},
						extractComments: false,
					}),
				],
			};
			return webpackConfig;
		},
	},
};
