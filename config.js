/**
 * Build configuration file.
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

module.exports = exports = {

	/**
	 * Modules to build.
	 * Core modules are builded anyway.
	 *
	 * Lists:
	 *   Core: core, init
	 *   Modules: net, breakpoints, builder, url_data, animation, combobox, data_list, popup, svg, tabs, tooltip, touchable
	 * @type {string[]}
	 */
	modules: ['net', 'animation', 'tooltip', 'popup', 'svg', 'combobox', 'tabs', 'touchable'],

	/**
	 * Build JS to the separate files.
	 * @type {boolean}
	 */
	separateJs: false,

	/**
	 * Compile sass to the css if true.
	 * @type {boolean}
	 */
	css: true
};