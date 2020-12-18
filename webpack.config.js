const path = require('path')
const glob = require('glob')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'
const srcDir = path.join(__dirname, 'src', 'js')
const entries = glob
  .sync('*.js', {
    cwd: srcDir,
  })
  .map(key => [key.replace('.js', ''), path.resolve(srcDir, key)])
const entryObj = Object.fromEntries(entries)

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: entryObj,
  output: {
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
