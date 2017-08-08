/**
 * Iridium Combobox.
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
 * @module combobox
 * @requires Iridium
 * @version 0.1-indev
 */

/**
 * Callback function that returns view for the element.
 * @callback ElementViewCallback
 * @param {*} element Element.
 * @return {string} View of the element.
 */

/**
 * Callback function that returns value of the element.
 * @callback ElementValueCallback
 * @param {*} element Element.
 * @return {*} Value of the element.
 */

if(Iridium)
{
	/**
	 * Iridium Combobox.
	 *
	 * @param {object} parameters Parameters.
	 *
	 * @param {string[]|object[]|Iridium.DataList} parameters.data Data to display as hints.
	 *
	 * @param {boolean} [parameters.strict=false] Strict mode.
	 * User must select one of the proposed variants otherwise an empty string will be returned.
	 *
	 * @param {integer} [parameters.hintsNumber=5] Number of the hints to display. To display unlimited ammount, set to 0.
	 *
	 * @param {ElementViewCallback} [parameters.mapElementView] Callback function that returns view for the element.
	 * @param {ElementValueCallback} [parameters.mapElementValue] Callback function that returns value of the element.
	 *
	 * @param {object} [parameters.dataListParams] Parameters for the DataList usage.
	 * @param {boolean} [parameters.autoload=true] Load DataList during combobox creation.
	 * @param {boolean} [parameters.autoreload=false] Autoload DataList on text input.
	 * @param {string} [parameters.filterFieldName] Name of the parameter of filter for the elements.
	 * @param {string} [parameters.numberFieldName] Name of the parameter of elements number to load.
	 *
	 * @return {HTMLElement} Combobox element.
	 * @constructor
	 */
	Iridium.Combobox = function(parameters)
	{
		var params = {
			data: null,
			strict: false,
			hintsNumber: 5,
			mapElementView: null,
			mapElementValue: null,
			dataListParams: {
				autoload: true,
				autoreload: false,
				filterFieldName: '',
				numberFieldName: ''
			}
		};

		Iridium.merge(params, parameters);

		if(!params.data)
		{
			throw new Error("Parameter 'data' must be defined.");
		}

		var selHintIndex = -1,
			useDataList = false,
			matchElement = null;

		// DataList support
		if(Iridium.DataList && params.data instanceof Iridium.DataList)
		{
			if(!params.mapElementView && !params.mapElementValue)
			{
				throw new Error("Parameters 'mapElementView' and 'mapElementValue' must be assigned to be able to use DataList as data array.");
			}

			useDataList = true;

			if(params.dataListParams.numberFieldName && params.hintsNumber > 0)
			{
				var loadData = {};
				loadData[params.dataListParams.numberFieldName] = params.hintsNumber;
				params.data.setPostData(loadData);
			}

			if(params.dataListParams.autoload)
			{
				params.data.load();
			}
		}

		var combobox = document.createElement('combo-box'),
			field = document.createElement('input'),
			hints = document.createElement('div');

		hints.className = 'ir-cb-hints';
		field.type = 'text';

		combobox.appendChild(field);
		combobox.appendChild(hints);

		Object.defineProperties(combobox, {
			'value': {
				get: function()
				{
					var result;

					if(matchElement)
					{
						result = matchElement;
					}
					else
					{
						if(params.strict)
						{
							return '';
						}

						result = field.value;
					}

					if(typeof params.mapElementValue === 'function')
					{
						result = params.mapElementValue(result);
					}

					return result;
				},
				set: function(val) { field.value = val; }
			},
			'id': {
				get: function() { return field.id; },
				set: function(val) { field.id = val; }
			},
			'pattern': {
				get: function() { return field.pattern; },
				set: function(val) { field.pattern = val; }
			},
			'placeholder': {
				get: function() { return field.placeholder; },
				set: function(val) { field.placeholder = val; }
			},
			'title': {
				get: function() { return field.title; },
				set: function(val) { field.title = val; }
			},
			'required': {
				get: function() { return field.required; },
				set: function(val) { field.required = val; }
			}
		});

		function setHintsVisible(visible)
		{
			hints.style.display = visible ? '' : 'none';
		}

		function hintSelected(val)
		{
			field.value = val;

			if(typeof params.onHintSelected === 'function')
			{
				params.onHintSelected();
			}

			updateHints();
		}

		function getDataArray()
		{
			return useDataList ? params.data.list : params.data;
		}

		function updateHints()
		{
			//Remove hints
			while(hints.children.length > 0)
			{
				hints.removeChild(hints.children[0]);
			}

			function addHints()
			{
				if(!field.value)
				{
					return;
				}

				var len = getDataArray().length,
					exactMatch = null;

				for(var i = 0; i < len && (params.hintsNumber === 0 || i < params.hintsNumber); i++)
				{
					var element = getDataArray()[i],
						elementView = element;

					if(typeof params.mapElementView === 'function')
					{
						elementView = params.mapElementView(elementView);
					}

					var lowcaseElementView = elementView.toLowerCase(),
						lowcaseFieldValue = field.value.toLowerCase();

					// Contains
					if(Iridium.stringContains(lowcaseFieldValue, lowcaseElementView))
					{
						var hintElement           = document.createElement('div');
						hintElement.className     = 'ir-cb-hint';

						hintElement.addEventListener('mousedown', function()
						{
							hintSelected(this);
						}.bind(elementView));

						hintElement.appendChild(document.createTextNode(elementView));
						hints.appendChild(hintElement);
					}

					// Search for the first exact match
					if(lowcaseElementView === lowcaseFieldValue && !exactMatch)
					{
						exactMatch = element;
					}
				}

				matchElement = exactMatch;
			}

			if(useDataList && params.dataListParams.autoreload)
			{
				var loadData = {};

				if(params.dataListParams.filterFieldName && field.value)
				{
					loadData[params.dataListParams.filterFieldName] = field.value;
				}

				params.data.updatePostData(loadData);
				params.data.load(addHints);
			}
			else
			{
				addHints();
			}

			setHintsVisible(hints.children.length > 0 && document.activeElement === field);
			selHintIndex = -1;
		}

		setHintsVisible(false);

		field.addEventListener('input', updateHints);

		field.addEventListener('keydown', function(e)
		{
			if(!hints.children.length)
			{
				return;
			}

			if(e.keyCode === 38 || e.keyCode === 40)
			{
				e.preventDefault();

				var currentHint = hints.children[selHintIndex];
				if(currentHint)
				{
					Iridium.removeClass(currentHint, 'selected');
				}

				if(e.keyCode === 38) // Up
				{ selHintIndex--; }
				else if(e.keyCode === 40) // Down
				{ selHintIndex++; }

				if(selHintIndex < 0)
				{
					selHintIndex = -1;
				}

				if(selHintIndex > hints.children.length - 1)
				{
					selHintIndex = hints.children.length - 1;
				}

				Iridium.addClass(hints.children[selHintIndex], 'selected');
			}
			else if(e.keyCode === 13) //Enter
			{
				e.preventDefault();

				if(selHintIndex >= 0)
				{
					hintSelected(hints.children[selHintIndex].innerHTML);
					matchElement = getDataArray()[selHintIndex];
					field.blur();
				}
			}
		});

		field.addEventListener('focus', function()
		{
			field.select();
			setHintsVisible(hints.children.length > 0);
		});

		field.addEventListener('blur', function()
		{
			setHintsVisible(false);
		});

		//Далее все обработчики событий, которые будут добавляться объекту combobox, на самом деле будут добавляться field
		combobox.addEventListener = function(event, callback, bub)
		{
			field.addEventListener(event, callback, bub);
		};

		return combobox;
	}
}
else
{
	console.error('Iridium Framework Core and Net must be included to be able to use Iridium Combobox.');
}