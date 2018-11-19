const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');

const devConfig = {
  mode: 'development',
  entry: path.resolve(__dirname, './src/index.ts'),
  output: { 
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 3000,
    hot: true
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader', exclude: /node_modules/ },
      { test: /\.css$/, use: ['style-loader', 'css-loader']},
      { test: /\.html$/, loader: 'html-loader' }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.vue']
  },
  externals: { 'angular': 'angular' },
  plugins: [
    new HtmlWebpackPlugin({ template: path.resolve(__dirname, './template.html') }),
    new HtmlWebpackExternalsPlugin({ externals: [{ module: 'angular', entry: 'angular.js' }] })
  ]
}

module.exports = devConfig;
