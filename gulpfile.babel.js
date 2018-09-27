import gulp from 'gulp'
import { spawn } from 'child_process'
import hugoBin from 'hugo-bin'
import gutil from 'gulp-util'
import less from 'gulp-less'
import autoprefixer from 'gulp-autoprefixer'
import cleanCSS from 'gulp-clean-css'
import BrowserSync from 'browser-sync'
import webpack from 'webpack'
import webpackConfig from './webpack.conf'

import path from 'path'

const isDev = process.env.NODE_ENV === 'development'
console.log(`Running Gulp with ENV:${isDev ? 'development' : 'production'}`)

const browserSync = BrowserSync.create()

// Hugo arguments
const hugoArgsDefault = ['-d', './dist', '-s', '.', '-v']
const hugoArgsPreview = ['--buildDrafts', '--buildFuture']

// Development tasks
gulp.task('hugo', cb => buildSite(cb))
gulp.task('hugo-preview', cb => buildSite(cb, hugoArgsPreview))

// Build/production tasks
gulp.task('build', ['css', 'js'], cb => buildSite(cb, [], 'production'))
gulp.task('build-preview', ['css', 'js'], cb =>
  buildSite(cb, hugoArgsPreview, 'production')
)

// Compile CSS with PostCSS and Minify CSS
const buildCss = () => {
  gulp
    .src('./src/less/**/*.less')
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
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream())
}
gulp.task('css', buildCss)

// Compile Javascript
function buildJs(cb) {
  const myConfig = Object.assign({}, webpackConfig)

  webpack(myConfig, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err)
    gutil.log(
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
gulp.task('js', buildJs)

// Development server with browsersync
const jsTask = isDev ? ['js'] : ['js', 'hugo']
const styleTask = isDev ? ['css'] : ['css', 'hugo']
gulp.task('server', ['hugo', 'css', 'js'], () => {
  // 初次启动的时候运行 js/css 和 build site，避免脏数据
  buildJs(buildSite)
  buildCss()
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

  gulp.watch('./src/js/**/*.js', jsTask)
  gulp.watch('./src/less/**/*.less', styleTask)
  gulp.watch('./{data,content,layouts,static}/**/*', ['hugo']) // Todo more specific monitor
})

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
