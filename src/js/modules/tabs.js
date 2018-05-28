/**
 * Iridium Tabs.
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
 * @module tabs
 * @requires Iridium
 * @requires Iridium.Init
 * @requires Iridium.UrlData
 */


Iridium.Tabs = (function()
{

	var
		/**
		 * Counter for the tabs elements on the page.
		 * @type {number}
		 */
		tabsCount = 0,

		/**
		 * List of the initialized tabs.
		 * @type {Array}
		 */
		tabs      = [],

		/**
		 * Unique tabs names.
		 * @type {Array}
		 */
		names     = [];

	/**
	 * Iridium Tabs.
	 *
	 * @param {object} params Tabs parameters.
	 * @param {HTMLElement[]} params.buttons Array with buttons.
	 * @param {HTMLElement[]} params.tabs Array with tabs.
	 * @param {int} [params.defaultTab=0] Number of the default tab.
	 * @param {boolean} [params.useUrl=true] Use URL to save number of the active tab.
	 * @param {string} [params.urlKeyName=tab_] Name of the key that is used to store number of the active tab in the url.
	 * @param {string} [params.name] Unique name of the tabs that is used to store number of the active tab in the url. It will replace urlKeyName parameter.
	 *
	 * @constructor
	 */
	function Tabs(params)
	{
		var _ = this;

		_._params = {
			defaultTab: 0,
			useUrl: true,
			urlKeyName: 'tab_'
		};

		Iridium.merge(_._params, params);

		if(!(Array.isArray(_._params.buttons) && _._params.buttons.length))
		{
			throw new Error('Parameter "buttons" should be an array with elements.');
		}

		if(!(Array.isArray(_._params.tabs) && _._params.tabs.length))
		{
			throw new Error('Parameter "tabs" should be an array with elements.');
		}

		if(_._params.name)
		{
			if(names.indexOf(_._params.name) !== -1)
			{
				throw new Error('Tabs name already taken by another tabs.');
			}

			names.push(_._params.name);
		}

		/**
		 * Number of the tabs element on the page.
		 * @type {number}
		 * @private
		 */
		_._tabsNum = tabsCount++;

		/**
		 * Unique name of the tabs.
		 * @type {string}
		 * @private
		 */
		_._tabsName = _._params.name ? _._params.name : _._params.urlKeyName + _._tabsNum;

		if(_._params.useUrl && Iridium.UrlData.has(_._tabsName))
		{
			_.show(parseInt(Iridium.UrlData.get(_._tabsName)));
		}
		else
		{
			_.show(_._params.defaultTab);
		}

		// Click event listeners for the buttons
		var buttons = _._params.buttons;
		for(var i = 0; i < buttons.length; i++)
		{
			if(buttons[i] instanceof HTMLElement)
			{
				buttons[i].addEventListener('click', function(i)
				{
					return function(e)
					{
						e.preventDefault();
						_.show(i);
					};
				}(i));
			}
		}

		tabs.push(_);
	}

	/**
	 * Shows tab with the specified number.
	 * @param tabNumber Number of the tab.
	 */
	Tabs.prototype.show = function(tabNumber)
	{
		var tabs    = this._params.tabs,
			buttons = this._params.buttons,
			opened  = false;

		buttons.forEach(function(btn)
		{
			if(btn instanceof HTMLElement)
			{
				Iridium.removeClass(btn, 'active');
			}
		});

		if(buttons[tabNumber] instanceof HTMLElement)
		{
			Iridium.addClass(buttons[tabNumber], 'active');
		}

		for(var i = 0; i < tabs.length; i++)
		{
			var tab = tabs[i];

			if(!(tab instanceof HTMLElement))
			{
				continue;
			}

			if(i === tabNumber)
			{
				tab.style.display = '';

				if(typeof this._params.onShow === 'function')
				{
					this._params.onShow(i);
				}

				if(this._params.useUrl)
				{
					Iridium.UrlData.set(this._tabsName, i + '');
				}

				opened = true;
			}
			else
			{
				tab.style.display = 'none';
			}
		}

		return opened;
	};

	/**
	 * Updates current tab to correspond specified index in the url (uses UrlData module).
	 */
	Tabs.prototype.update = function()
	{
		if(Iridium.UrlData.has(this._tabsName))
		{
			this.show(parseInt(Iridium.UrlData.get(this._tabsName)));
		}
	};

	/**
	 * List of the initialized tabs.
	 * @property {Tabs[]} list
	 * @memberOf Tabs
	 * @readonly
	 * @static
	 */
	Object.defineProperty(Tabs, 'list', {
		enumerable: false,
		get: function()
		{
			// Return copy
			return tabs.slice();
		}
	});

	/**
	 * Finds and returns tabs by the unique name.
	 * @param {string} name Name of the tabs.
	 * @returns {Tabs|null}
	 * @static
	 */
	Tabs.getByName = function(name)
	{
		for(var i = 0; i < tabs.length; i++)
		{
			if(tabs[i]._tabsName && tabs[i]._tabsName === name)
			{
				return tabs[i];
			}
		}

		return null;
	};

	/**
	 * Updates all tabs to correspond specified index in the url (uses UrlData module).
	 * @static
	 */
	Tabs.update = function()
	{
		this.list.forEach(function(t) { t.update(); });
	};

	// Initialization
	Iridium.Init.register('ir-tabs', function(element)
	{
		tabsCount    = 0;
		tabs.length  = 0;
		names.length = 0;

		var tabsElements = element.querySelectorAll('[data-ir-tabs]');

		for(var i = 0; i < tabsElements.length; i++)
		{
			var te = tabsElements[i];

			var buttons   = te.querySelectorAll('[data-ir-tabs-btn]'),
				container = document.getElementById(te.dataset.irTabs);

			if(!(buttons.length && container))
			{
				continue;
			}

			new Tabs({
				buttons: Array.prototype.slice.call(buttons),
				tabs: Array.prototype.slice.call(container.children),
				name: te.dataset.irTabsName
			});
		}
	});

	return Tabs;
}());