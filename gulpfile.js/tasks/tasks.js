'use strict';

var gulp = require('gulp');
var bump = require('gulp-bump');
var fs = require('fs');
var replace = require('gulp-replace');
var zip = require('gulp-zip');
var config = require('../config');
var del = require('del');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var BUILD_DIR = 'build/';
var DIST_DIR = 'dist/';
function pkg() {
    return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
}

function prepend(str) {
  if (str < 10) {
     return "0" + str;
  }
  return str;
}
var d = new Date();
var CURRENT_DATE = d.getFullYear() + "" + prepend(d.getMonth()+ 1) + "" + d.getDate() + "" + prepend(d.getHours()) + "" + prepend(d.getMinutes()) + "" + prepend(d.getSeconds());


// Remove build folder
gulp.task('clean', function() {
    return del([config.build, config.dist]);
});

// Move html files and update references
gulp.task('html', function() {
    return gulp.src(['src/index.html','src/favicon.ico'])
        .pipe(replace('js/csgobind.js', 'js/csgobind.min.js?ver=' + CURRENT_DATE))
        .pipe(replace('css/style.css', 'css/style.css?ver=' + CURRENT_DATE))
        .pipe(replace('buildVersion', pkg().version))
        .pipe(gulp.dest(BUILD_DIR));
});

// Minify javascripts
gulp.task('js', function() {
    return gulp.src(config.js.src)
        .pipe(uglify({ mangle:true }))
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest(config.js.build));
});

// Move datafiles
gulp.task('data', function() {
    return gulp.src('src/data/*.json')
        .pipe(gulp.dest(BUILD_DIR + 'data/'));
});

// Move images
gulp.task('images', function() {
    return gulp.src('src/images/**')
        .pipe(gulp.dest(BUILD_DIR + 'images/'));
});

// Move bower components
// TODO change to only grab relevant files
gulp.task('bower_components', function() {
    return gulp.src('src/bower_components/**')
        .pipe(gulp.dest(BUILD_DIR + 'bower_components/'));
});

// Version updating
gulp.task('version:pre', function () {
    return gulp.src(['./bower.json', './package.json'])
        .pipe(bump({type: 'prerelease', preid : 'SNAPSHOT'}))
        .pipe(gulp.dest('./'));
});
gulp.task('version:patch', function () {
    return gulp.src(['./bower.json', './package.json'])
        .pipe(bump({type: 'patch'}))
        .pipe(gulp.dest('./'));
});
gulp.task('version:minor', function () {
    return gulp.src(['./bower.json', './package.json'])
        .pipe(bump({type: 'minor'}))
        .pipe(gulp.dest('./'));
});

gulp.task('zip', function () {
    return gulp.src('build/**')
        .pipe(zip('csgo-bsg-' + pkg().version + '.zip'))
        .pipe(gulp.dest(DIST_DIR));
});
