const gulp = require('gulp');
const path = require('path');

gulp.task('copy-icon', () => {
  return gulp.src('nodes/Censys/censys.png')
    .pipe(gulp.dest('dist/nodes/Censys/'));
});

gulp.task('build:icons', gulp.series('copy-icon')); 