/**
 * Iridium URL Data.
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
 * @module url_data
 * @requires Iridium
 */


/**
 * Iridium URL Data.
 * @namespace
 */
Iridium.UrlData = {};

/**
 * Returns value by specified key.
 * @param {string|undefined} key Key.
 */
Iridium.UrlData.get = function(key)
{
	return this.getAll()[key];
};

/**
 * Returns all pairs of keys and values.
 * @returns {{}} Pairs.
 */
Iridium.UrlData.getAll = function()
{
	var hashPairs = window.location.hash.slice(1).split('&'),
		result    = {};

	hashPairs.forEach(function(pairStr)
	{
		var pair = pairStr.split('=');

		if(pair.length !== 2)
		{
			return;
		}

		result[pair[0].trim()] = pair[1].trim();
	});

	return result;
};

/**
 * Sets value by the key.
 * @param {string} key Key.
 * @param {string} value Value.
 */
Iridium.UrlData.set = function(key, value)
{
	var all  = this.getAll();
	all[key] = value;
	this.setAll(all);
};

/**
 * Sets all pairs of keys and values from the specified object.
 * @param all
 */
Iridium.UrlData.setAll = function(all)
{
	if(typeof all !== 'object')
	{
		return;
	}

	var pairs = [];

	for(var key in all)
	{
		pairs.push(key + '=' + all[key]);
	}

	window.location.hash = '#' + pairs.join('&');
};

/**
 * Returns true specified key exist.
 * @param {string} key Key.
 * @returns {boolean} True if specified key exist.
 */
Iridium.UrlData.has = function(key)
{
	return this.getAll().hasOwnProperty(key);
};

/**
 * Removes value by key.
 * @param key
 */
Iridium.UrlData.remove = function(key)
{
	var all = this.getAll();
	delete all[key];
	this.setAll(all);
};

/**
 * Removes all values.
 */
Iridium.UrlData.removeAll = function()
{
	window.location.hash = '';
};