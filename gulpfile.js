'use strict'

var gulp = require('gulp');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var uglify = require('gulp-uglify');

var BUILD_DIR = 'build/'

gulp.task('js', function() {
    return gulp.src('js/csgobind.js')
        .pipe(uglify({ mangle:true }))
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest(BUILD_DIR + 'js/'));
});

gulp.task('html', function() {
    return gulp.src('index.html')
        .pipe(replace('js/csgobind.js', 'js/csgobind.min.js'))
        .pipe(gulp.dest(BUILD_DIR));
});

gulp.task('styles', function() {
    return gulp.src('css/*.css')
        .pipe(gulp.dest(BUILD_DIR + 'css/'));
});

gulp.task('data', function() {
    return gulp.src('csgoitems.json')
        .pipe(gulp.dest(BUILD_DIR));
});

gulp.task('bower_components', function() {
    var components = [   ];
    return gulp.src('bower_components/**')
        .pipe(gulp.dest(BUILD_DIR + 'bower_components/'));
});

gulp.task('default', ['js', 'html', 'styles','data', 'bower_components']);
