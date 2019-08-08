const { dest, series, src, watch } = require('gulp')
const { spawn } = require('child_process')
const hugoBin = require('hugo-bin')
const PluginError = require('plugin-error')
const log = require('fancy-log')
const less = require('gulp-less')
const autoprefixer = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')
const BrowserSync = require('browser-sync')
const webpack = require('webpack')
const webpackConfig = require('./webpack.config')

const path = require('path')

const isDev = process.env.NODE_ENV === 'development'
console.log(`Running Gulp with ENV: ${isDev ? 'development' : 'production'}`)

const browserSync = BrowserSync.create()

// Hugo arguments
const hugoArgsDefault = ['-d', './dist', '-s', '.', '-v']
const hugoArgsPreview = ['--buildDrafts', '--buildFuture']

// Development tasks
exports.hugo = buildSite

// Build/production tasks
exports.build = series(series(buildCss, buildJs), cb =>
  buildSite(cb, [], 'production')
)
exports.buildPreview = series(series(buildCss, buildJs), cb =>
  buildSite(cb, hugoArgsPreview, 'production')
)

// Development server with browsersync
exports.server = series(
  // 初次启动的时候运行 js/css 和 build site，避免脏数据
  buildSite,
  series(buildCss, buildJs),
  () => {
    browserSync.init({
      host: '0.0.0.0',
      ui: {
        port: 4000,
      },
      port: 3005,
      server: {
        baseDir: './dist',
      },
    })

    watch('./src/js/**/*.js', buildJs)
    watch('./src/less/**/*.less', buildCss)
    watch('./{data,content,layouts,static}/**/*', buildSite) // Todo more specific monitor
  }
)

// Compile CSS with PostCSS and Minify CSS
function buildCss(cb) {
  src('./src/less/**/*.less')
    .pipe(
      less({
        paths: [path.join(__dirname, 'less', 'includes')],
      })
    )
    .pipe(
      autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false,
      })
    )
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(dest('./dist/css'))
    .pipe(browserSync.stream())

  cb()
}

// Compile Javascript
function buildJs(cb) {
  const myConfig = Object.assign({}, webpackConfig)

  webpack(myConfig, (err, stats) => {
    if (err) {
      throw new PluginError('webpack', err)
    }
    log(
      '[webpack]',
      stats.toString({
        colors: true,
        progress: true,
      })
    )
    browserSync.reload()
    cb && cb()
  })
}

/**
 * Run hugo and build the site
 */
function buildSite(cb, options, environment = 'development') {
  console.log('running build site - hugo')
  const args = options ? hugoArgsDefault.concat(options) : hugoArgsDefault

  process.env.NODE_ENV = environment

  return spawn(hugoBin, args, { stdio: 'inherit' }).on('close', code => {
    browserSync.reload()
    cb && cb()

    // if (code === 0) {
    //   browserSync.reload();
    //   cb();
    // } else {
    //   browserSync.notify("Hugo build failed :(");
    //   cb("Hugo build failed");
    // }
  })
}
