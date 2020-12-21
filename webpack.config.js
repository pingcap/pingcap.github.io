const path = require('path')
const glob = require('glob')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const isDev = process.env.NODE_ENV === 'development'

// dynamic add js files to entry object
const entryObj = glob
  .sync(path.join(__dirname, './src/js/*.js'))
  .reduce((entries, path) => {
    let arr = path.split('/')
    entries[arr[arr.length - 1]] = path
    return entries
  }, {})

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: entryObj,
  output: {
    filename: '[name]',
    path: path.join(__dirname, 'dist', 'js'),
    publicPath: '/js/',
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: path.join(__dirname, 'layouts', '_default', 'baseof.html'),
      template: path.join(__dirname, 'layouts', '_default', 'baseof.tpl.html'),
      chunks: ['app'],
    }),
  ],
  optimization: {
    minimizer: [new UglifyJsPlugin()],
  },
}
