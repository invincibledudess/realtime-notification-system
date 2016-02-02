'use strict';

var gulp = require('gulp'),
	gulpIf = require('gulp-if'),
	eslint = require('gulp-eslint');

function isESLintFixedApplied(file) {
	return file.eslint !== null && file.eslint.fixed;
}

gulp.task('lint', function() {
	return gulp.src(['./**/*.js', '!node_modules/**/*.js', '!client/static/**/*.js'])
		.pipe(eslint({
			'fix': true,
			'warnFileIgnored': true
		}))
		.pipe(eslint.format())
		.pipe(gulpIf(isESLintFixedApplied, gulp.dest(function(file) {
			return file.base;
		})))
		.pipe(eslint.failAfterError());
});

gulp.task('default', ['lint']);
