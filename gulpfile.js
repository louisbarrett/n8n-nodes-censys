const gulp = require('gulp');
const path = require('path');

gulp.task('copy-node-icon', () => {
  return gulp.src('nodes/Censys/censys.png')
    .pipe(gulp.dest('dist/nodes/Censys/'));
});

gulp.task('copy-credential-icon', () => {
  return gulp.src('nodes/Censys/censys.png')
    .pipe(gulp.dest('dist/credentials/'));
});

gulp.task('build:icons', gulp.series('copy-node-icon', 'copy-credential-icon')); 