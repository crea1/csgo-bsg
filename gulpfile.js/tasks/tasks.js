'use strict';

var gulp = require('gulp');
var bump = require('gulp-bump');
var connect = require('gulp-connect');
var fs = require('fs');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var runSequence = require('run-sequence');
var uglify = require('gulp-uglify');
var zip = require('gulp-zip');

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

// Minify javascripts
gulp.task('js', function() {
    return gulp.src('src/js/csgobind.js')
        .pipe(uglify({ mangle:true }))
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest(BUILD_DIR + 'js/'));
});

// Move html files and update references 
gulp.task('html', function() {
    return gulp.src(['src/index.html','src/favicon.ico'])
        .pipe(replace('js/csgobind.js', 'js/csgobind.min.js?ver=' + CURRENT_DATE))
        .pipe(replace('css/style.css', 'css/style.css?ver=' + CURRENT_DATE))
        .pipe(replace('buildVersion', pkg().version))
        .pipe(gulp.dest(BUILD_DIR));
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
    gulp.src(['./bower.json', './package.json'])
        .pipe(bump({type: 'prerelease', preid : 'SNAPSHOT'}))
        .pipe(gulp.dest('./'));
    return gulp.src;
});
gulp.task('version:patch', function () {
    return gulp.src(['./bower.json', './package.json'])
        .pipe(bump({type: 'patch'}))
        .pipe(gulp.dest('./'));
});
gulp.task('version:minor', function () {
    gulp.src(['./bower.json', './package.json'])
        .pipe(bump({type: 'minor'}))
        .pipe(gulp.dest('./'));
    return gulp.src;
});


//--- [START]  Gulp connect live reload ---//

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
 
//--- [END] Gulp connect live reload ---//

gulp.task('release:dev', ['default'], function () {
    return gulp.src('build/**')
        .pipe(zip('csgo-bsg-' + pkg().version +'-'+ CURRENT_DATE + '.zip'))
        .pipe(gulp.dest(DIST_DIR));
});

gulp.task('release:prod', function () {
    runSequence('version:patch', 
        'default',
        function() {
            return gulp.src('build/**')
            .pipe(zip('csgo-bsg-' + pkg().version +'.zip'))
            .pipe(gulp.dest(DIST_DIR));
        });
});

// Run this for live reload when code is changed
gulp.task('reload', ['connect', 'watch', 'default']);

// Default, builds project 
gulp.task('default', function() {
    runSequence('clean',
        ['js', 'html', 'styles','data', 'bower_components', 'images']
    );
});

