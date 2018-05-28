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
 * @copyright 2018 Vladislav Pashaiev
 * @license LGPL-3.0+
 */

const gulp        = require('gulp'),
	  rename      = require('gulp-rename'),
	  replace     = require('gulp-replace'),
	  concat      = require('gulp-concat'),
	  cleanCSS    = require('gulp-clean-css'),
	  uglify      = require('gulp-uglify'),
	  sass        = require('gulp-sass'),
	  gulpif      = require('gulp-if'),
	  del         = require('del'),
	  path        = require('path'),
	  fs          = require('fs');

const config         = require('./config');
const modulesManager = require('./modules').manager;

modulesManager.enable(config.modules);
let modules = modulesManager.list;

/**
 * Main paths.
 * @namespace
 */
const paths = {

	/**
	 * Sources directory.
	 */
	src: 'src',

	/**
	 * SCSS directory.
	 */
	scss: 'scss',

	/**
	 * Build directory.
	 */
	build: 'assembly',

	/**
	 * Modules subdirectory.
	 */
	modules: 'modules'
};

/**
 * Clean assembly.
 */
const clean = () => del(path.join(paths.build, '*'));
clean.description = 'Cleans assembly directory.';

/**
 * Build javascript.
 */
let buildJS = () => {
	let srcPaths       = getModulesPaths('js'),
		destComponents = [paths.build];

	if(config.separateJs)
	{
		destComponents.push('js');
	}

	return gulp.src(srcPaths)
		.pipe(gulpif(!config.separateJs, concat('iridium.js')))
		.pipe(gulp.dest(path.join.apply(null, destComponents)))
		.pipe(uglify().on('error', (e) => console.err(e)))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(path.join.apply(null, destComponents)));
};

/**
 * Build SCSS.
 */
let buildSCSS = () => {
	let srcPaths = getModulesPaths('scss');

	return gulp.src(path.join(paths.src, paths.scss, '/**/*.scss'), {base: path.join(paths.src, paths.scss)})
		.pipe(replace('// Modules', function()
		{
			let p = path.dirname(path.relative('', this.file.path)) + path.sep;
			return '// Modules\n' + srcPaths.map(function(srcPath)
			{
				return `@import '${srcPath.replace(p, '').slice(0, -5)}';\n`;
			}).join('');
		}))
		.pipe(gulp.dest(path.join(paths.build, paths.scss)));
};

/**
 * Build CSS.
 */
let buildCSS = () =>
{
	return gulp.src(path.join(paths.build, paths.scss, '/**/iridium.scss'))
		.pipe(sass.sync().on('error', sass.logError))
		.pipe(gulp.dest(paths.build))
		.pipe(cleanCSS())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(paths.build));
};

/**
 * Builds the project.
 */
const build = gulp.series(clean, gulp.parallel(buildJS, config.css ? gulp.series(buildSCSS, buildCSS) : buildSCSS));
build.description = 'Builds the project.';

module.exports = {
	clean: clean,
	build: build
};

/**
 * Creates and return paths to the modules of the selected type.
 * @param {'js'|'scss'} type Type.
 * @returns {Array} Paths to the modules.
 */
function getModulesPaths(type)
{
	if(!(type === 'js' || type === 'scss'))
	{
		throw new Error('Type should be "js" or "scss".');
	}

	let srcPaths = [];

	for(let module of modules)
	{
		let pathComponents = [paths.src, type];

		if(!module.core)
		{
			pathComponents.push(paths.modules);
		}

		let filePath = path.join.apply(null, pathComponents.concat([module.name + '.' + type]));

		if(fs.existsSync(filePath))
		{
			srcPaths.push(filePath);
			continue;
		}

		let dirPath = path.join.apply(null, pathComponents.concat([module.name, 'module.' + type]));

		if(fs.existsSync(dirPath))
		{
			srcPaths.push(dirPath);
		}
	}

	return srcPaths;
}