/**
 * Iridium Framework Core.
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

/**
 * Iridium Framework Core.
 * @namespace
 */
var Iridium = {};

/**
 * Generates random id.
 * @param {int} [length=5] Length.
 * @return {string} Generated id.
 */
Iridium.randomId = function(length)
{
	length = length || 5;

	var result = '',
		min = 33, max = 126; // Symbol codes range

	for(var i = 0; i < length; i++)
	{
		result += String.fromCharCode(Math.floor(Math.random() * (max - min + 1) + min));
	}

	return result;
}

/**
 * Проверяет входит-ли подстрока в строку
 * @param {string} needle Подстрока, которая предположительно содержиться в heystack
 * @param {string} haystack Строка, в которой предположительно содержиться подстрока
 * @return {boolean} true - если needle входит в haystack
 */
Iridium.stringContains = function(needle, haystack)
{
	return haystack.indexOf(needle) > -1;
}

/**
 * Checks if the element has specified class.
 * @param {HTMLElement} element
 * @param {string} className
 * @return {boolean}
 */
Iridium.hasClass = function(element, className)
{
	if(!element.className) { return false; }
	return element.className.split(' ').indexOf(className) > -1;
}

/**
 * Add class to the element.
 * @param {HTMLElement} element Element.
 * @param {string} className Class name.
 */
Iridium.addClass = function(element, className)
{
	if(!element.className)
	{
		element.className = className;
		return;
	}

	if(this.stringContains(className, element.className))
	{
		return;
	}

	element.className += ' ' + className;
}

/**
 * Removes class from the element.
 * @param {HTMLElement} element Element.
 * @param {string} className Class name.
 */
Iridium.removeClass = function(element, className)
{
	if(!element.className)
	{
		return;
	}

	var t = element.className.split(' '),
		i = t.indexOf(className);

	if(i < 0)
	{
		return;
	}

	t.splice(i, 1);
	element.className = t.join(' ');
}

/**
 * Returns value of the element style.
 * @param {HTMLElement} element Element.
 * @param {string} styleName Name of the style.
 * @return {string} Value of the style.
 */
Iridium.getStyle = function(element, styleName)
{
	if(!(element instanceof HTMLElement))
	{
		throw new Error('Element should be instance of HTMLElement.');
	}

	if(element.style[styleName]) // style="" (html)
	{
		return element.style[styleName];
	}
	else if(element.currentStyle) // IE css
	{
		return element.currentStyle[styleName];
	}
	else if(window.getComputedStyle) // css
	{
		return window.getComputedStyle(element).getPropertyValue(styleName);
	}

	throw new Error('Cannot get style from the element.');
}

/**
 * Checks if the object is empty
 * @param {object} obj Object.
 * @return {boolean} Returns true if object is empty.
 */
Iridium.empty = function(obj)
{
	var hasOwnProperty = Object.prototype.hasOwnProperty;

	if(obj == null)
	{
		return true;
	}

	if(obj.length > 0)
	{
		return false;
	}

	if(obj.length === 0)
	{
		return true;
	}

	if(typeof obj === 'number')
	{
		return obj === 0;
	}

	if(typeof obj !== 'object')
	{
		return false;
	}

	for(var key in obj)
	{
		if(hasOwnProperty.call(obj, key))
		{
			return false;
		}
	}

	return true;
}

/**
 * Merges the target with the specified objects and returns new object with fields of all specified objects.
 * It also changes target object as the result object.
 * @param {object} target Target object.
 * @param {...object} sources Source objects.
 * @return {object} Result object.
 */
Iridium.merge = function(target, sources)
{
	'use strict';

	if(!target || typeof target !== 'object')
	{
		throw new TypeError('First argument must be passed and be an object.');
	}

	var result = Object(target);

	for(var i = 1; i < arguments.length; i++)
	{
		var source = arguments[i];

		//null and undefined
		if(source == null)
		{
			continue;
		}

		for(var key in source)
		{
			//null and undefined
			if(source[key] == null)
			{
				continue;
			}

			//Merge objects in object
			if(source[key] && target[key] && typeof source[key] === 'object' && typeof target[key] === 'object')
			{
				Iridium.merge(target[key], source[key]);
				continue;
			}

			target[key] = source[key];
		}
	}

	return result;
}

/**
 * Recursively clones object.
 * @param {object} obj Object.
 * @return {*} Cloned object.
 */
Iridium.clone = function(obj)
{
	var copy;

	if(obj === null || obj === undefined || typeof obj !== 'object')
	{
		return obj;
	}

	if(obj instanceof Date)
	{
		copy = new Date();
		copy.setTime(obj.getTime());
		return copy;
	}

	if(obj instanceof Array)
	{
		copy = [];

		for(var i = 0, len = obj.length; i < len; i++)
		{
			copy[i] = Iridium.clone(obj[i]);
		}

		return copy;
	}

	if(obj instanceof Object)
	{
		copy = {};

		for(var attr in obj)
		{
			if(obj.hasOwnProperty(attr))
			{
				copy[attr] = Iridium.clone(obj[attr]);
			}
		}

		return copy;
	}

	throw new Error("Cannot clone the object. Unsupported type.");
}

/**
 * Добавляет в массив элементы переданного массива без создания нового массива
 * @param {Array} array Массив элементов, которые необходимо добавить
 */
Array.prototype.pushArray = function(array)
{
	if(!Array.isArray(array))
	{
		throw new TypeError('Argument must be an array.');
	}

	for(var i = 0; i < array.length; i++)
	{
		this.push(array[i]);
	}
};

/**
 * Преобразовывает кол-во байт в сокращенный вариант с двоичными приставками МЭК.
 * TODO: rewrite
 * @param {int} bytes Кол-во байт.
 * @return {string} Сокращенный вариант с приставками МЭК.
 */
function readableSize(bytes)
{
	var quantities = ['Б', 'КиБ', 'МиБ', 'ГиБ', 'ТиБ', 'ПиБ'], result = bytes, i;

	for(i = 0; result >= 1024;)
	{
		result = bytes / Math.pow(2, ++i * 10);
	}

	//Приводим result к числовому типу, приводим к одному знаку после запятой и опять приводим к числу
	return +(+result).toFixed(1) + ' ' + quantities[i];
}

/**
 * Redirects to the specified URL.
 * @param {string} url URL.
 */
Iridium.goto = function(url)
{
	window.location.href = url;
}

if(!String.prototype.endsWith)
{
	/**
	 * Определяет заканчивается-ли строка подстрокой searchString.
	 * @param {string} searchString
	 * @param {int} [position]
	 * @returns {boolean}
	 */
	String.prototype.endsWith = function(searchString, position)
	{
		var subjectString = this.toString();

		if(position === undefined || position > subjectString.length)
		{
			position = subjectString.length;
		}

		position -= searchString.length;
		var lastIndex = subjectString.indexOf(searchString, position);
		return lastIndex !== -1 && lastIndex === position;
	};
}

if(!Array.prototype.includes)
{
	Array.prototype.includes = function(searchElement)
	{
		return this.indexOf(searchElement) !== -1;
	};
}