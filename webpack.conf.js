import webpack from 'webpack'
import path from 'path'

const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const isDev = process.env.NODE_ENV === 'development'

export default {
  entry: {
    app: [path.join(__dirname, 'src', 'js', 'app')],
  },
  output: {
    path: path.join(__dirname, 'dist', 'js'),
    publicPath: '/js/',
    filename: '[name].js',
  },

  module: {
    rules: [
      {
        test: /\.((png)|(eot)|(woff)|(woff2)|(ttf)|(svg)|(gif))(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader?name=/[hash].[ext]',
      },
      { test: /\.json$/, loader: 'json-loader' },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          publicPath: 'css/',
          use: 'css-loader',
        }),
      },
      {
        loader: 'babel-loader',
        test: /\.js?$/,
        exclude: /node_modules/,
        query: { cacheDirectory: true },
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      hash: isDev ? false : true,
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      filename: path.join(__dirname, 'layouts', '_default', 'baseof.html'),
      template: path.join(__dirname, 'layouts', '_default', 'baseof.tpl.html'),
    }),
    new ExtractTextPlugin({
      filename: isDev
        ? '../css/[name].css'
        : `../css/[name].[contenthash:8].css`,
    }),
    // new ExtractTextPlugin('style.css'), // CSS will be extracted to this bundle file -> ADDED IN THIS STEP
    new webpack.ProvidePlugin({
      fetch: 'imports-loader?this=>global!exports?global.fetch!whatwg-fetch',
    }),
  ],

  externals: [/^vendor\/.+\.js$/],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
}
