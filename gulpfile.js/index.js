var gulp = require('gulp');
require('./tasks/tasks');
require('./tasks/styles');
require('./tasks/livereload');


// default task for building
gulp.task('default', gulp.series('clean', 'js', 'html', 'styles','data', 'bower_components', 'images'));

// Run this for live reload when code is changed
gulp.task('reload', gulp.series('connect', 'watch', 'default'));

// Bump versions and create zip releases
gulp.task('release:dev', gulp.series('default', 'zip'));
gulp.task('release:patch',gulp.series('clean', 'version:patch', 'default', 'zip'));
gulp.task('release:minor',gulp.series('clean', 'version:minor', 'default', 'zip'));
