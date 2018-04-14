var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  livereload = require('gulp-livereload'),
  ts = require('gulp-typescript');

var tsProject = ts.createProject('tsconfig.json');

gulp.task('typescript', function() {
  console.log('Compiling TypeScript');

  return tsProject
    .src()
    .pipe(tsProject())
    .js.pipe(gulp.dest('./dist'));
});

gulp.task('serve', ['typescript'], function() {
  gulp.watch('./**/*.ts', ['typescript']);

  livereload.listen();
  // npm i ts-node
  nodemon({
    exec: 'ts-node ./src/index.ts',
    ext: 'ts'
  }).on('restart', function() {
    setTimeout(function() {
      console.log('reload!');
      livereload.reload();
    }, 500);
  });
});
