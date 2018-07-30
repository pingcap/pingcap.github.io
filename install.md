

./node_modules/webpack/bin/webpack.js ./src/js/app.js --output-filename ./dist/app.bundle.js


run webpack without inline configuration，通过webpack.config.js


dev-server
npm install --save-dev webpack-dev-server


html-webpack-plugin
To automatically inject <script> tags with our bundled application we’ll use html-webpack-plugin.


babel
npm install --save-dev babel-core babel-loader babel-preset-env babel-preset-react
babelrc - 配置 presets
babel-preset-env is successor of babel-preset-es2015 and it has couple of big advantages,https://github.com/babel/babel-preset-env
We also added some sugar, so you can import those files without specifying file extension.:
resolve: {
  extensions: ['.js', '.jsx'],
}


css/styles
npm install --save-dev css-loader extract-text-webpack-plugin
extract it to the external file by using extract-text-webpack-plugin.
import '../css/main.css'; // Import CSS -> ADDED IN THIS STEP

// Files will get handled by css loader and then passed to the extract text plugin
// which will write it to the file we defined above
{
  test: /\.css$/,
  loader: ExtractTextPlugin.extract({
    use: 'css-loader',
  }),
}

new ExtractTextPlugin('main.css'), // CSS will be extracted to this bundle file -> ADDED IN THIS STEP


file
add file-loader. As it’s name suggests it handles files - images, SVGs, fonts, videos or anything else you need.
npm install --save-dev file-loader

import keenImage from '../assets/keen.png'; // Importing image -> ADDED IN THIS STEP
<img src={ keenImage } alt='Commander Keen' />


## 代码格式化
Prettier is an opinionated code formatter. 支持js,jsx, css/less/scs, json
安装 https://github.com/prettier/prettier-atom 和 linter-es


## webapck 集成
https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/581
new ExtractTextPlugin('main.css'), // CSS will be extracted to this bundle file -> ADDED IN THIS STEP
同时在app.js中至少要import 一个css文件
