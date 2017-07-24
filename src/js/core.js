/**
 * Iridium Framework core file.
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
 */
var Iridium = {
	version: '0.0.1 indev'
};

/**
 * Генерирует случайный идентификатор с заданной длиной.
 * @param {int} [length = 5] Длина идентификатора.
 * @return {string} Сгенерированный идентификатор.
 */
Iridium.randomId = function(length)
{
	length = length || 5;

	var result = '',
		min = 33, max = 126; //Диапазон кодов символов

	for(var i = 0; i < length; i++)
	{
		result += String.fromCharCode(Math.floor(Math.random() * (max - min + 1) + min));
	}

	return result;
}

/**
 * Преобразует число типа float в тип int.
 * @param {float} fn Число типаа float.
 * @return {int} Число типа int.
 */
function floatToInt(fn)
{
	return fn | 0;
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
 * Добавляет класс объекту.
 * @param {HTMLElement} element
 * @param {string} className
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
 * Удаляет класс объекта.
 * @param {HTMLElement} object
 * @param {string} className
 */
Iridium.removeClass = function(object, className)
{
	if(!object.className)
	{
		return;
	}

	var t = object.className.split(' '),
		i = t.indexOf(className);

	if(i < 0)
	{
		return;
	}

	t.splice(i, 1);
	object.className = t.join(' ');
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
 * @param {object} target Target object.
 * @param {...object} sources Source objects.
 * @return {object} Result object.
 */
Iridium.merge = function(target, sources)
{
	'use strict';

	//null and undefined
	if(typeof target !== 'object')
	{
		throw new TypeError('First argument must be an object.');
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

			target[key] = source[key];
		}
	}

	return result;
}

/**
 * Рекурсивно копирует объект.
 * @see http://stackoverflow.com/questions/728360/most-elegant-way-to-clone-a-javascript-object
 * TODO: move to core methods
 */
function clone(obj)
{
	var copy;

	//Обрабатываем 3 простых типа случая
	if(obj === null || obj === undefined || typeof obj !== 'object')
	{
		return obj;
	}

	//Обрабатываем как дату
	if(obj instanceof Date)
	{
		copy = new Date();
		copy.setTime(obj.getTime());
		return copy;
	}

	//Обрабатываем как массив рекурсивно
	if(obj instanceof Array)
	{
		copy = [];

		for(var i = 0, len = obj.length; i < len; i++)
		{
			copy[i] = clone(obj[i]);
		}

		return copy;
	}

	//Обрабатываем как объект
	if(obj instanceof Object)
	{
		copy = {};

		for(var attr in obj)
		{
			if(obj.hasOwnProperty(attr))
			{
				copy[attr] = clone(obj[attr]);
			}
		}

		return copy;
	}

	throw new Error("Невозможно скопировать объект. Неподдерживаемый тип!");
}

/**
 * Проверяет является-ли объект элементом HTML.
 * @param {object} obj Объект.
 * @returns {boolean} True, если объект является элементом HTML.
 */
function isElement(obj)
{
	if(typeof HTMLElement === 'object')
	{
		return obj instanceof HTMLElement;
	}

	return !!obj && typeof obj.nodeName === 'string';
}

/**
 * Создает крестик закрытия в формате svg
 * @deprecated Use SVG
 */
function createCloseCross()
{
	var xmlns = 'http://www.w3.org/2000/svg';

	var cross = document.createElementNS(xmlns, 'svg');
	cross.setAttributeNS('', 'viewBox', '0 0 16 16');

	var g = document.createElementNS(xmlns, 'g');
	g.setAttributeNS('', 'stroke-width', '3');
	g.setAttributeNS('', 'stroke-linecap', 'round');

	var path1 = document.createElementNS(xmlns, 'path'),
		path2 = document.createElementNS(xmlns, 'path');

	path1.setAttributeNS('', 'd', 'M 2 2 L 14 14');
	path2.setAttributeNS('', 'd', 'M 2 14 L 14 2');

	g.appendChild(path1);
	g.appendChild(path2);

	cross.appendChild(g);
	cross.setAttribute('class', 'close-cross unselectable');

	return cross;
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
 * Переадресовывает на указанный URL.
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
	/**
	 * Определяет, содержит ли массив определённый элемент, возвращая в зависимости от этого true или false.
	 * @param {*} searchElement Искомый элемент
	 * @returns {boolean}
	 */
	Array.prototype.includes = function(searchElement)
	{
		return this.indexOf(searchElement) !== -1;
	};
}