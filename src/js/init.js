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
 * @copyright 2017 Vladislav Pashaiev
 * @license LGPL-3.0+
 * @module init
 * @requires Iridium
 * @version 0.1-indev
 */

/**
 * Callback function for the module initialization.
 * @param {HTMLElement} element Element for the initialization.
 * @callback InitCallback
 */

if(Iridium)
{
	/**
	 * Iridium Init.
	 * @namespace
	 */
	Iridium.Init = {};

	(function()
	{
		/**
		 * List of the callback functions for the initialization.
		 * @type {InitCallback[]}
		 */
		var list = [];

		/**
		 * Registers callback function for the initialization.
		 * @param {InitCallback} callback Callback function for the initialization.
		 */
		Iridium.Init.register = function(callback)
		{
			if(typeof callback === 'function')
			{
				list.push(callback);
			}
		};

		/**
		 * Clears initialization list.
		 */
		Iridium.Init.clear = function()
		{
			list.length = 0;
		};

		/**
		 * Launch initialization for specified element.
		 * @param {HTMLElement} [element=document.body] Element for the initialization.
		 */
		Iridium.Init.launch = function(element)
		{
			if(!(element instanceof HTMLElement))
			{
				element = document.body;
			}

			list.forEach(function(callback)
			{
				callback(element);
			});
		};
	}());

	window.addEventListener('load', function()
	{
		Iridium.Init.launch();
	});
}
else
{
	console.error('Iridium Framework Core must be included to be able to use Iridium Init.');
}