var gulp = require('gulp');
var path = require('path');

var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var nodemon = require('gulp-nodemon');

const cssDirPath = path.resolve(__dirname, './public/stylesheets');

const cssPaths = [path.resolve(cssDirPath, 'style.scss')];

gulp.task('css', function() {
  return gulp
    .src(cssPaths)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(cssDirPath));
});

gulp.task('sass:watch', function() {
  gulp.watch(cssPaths, ['css']);
});

gulp.task('server', ['sass:watch'], function() {
  nodemon({
    script: './bin/www'
  });
});
