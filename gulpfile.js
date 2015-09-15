'use strict'

var gulp = require('gulp');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var uglify = require('gulp-uglify');
var del = require('del');

var BUILD_DIR = 'build/'

// Remove build folder
gulp.task('clean', function() {
    return del(['build/'])
});

// Minify javascripts
gulp.task('js', ['clean'], function() {
    return gulp.src('js/csgobind.js')
        .pipe(uglify({ mangle:true }))
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest(BUILD_DIR + 'js/'));
});

// Move html files and update references 
gulp.task('html', ['clean'], function() {
    return gulp.src('index.html')
        .pipe(replace('js/csgobind.js', 'js/csgobind.min.js'))
        .pipe(gulp.dest(BUILD_DIR));
});

// Move css files
gulp.task('styles', ['clean'], function() {
    return gulp.src('css/*.css')
        .pipe(gulp.dest(BUILD_DIR + 'css/'));
});

// Move datafiles
gulp.task('data', ['clean'], function() {
    return gulp.src('csgoitems.json')
        .pipe(gulp.dest(BUILD_DIR));
});

// Move bower components
// TODO change to only grab relevant files
gulp.task('bower_components', ['clean'], function() {
    var components = [   ];
    return gulp.src('bower_components/**')
        .pipe(gulp.dest(BUILD_DIR + 'bower_components/'));
});

gulp.task('default', ['js', 'html', 'styles','data', 'bower_components']);
