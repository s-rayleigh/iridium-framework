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
 * @copyright 2018 Vladislav Pashaiev
 * @license LGPL-3.0+
 * @module combobox
 * @requires Iridium
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


/**
 * Iridium Combobox.
 *
 * @example
 * var combobox = new Iridium.Combobox({
	 * 	data: ['first', 'second', 'third'],
	 * 	strict: true,
	 * 	hintsNumber: 0
	 * });
 * document.body.appendChild(combobox);
 *
 * @param {object} parameters Parameters.
 *
 * @param {string[]|object[]|Iridium.DataList} parameters.data Data to display as hints.
 *
 * @param {boolean} [parameters.strict=false] Strict mode.
 * User must select one of the proposed variants otherwise an empty string will be returned.
 *
 * @param {boolean} [parameters.select=false] Disable text input and allow only hint selection.
 * That generates hints from all specified data.
 * Also activates hints display on combobox click.
 *
 * @param {boolean} [parameters.button=false] Create button in combobox layout that shows hints on click.
 * @param {Element|string} [parameters.buttonContent] Content of the combobox button. Can be html element or
 * raw html text that will be placed in innerHTML of the button.
 *
 * @param {boolean} [parameters.emptyInputHints=false] Display all hints from data if no text in the input field.
 *
 * @param {number} [parameters.hintsNumber=5] Number of the hints to display. To display unlimited ammount, set to 0.
 *
 * @param {ElementViewCallback} [parameters.mapElementView] Callback function that returns view for the element.
 * @param {ElementValueCallback} [parameters.mapElementValue] Callback function that returns value of the element.
 *
 * @param {object} [parameters.dataListParams] Parameters for the DataList usage.
 * @param {boolean} [parameters.dataListParams.autoload=true] Load DataList during combobox creation.
 * @param {boolean} [parameters.dataListParams.autoreload=false] Autoload DataList on text input.
 * @param {string} [parameters.dataListParams.filterFieldName] Name of the parameter of filter for the elements.
 * @param {string} [parameters.dataListParams.numberFieldName] Name of the parameter of elements number to load.
 *
 * @return {HTMLElement} Combobox element.
 *
 * @constructor
 */
Iridium.Combobox = function(parameters)
{
	var params = {
		data: null,
		strict: false,
		select: false,
		button: false,
		buttonContent: null,
		emptyInputHints: false,
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
		useDataList  = false,
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
			var loadData                                    = {};
			loadData[params.dataListParams.numberFieldName] = params.hintsNumber;
			params.data.setPostData(loadData);
		}

		if(params.dataListParams.autoload)
		{
			params.data.load();
		}
	}

	var combobox = document.createElement('combo-box'),
		field    = document.createElement('input'),
		hints    = document.createElement('div');

	hints.className = 'ir-cb-hints';
	field.type      = 'text';
	field.setAttribute('autocomplete', 'off');

	combobox.appendChild(field);
	combobox.appendChild(hints);

	if(params.button)
	{
		var button = document.createElement('button');

		if(params.buttonContent instanceof Element)
		{
			button.appendChild(params.buttonContent);
		}
		else if(typeof params.buttonContent === 'string')
		{
			button.innerHTML = params.buttonContent;
		}

		button.className = 'ir-cb-btn';
		button.addEventListener('click', function(e)
		{
			e.preventDefault();
			e.stopPropagation();
			updateHints(true);
			setHintsVisible(isHintsVisible() ? false : hints.children.length > 0);
		});

		combobox.appendChild(button);
	}

	if(params.emptyInputHints || params.select)
	{
		updateHints();
	}

	if(params.select)
	{
		field.disabled = true;
		combobox.addEventListener('click', function()
		{
			setHintsVisible(hints.children.length > 0);
		});
	}

	Object.defineProperties(combobox, {
		'value': {
			get: function()
			{
				var result;

				if(matchElement)
				{
					result = matchElement;

					if(typeof params.mapElementValue === 'function')
					{
						result = params.mapElementValue(result);
					}
				}
				else
				{
					if(params.strict)
					{
						return '';
					}

					result = field.value;
				}

				return result;
			},
			set: function(val)
			{
				field.value = val;
				onInput();
			}
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
		},
		'inputElement': {
			get: function() { return field; }
		}
	});

	function setHintsVisible(visible)
	{
		hints.style.display = visible ? '' : 'none';
	}

	function isHintsVisible()
	{
		return hints.style.display !== 'none';
	}

	function hintSelected(val)
	{
		field.value = val;
		onInput();

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

	function onInput()
	{
		updateHints();

		try
		{
			combobox.dispatchEvent(new Event('input'));
		}
		catch(e)
		{
			var event = document.createEvent('Event');
			event.initEvent('input', true, true);
			combobox.dispatchEvent(event);
		}

		setHintsVisible(hints.children.length > 0 && document.activeElement === field);
	}

	/**
	 * Updates hints.
	 * @param all Create all hints based on data.
	 */
	function updateHints(all)
	{
		//Remove hints
		while(hints.children.length > 0)
		{
			hints.removeChild(hints.children[0]);
		}

		function addHints()
		{
			var len        = getDataArray().length,
				exactMatch = null;

			for(var i = 0; i < len && (params.hintsNumber === 0 || i < params.hintsNumber); i++)
			{
				var element     = getDataArray()[i],
					elementView = element;

				if(typeof params.mapElementView === 'function')
				{
					elementView = params.mapElementView(elementView);
				}

				var lowcaseElementView = elementView.toLowerCase(),
					lowcaseFieldValue  = field.value.toLowerCase();

				// If select is defined, display all hints
				// If emptyInputHints is defined, display all hints if no input text
				// otherwise display only hints that contains input text
				if(all || params.select || params.emptyInputHints && !field.value || field.value && Iridium.stringContains(lowcaseFieldValue, lowcaseElementView))
				{
					var hintElement       = document.createElement('div');
					hintElement.className = 'ir-cb-hint';

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

		selHintIndex = -1;
	}

	setHintsVisible(false);

	field.addEventListener('input', function()
	{
		onInput();
	});

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

	field.addEventListener('focus', function(e)
	{
		field.select();
		setHintsVisible(hints.children.length > 0);
	});

	field.addEventListener('blur', function()
	{
		setHintsVisible(false);
	});

	combobox.hideHints = function()
	{
		setHintsVisible(false);
	};

	Iridium.Combobox.list.push(combobox);

	return combobox;
}

Iridium.Combobox.list = [];

window.addEventListener('click', function(e)
{
	// Leave only comboboxes tha are in body
	Iridium.Combobox.list = Iridium.Combobox.list.filter(function(cb)
	{
		return document.body.contains(cb);
	});

	// Hide hints on all comboboxes except target one
	Iridium.Combobox.list.forEach(function(cb)
	{
		if(e.target !== cb && !cb.contains(e.target))
		{
			cb.hideHints();
		}
	});
});
