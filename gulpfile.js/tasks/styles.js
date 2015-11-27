var config = require('../config');
var gulp   = require('gulp');
var sass   = require('gulp-sass');

// Compile sass files
gulp.task('styles', ['clean'], function () {
    gulp.src('src/bower_components/bootstrap-sass/assets/fonts/**')
        .pipe(gulp.dest(config.build + '/fonts/'));

    return gulp.src('src/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(config.build + '/css/'));
});


