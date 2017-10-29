'use strict';

var gulp = require('gulp');
var zip = require('gulp-zip');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

var files = ['manifest.json', 'ui.html', 'bundle.js', 'main.css', 'monkey-light.svg', 'monkey-dark.svg', 'monkey-face-light.svg', 'monkey-face-dark.svg', 'settings.html', 'settings.js'];
var xpiName = 'yapm.xpi';

gulp.task('build', function () {
  gulp.src(files)
    .pipe(zip(xpiName))
    .pipe(gulp.dest('.'));
});

gulp.task('browserify', function() {
    return browserify('./main.js')
        .bundle()
        .pipe(source('./bundle.js'))
        .pipe(gulp.dest('.'));
});

gulp.task('default', ['build','browserify']);

gulp.task('watch', ['default'], function() {
	gulp.watch(['*'],['default']);
});