/**
 * Gulp file for the Iridium Framework.
 * This file is part of Iridium Framework project.
 *
 * Iridium Framework is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Iridium Framework is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Iridium Framework. If not, see <http://www.gnu.org/licenses/>.
 *
 * @author rayleigh <rayleigh@protonmail.com>
 * @copyright 2017 Vladislav Pashaiev
 * @license LGPL-3.0+
 * @version 0.1-indev
 */

const gulp = require('gulp');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const runSequence = require('run-sequence');
const del = require('del');
const path = require('path');

/**
 * Config file.
 */
const conf = require('./config.json');

const src = 'src/',
	  dist = 'dist/';

gulp.task('build', (c) =>
{
	runSequence('clean',
		['copy:css', 'copy:js'],
		['min:css', 'min:js'],
		['merge:css', 'merge:js', 'merge:min:css', 'merge:min:js'],
		c);
});

gulp.task('clean', () => del.sync(dist + '*'));

gulp.task('copy:css', () =>
{
	let paths = conf.modules.map((modName) => path.join(src, 'css', modName + '.css'));
	return gulp.src(paths).pipe(gulp.dest(path.join(dist, 'modules', 'full', 'css')));
});

gulp.task('copy:js', () =>
{
	let paths = conf.modules.map((modName) => path.join(src, 'js', modName + '.js'));
	return gulp.src(paths).pipe(gulp.dest(path.join(dist, 'modules', 'full', 'js')));
});

gulp.task('min:css', () =>
{
	return gulp.src(dist + 'modules/full/css/*.css')
		.pipe(cleanCSS())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(dist + 'modules/css'));
});

gulp.task('min:js', () =>
{
	return gulp.src(dist + 'modules/full/js/*.js')
		.pipe(uglify().on('error', (e) =>
		{
			console.log(e);
		}))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(dist + 'modules/js'));
});

gulp.task('merge:css', () =>
{
	let paths = conf.modules.map((modName) => path.join(dist, 'modules', 'full', 'css', modName + '.css'));
	return gulp.src(paths).pipe(concat('iridium.css')).pipe(gulp.dest(dist));
});

gulp.task('merge:js', () =>
{
	let paths = conf.modules.map((modName) => path.join(dist, 'modules', 'full', 'js', modName + '.js'));
	return gulp.src(paths).pipe(concat('iridium.js')).pipe(gulp.dest(dist));
});

gulp.task('merge:min:css', () =>
{
	let paths = conf.modules.map((modName) => path.join(dist, 'modules', 'css', modName + '.min.css'));
	return gulp.src(paths)
		.pipe(concat('iridium.min.css'))
		.pipe(gulp.dest(dist));
});

gulp.task('merge:min:js', () =>
{
	let paths = conf.modules.map((modName) => path.join(dist, 'modules', 'js', modName + '.min.js'));
	return gulp.src(paths)
		.pipe(concat('iridium.min.js', {newLine: ';'}))
		.pipe(gulp.dest(dist));
});