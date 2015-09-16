'use strict'

var gulp = require('gulp');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var uglify = require('gulp-uglify');
var del = require('del');
var connect = require('gulp-connect');

var BUILD_DIR = 'build/'

// Remove build folder
gulp.task('clean', function() {
    return del(['build/'])
});

// Minify javascripts
gulp.task('js', ['clean'], function() {
    return gulp.src('src/js/csgobind.js')
        .pipe(uglify({ mangle:true }))
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest(BUILD_DIR + 'js/'));
});

// Move html files and update references 
gulp.task('html', ['clean'], function() {
    return gulp.src('src/index.html')
        .pipe(replace('js/csgobind.js', 'js/csgobind.min.js'))
        .pipe(gulp.dest(BUILD_DIR));
});

// Move css files
gulp.task('styles', ['clean'], function() {
    return gulp.src('src/css/*.css')
        .pipe(gulp.dest(BUILD_DIR + 'css/'));
});

// Move datafiles
gulp.task('data', ['clean'], function() {
    return gulp.src('src/csgoitems.json')
        .pipe(gulp.dest(BUILD_DIR));
});

// Move bower components
// TODO change to only grab relevant files
gulp.task('bower_components', ['clean'], function() {
    var components = [   ];
    return gulp.src('src/bower_components/**')
        .pipe(gulp.dest(BUILD_DIR + 'bower_components/'));
});


//--- [START]  Gulp connect live reload ---//

gulp.task('connect', function() {
    connect.server({
        root: 'src',
        livereload: true
    });
});

gulp.task('html-connect', function () {
    gulp.src(['./src/*.html'])
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch(['./src/*.html', './src/css/*.css', './src/js/*.js'], ['html-connect']);
});
 
//--- [END] Gulp connect live reload ---//





// Run this for live reload when code is changed
gulp.task('reload', ['connect', 'watch']);

// Default, builds project 
gulp.task('default', ['js', 'html', 'styles','data', 'bower_components']);
