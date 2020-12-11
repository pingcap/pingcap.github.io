const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'
const pathJoinSrcJs = name => path.join(__dirname, 'src', 'js', name)

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: {
    app: pathJoinSrcJs('app'),
    doc: pathJoinSrcJs('doc'),
    about: pathJoinSrcJs('about'),
    recruit: pathJoinSrcJs('recruit'),
    tidb_planet: pathJoinSrcJs('tidb_planet'),
    devcon: pathJoinSrcJs('devcon'),
    community: pathJoinSrcJs('community'),
    tidb_planet_user: pathJoinSrcJs('tidb_planet_user'),
    multi_slides_carousel: pathJoinSrcJs('multi_slides_carousel'),
    carousel: pathJoinSrcJs('carousel'),
    video_on_modal: pathJoinSrcJs('video_on_modal'),
    anchor: pathJoinSrcJs('anchor'),
    tidb_performance_challenge: pathJoinSrcJs('tidb_performance_challenge'),
    tidb_usability_challenge: pathJoinSrcJs('tidb_usability_challenge'),
    tidb_4_challenge: pathJoinSrcJs('tidb_4_challenge'),
    high_performance_tidb_challenge: pathJoinSrcJs('high_performance_tidb_challenge'),
    developer_sig: pathJoinSrcJs('developer_sig'),
    hackathon2020: pathJoinSrcJs('hackathon2020'),
  },
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
