'use strict';

const jshint = require('gulp-jshint');
const gulp = require('gulp');
const stylish = require('jshint-stylish');
const nodemon = require('nodemon');

gulp.task('lint', function () {
    // all files in this project need to follow our standarts
    return gulp.src([ './**/*.js', '!./node_modules/**/*.js', '!./package_build_dir/**/*.js' ])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('serve', function () {
    nodemon({
        script: './bin/revsw-trafficalerter.js',
        ext: 'js json',
        env: { 'NODE_ENV': process.env.NODE_ENV }
    });
});

gulp.task('default', ['serve']);
