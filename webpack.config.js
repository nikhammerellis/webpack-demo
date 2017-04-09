const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PATHS = {
  app: path.join(__dirname, 'app'), 
  build: path.join(__dirname, 'build'),
};

const commonConfig = {
  entry: 
  {
    app: PATHS.app,
  }, 
  output: 
  {
    path: PATHS.build,
    filename: '[name].js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Webpack demo',
    }),
  ], 
};

const productionConfig = () => commonConfig;

const developmentConfig = () => {
  const config = {
    devServer: {
			// Enable history API fallback so HTML5 History API based
      // routing works. Good for complex setups.
      historyApiFallback: true,
      // Display only errors to reduce the amount of output.
      stats: 'errors-only',
      host: process.env.HOST, // Defaults to `localhost`
      port: process.env.PORT, // Defaults to 8080
    },
  };
  return Object.assign(
    {},
    commonConfig,
		config 
	);
};



module.exports = (env) => {
  if (env === 'production') {
    return productionConfig();
  }

  return developmentConfig();
};
