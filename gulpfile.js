var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rimraf = require('rimraf');

var paths = {
  scripts: ['src/**/*.js', '!src/**/*_test.js'],
  destination: './dist'
};

gulp.task('clean', function (cb) {
	rimraf(paths.destination, cb);
});

gulp.task('scripts-min', ['clean'], function() {
  // Minify and copy all JavaScript (except vendor scripts)
  // with sourcemaps all the way down
  return gulp.src(paths.scripts)
    .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(concat('ngPrint.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.destination));
});

gulp.task('scripts-debug', function() {
  // Minify and copy all JavaScript (except vendor scripts)
  // with sourcemaps all the way down
  return gulp.src(paths.scripts)
      .pipe(concat('ngPrint.debug.js'))
    .pipe(gulp.dest(paths.destination));
});

gulp.task('build', ['clean', 'scripts-min', 'scripts-debug']);

gulp.task('default', ['build']);