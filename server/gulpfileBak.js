var gulp = require('gulp');
var ts = require('gulp-typescript');
var nodemon = require('gulp-nodemon');
var tsProject = ts.createProject('tsconfig.json');

gulp.task('build', function() {
  return tsProject
    .src()
    .pipe(tsProject())
    .js.pipe(gulp.dest('./dist'));
});

// These tasks setup nodemon.
gulp.task('start', function(cb) {
  var options = {
    watch: ['src'],
    ext: 'ts',
    ignore: ['src/**/*.spec.ts'],
    exec: 'ts-node ./src/index.ts'
  };
  nodemon(options);
  //nodemon.on('start', cb);
});

gulp.task('watch', ['start'], function() {
  gulp.watch(['./src/**/*']);
});
