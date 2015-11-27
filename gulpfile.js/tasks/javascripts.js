var config = require('../config');
var gulp   = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

// Minify javascripts
gulp.task('js', function() {
    return gulp.src(config.js.src)
        .pipe(uglify({ mangle:true }))
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest(config.js.build));
});

