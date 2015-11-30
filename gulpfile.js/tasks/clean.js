var config = require('../config');
var gulp   = require('gulp');
var del = require('del');

// Remove build folder
gulp.task('clean', function() {
    return del([config.build, config.dist]);
});

