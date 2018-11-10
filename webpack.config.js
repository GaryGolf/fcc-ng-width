const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');



const devConfig = {
  mode: 'development',
  entry: path.resolve(__dirname, './src/index.ts'),
  output: { filename: 'dist/index.js' },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 3000,
    hot: true
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader', exclude: /node_modules/ },
      { test: /\.css$/, use: ['style-loader','css-loader'], exclude: /node_modules/ },
      { test: /\.html$/, loader: 'html-loader' }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.vue']
  },
  plugins: [
    new HtmlWebpackPlugin({ template: path.resolve(__dirname, './template.html') })
  ]
}

module.exports = devConfig;