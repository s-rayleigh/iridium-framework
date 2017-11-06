/**
 * Iridium Builder.
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
 * @module builder
 * @requires Iridium
 * @version 0.1-indev
 */


if(Iridium)
{
	/**
	 * Iridium Builder.
	 *
	 * @param {object} data Element data.
	 * @param {string} [data.tag = div] Element tag.
	 * @param {string} [data.id] Element identifier.
	 * @param {string|string[]} [data.class] Element class.
	 * @param {string} [data.html] Element inner HTML.
	 * @param {string|string[]} [data.bool] Boolean attributes.
	 * @param {object.<function|function[]>} [data.on] Element events listeners.
	 *
	 * @param {object[]|Element[]} [data.childs] Child elements.
	 *
	 * @param {string} [data.method=post] Form method.
	 * @param {string} [data.action] Form action.
	 *
	 * @param {string} [data.name] Input name.
	 * @param {string} [data.type=text] Input type.
	 * @param {*} [data.value] Input value.
	 * @param {string} [data.pattern] Input pattern.
	 * @param {string} [data.placeholder] Input placeholder.
	 * @param {string} [data.title] Input title.
	 * @param {number} [data.min] Input min number.
	 * @param {number} [data.max] Input max number.
	 * @param {number} [data.step] Input number change step.
	 * @param {boolean} [data.checked] Checkbox checked state.
	 *
	 * @param {string} [data.for] Label 'for' attribute.
	 *
	 * @constructor
	 */
	Iridium.Builder = function(data)
	{
		this.build = function()
		{
			function buildElement(elementData)
			{
				//Default tag - div
				elementData.tag = typeof elementData.tag === 'string' ? elementData.tag : 'div';
				var element = document.createElement(elementData.tag);

				if(typeof elementData.id === 'string')
				{
					element.id = elementData.id;
				}

				if(elementData.class != null)
				{
					if(typeof elementData.class === 'string')
					{
						element.className = elementData.class;
					}

					if(Array.isArray(elementData.class))
					{
						element.className = elementData.class.join(' ');
					}
				}

				if(typeof elementData.html === 'string')
				{
					element.innerHTML = elementData.html;
				}

				// Boolean attributes
				if(typeof elementData.bool === 'string')
				{
					element.setAttribute(elementData.bool, elementData.bool);
				}
				else if(Array.isArray(elementData.bool))
				{
					elementData.bool.forEach(function(b)
					{
						if(typeof b === 'string')
						{
							element.setAttribute(b, b);
						}
					});
				}

				//Form attributes
				if(elementData.tag === 'form')
				{
					//Form method
					element.method = typeof elementData.method === 'string' ? elementData.method : 'post';

					//Form action
					if(typeof elementData.action === 'string')
					{
						element.action = elementData.action;
					}
				}

				//Input attributes
				if(elementData.tag === 'input')
				{
					if(typeof elementData.name === 'string')
					{
						element.name = elementData.name;
					}

					element.type = typeof elementData.type === 'string' ? elementData.type : 'text';

					if(elementData.value)
					{
						element.value = elementData.value;
					}

					if(typeof elementData.pattern === 'string')
					{
						element.pattern = elementData.pattern;
					}

					if(typeof elementData.placeholder === 'string')
					{
						element.placeholder = elementData.placeholder;
					}

					if(typeof elementData.title === 'string')
					{
						element.title = elementData.title;
					}

					if(typeof elementData.min === 'number')
					{
						element.min = elementData.min;
					}

					if(typeof elementData.max === 'number')
					{
						element.max = elementData.max;
					}

					if(typeof elementData.step === 'number')
					{
						element.step = elementData.step;
					}

					if(typeof elementData.checked === 'boolean')
					{
						element.checked = elementData.checked;
					}

					if(typeof elementData.size === 'number')
					{
						element.size = elementData.size;
					}

					if(typeof elementData.maxlength === 'number')
					{
						element.maxlength = elementData.maxlength;
					}
				}

				if(elementData.tag === 'label' && typeof elementData.for === 'string')
				{
					element.htmlFor = elementData.for;
				}

				//Event listeners (array of functions or function)
				if(typeof elementData.on === 'object')
				{
					for(var eventType in elementData.on)
					{
						var listener = elementData.on[eventType];

						if(typeof listener === 'function')
						{
							element.addEventListener(eventType, listener);
						}

						if(Array.isArray(listener))
						{
							listener.forEach(function(listenerItem)
							{
								if(typeof listenerItem !== 'function')
								{
									return;
								}

								element.addEventListener(eventType, listenerItem);
							});
						}
					}
				}

				//Element childs (recursive, object or Element)
				if(Array.isArray(elementData.childs))
				{
					elementData.childs.forEach(function(childData)
					{
						if(typeof childData !== 'object')
						{
							return;
						}

						element.appendChild(childData instanceof Element ? childData : buildElement(childData));
					});
				}

				return element;
			}

			return buildElement(data);
		};
	};
}
else
{
	console.error('Iridium Framework Core must be included to be able to use Iridium Builder.');
}