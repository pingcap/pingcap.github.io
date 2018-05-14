import webpack from 'webpack'
import path from 'path'

const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const isDev = process.env.NODE_ENV === 'development'

const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

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
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          publicPath: '../css/',
          use: 'css-loader',
        }),
      },
      {
        loader: 'babel-loader',
        test: /\.js?$/,
        exclude: /node_modules/,
        query: {
          cacheDirectory: true,
        },
      },
    ],
  },
  plugins:
    process.env.NODE_ENV === 'development'
      ? [
          new HtmlWebpackPlugin({
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
            filename: path.join(
              __dirname,
              'layouts',
              '_default',
              'baseof.html'
            ),
            template: path.join(
              __dirname,
              'layouts',
              '_default',
              'baseof.tpl.html'
            ),
          }),
          new ExtractTextPlugin({
            filename: '../css/style.css',
          }),
          new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
              discardComments: {
                removeAll: true,
              },
            },
            canPrint: true,
          }),
          new webpack.ProvidePlugin({
            fetch:
              'imports-loader?this=>global!exports?global.fetch!whatwg-fetch',
          }),
        ]
      : [
          new HtmlWebpackPlugin({
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
            filename: path.join(
              __dirname,
              'layouts',
              '_default',
              'baseof.html'
            ),
            template: path.join(
              __dirname,
              'layouts',
              '_default',
              'baseof.tpl.html'
            ),
          }),
          new ExtractTextPlugin({
            filename: '../css/style.css',
          }),
          new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
              discardComments: {
                removeAll: true,
              },
            },
          }),
          new webpack.ProvidePlugin({
            fetch:
              'imports-loader?this=>global!exports?global.fetch!whatwg-fetch',
          }),
          // This helps ensure the builds are consistent if source hasn't changed:
          new webpack.optimize.OccurrenceOrderPlugin(),
          // Minify the code.
          new webpack.optimize.UglifyJsPlugin({
            compress: {
              screw_ie8: true, // React doesn't support IE8
              warnings: false,
            },
            mangle: {
              screw_ie8: true,
            },
            output: {
              comments: false,
              screw_ie8: true,
            },
          }),
        ],
  externals: [/^vendor\/.+\.js$/],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
}
