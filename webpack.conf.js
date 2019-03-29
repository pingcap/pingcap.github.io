import webpack from 'webpack'
import path from 'path'

const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const PreloadWebpackPlugin = require('preload-webpack-plugin')
const isDev = process.env.NODE_ENV === 'development'

const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

export default {
  entry: {
    app: [path.join(__dirname, 'src', 'js', 'app')],
    doc: [path.join(__dirname, 'src', 'js', 'doc')],
    about: [path.join(__dirname, 'src', 'js', 'about')],
    recruit: [path.join(__dirname, 'src', 'js', 'recruit')],
    tidb_planet: [path.join(__dirname, 'src', 'js', 'tidb_planet')],
    devcon: [path.join(__dirname, 'src', 'js', 'devcon')],
    community: [path.join(__dirname, 'src', 'js', 'community')],
    tidb_planet_user: [path.join(__dirname, 'src', 'js', 'tidb_planet_user')],
    multi_slides_carousel: [
      path.join(__dirname, 'src', 'js', 'multi_slides_carousel'),
    ],
    carousel: [path.join(__dirname, 'src', 'js', 'carousel')],
    video_on_modal: [path.join(__dirname, 'src', 'js', 'video_on_modal')],
    carousel: [path.join(__dirname, 'src', 'js', 'carousel')],
  },
  output: {
    path: path.join(__dirname, 'dist', 'js'),
    publicPath: '/js/',
    filename: '[name].js',
    chunkFilename: '[name].[chunkhash:5].chunk.js',
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
          publicPath: '/css/',
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
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['app'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        keepClosingSlash: true,
        preserveLineBreaks: true,
        removeTagWhitespace: true,
        removeEmptyAttributes: true,
        trimCustomFragments: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      filename: path.join(__dirname, 'layouts', '_default', 'baseof.html'),
      template: path.join(__dirname, 'layouts', '_default', 'baseof.tpl.html'),
    }),
    new PreloadWebpackPlugin({
      rel: 'preload',
      as(entry) {
        if (/\.css$/.test(entry)) return 'style'
        if (/\.(woff)|(woff2)|(ttf)$/.test(entry)) return 'font'
        if (/\.(png)|(jpg)|(svg)|(gif)$/.test(entry)) return 'image'
        return 'script'
      },
      include: 'initial',
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
      fetch: 'imports-loader?this=>global!exports?global.fetch!whatwg-fetch',
    }),
    // This helps ensure the builds are consistent if source hasn't changed:
    new webpack.optimize.OccurrenceOrderPlugin(),
    // Minify the code.
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: !isDev, // React doesn't support IE8
        warnings: false,
      },
      mangle: {
        screw_ie8: !isDev,
      },
      output: {
        comments: false,
        screw_ie8: !isDev,
      },
    }),
  ],
  externals: [/^vendor\/.+\.js$/],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
}
