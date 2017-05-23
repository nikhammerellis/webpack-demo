const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');
const glob = require('glob');

const parts = require('./webpack.parts');


const PATHS = {
  app: path.join(__dirname, 'app'), 
  build: path.join(__dirname, 'build'),
};

const commonConfig = merge([
  {
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
      new webpack.LoaderOptionsPlugin({
        options: {
          eslint: {
            //fail only on errors
            failOnWarning: false,
            failOnError: true,
            //toggle auto fix
            fix: false,
            //output to jenkins compatible XML
            outputReport: {
              filePath: 'checkstyle.xml',
              formatter: require('eslint/lib/formatters/checkstyle'), 
            },
          },
        },
      }),
    ], 
  },
  parts.lintJavaScript({ include: PATHS.app }),
  parts.lintCSS({ include: PATHS.app }),
  parts.loadFonts({
    options: {
      name: '[name].[ext]',
    },
  }),
]);

const productionConfig = merge([
  //extraction MUST happen before purifying
  parts.extractCSS({
    use: ['css-loader', parts.autoprefix()],
  }),
  parts.purifyCSS({
    paths: glob.sync('${PATHS.app}/**/*', { nodir: true }),
  }),
  parts.loadImages({
    options: {
      limit: 15000,
      name: '[name].[ext]',
    }
  })
]);

const developmentConfig = merge([
  parts.devServer({
    // Customize host/port here if needed
    host: process.env.HOST,
    port: process.env.PORT,
  }),
  parts.loadCSS(),
  parts.loadImages(),
]);   
  
module.exports = (env) => {
  if (env === 'production') {
    return merge(commonConfig, productionConfig);
  }

  return merge(commonConfig, developmentConfig);
};
