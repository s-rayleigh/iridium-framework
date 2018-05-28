/**
 * Iridium Breakpoints.
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
 * @module breakpoints
 * @requires Iridium
 */


/**
 * Iridium Breakpoints.
 * @namespace
 */
Iridium.Breakpoints = {};

/**
 * List of the callback that called on breakpoint change.
 * @type {Array}
 * @private
 */
Iridium.Breakpoints._onChangeCallbacks = [];

/**
 * Last changed breakpoint.
 * @type {string}
 * @private
 */
Iridium.Breakpoints._lastBreakpoint = '';

/**
 * Responsive breakpoints.
 */
Iridium.Breakpoints.list = {
	/**
	 * Small.
	 * 576px - 767px.
	 */
	sm: 576,

	/**
	 * Medium.
	 * 768px - 991px.
	 */
	md: 768,

	/**
	 * Large.
	 * 992px - 1199px.
	 */
	lg: 992,

	/**
	 * Extra large.
	 * 1200 - infinity.
	 */
	xl: 1200
};

/**
 * Returns list of the responsive breakpoints names.
 * @returns {string[]} List of the responsive breakpoints.
 */
Iridium.Breakpoints.getNames = function()
{
	return Object.keys(this.list);
};

/**
 * Returns current breakpoint that corresponds to the viewport width or empty string if vieport width smaller than
 * sm breakpoint.
 * @returns {string} Current breakpoint.
 */
Iridium.Breakpoints.getCurrent = function()
{
	var vieportWidth = window.innerWidth,
		breakpoints  = this.getNames().reverse();

	for(var i = 0; i < breakpoints.length; i++)
	{
		var bp = breakpoints[i];
		if(this.list[bp] <= vieportWidth)
		{
			return bp;
		}
	}

	return '';
};

/**
 * Adds callback function that will be called on breakpoint change.
 * @param {function} callback Callback function.
 */
Iridium.Breakpoints.addOnChange = function(callback)
{
	if(typeof callback === 'function')
	{
		this._onChangeCallbacks.push(callback);
	}
};

/**
 * Removes callback function.
 * @param {function} callback Callback function.
 */
Iridium.Breakpoints.removeOnChange = function(callback)
{
	if(typeof callback === 'function')
	{
		var i = this._onChangeCallbacks.indexOf(callback);
		if(i !== -1)
		{
			this._onChangeCallbacks.splice(i, 1);
		}
	}
};

// Update breakpoint on resize
window.addEventListener('resize', function()
{
	var _       = Iridium.Breakpoints;
	var current = _.getCurrent();

	if(current !== _._lastBreakpoint)
	{
		_._lastBreakpoint = current;

		for(var i = 0; i < _._onChangeCallbacks.length; i++)
		{
			_._onChangeCallbacks[i](current);
		}
	}
});

// Initialization
Iridium.Init.register('breakpoint', function()
{
	Iridium.Breakpoints._lastBreakpoint = Iridium.Breakpoints.getCurrent();
});