const gulp = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');


gulp.task('uglify', () => {
  console.log('[--uglify task--]');
  gulp.src(SRC + '/js/**/*.js')
      .pipe(uglify({preserveComments: 'some'}))
      .pipe(gulp.dest(DST + '/js/'));
});

gulp.task('concat', () => {
  console.log('[--concat task--]');
  gulp.src(SRC + '/js/')
      .pipe(concat('main.min.js'))
      .pipe(gulp.dest(DST + '/js/'));
});
