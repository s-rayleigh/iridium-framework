/**
 * Iridium Init.
 * Used for the modules initialization.
 *
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
 * @module init
 * @requires Iridium
 */

/**
 * Callback function for the module initialization.
 * @param {HTMLElement} element Element for the initialization.
 * @callback InitCallback
 */

/**
 * Iridium Init.
 * @namespace
 */
Iridium.Init = {};

(function()
{
	/**
	 * List of the callback functions for the initialization.
	 */
	var list = {};

	/**
	 * Registers callback function for the initialization.
	 * @param {string} name Name of the module.
	 * @param {InitCallback} callback Callback function for the initialization.
	 */
	Iridium.Init.register = function(name, callback)
	{
		if(typeof name === 'string' && typeof callback === 'function')
		{
			if(list.hasOwnProperty(name))
			{
				throw new Error('Specified name is already in use.');
			}

			list[name] = callback;
		}
	};

	/**
	 * Clears initialization list.
	 */
	Iridium.Init.clear = function()
	{
		list = {};
	};

	/**
	 * Launch initialization for specified element for the registered modules.
	 * @param {HTMLElement} [element] Element for the initialization.
	 * @param {string[]} [names] Names of the modules to initialize. If not specified, initialize all registered modules.
	 */
	Iridium.Init.launch = function(element, names)
	{
		if(!(element instanceof HTMLElement))
		{
			throw new Error('Element must be instance of HTMLElement.');
		}

		for(var name in list)
		{
			if(Array.isArray(names) && !names.includes(name))
			{
				continue;
			}

			list[name](element);
		}
	};
}());

window.addEventListener('load', function()
{
	Iridium.Init.launch(document.body);
});
