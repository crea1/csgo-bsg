var config = require('../config');
var gulp   = require('gulp');
var connect = require('gulp-connect');

gulp.task('connect', function() {
    connect.server({
        root: 'build',
        livereload: true
    });
});

gulp.task('html-connect', ['default'], function () {
    gulp.src(['./build/*.html'])
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch(['./src/*.html', './src/scss/*.scss', './src/js/*.js'], ['html-connect']);
});


// Run this for live reload when code is changed
gulp.task('reload', ['connect', 'watch', 'default']);
