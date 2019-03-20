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
 * @copyright 2019 Vladislav Pashaiev
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
		list      = [];

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
		var _ = this,
			i;

		_._params = {
			defaultTab: 0,
			useUrl: true,
			urlKeyName: 'tab_'
		};

		Iridium.merge(_._params, params);

		if(!(Array.isArray(_._params.buttons) && _._params.buttons.length))
		{
			throw new Error('Parameter "buttons" should be an not empty array.');
		}

		if(!(Array.isArray(_._params.tabs) && _._params.tabs.length))
		{
			throw new Error('Parameter "tabs" should be an array with elements.');
		}

		if(_._params.name)
		{
			if(list.map(function(t) { return t._tabsName; }).includes(_._params.name))
			{
				throw new Error('Tabs name already taken by another tabs.');
			}
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
			_.show(Iridium.UrlData.get(_._tabsName));
		}
		else
		{
			_.show(_._params.defaultTab);
		}

		// Click event listeners for the buttons
		var buttons = _._params.buttons;
		for(i = 0; i < buttons.length; i++)
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

		list.push(_);
	}

	/**
	 * Shows tab with the specified name or number.
	 * @param {number|string} tabId Name or number of the tab.
	 * @returns True if tab is shown.
	 */
	Tabs.prototype.show = function(tabId)
	{
		var tabs    = this._params.tabs,
			buttons = this._params.buttons,
			opened  = false,
			tabNum  = parseInt(tabId),
			i;

		if(isNaN(tabNum))
		{
			tabNum = buttons.map(function(b) { return b.dataset.irTabsBtn; }).indexOf(tabId);
			if(tabNum === -1) { return false; }
		}

		buttons.forEach(function(btn)
		{
			if(btn instanceof HTMLElement)
			{
				btn.classList.remove('active');
			}
		});

		var btn = buttons[tabNum];

		if(btn instanceof HTMLElement)
		{
			btn.classList.add('active');
			if(btn.dataset.irTabsBtn)
			{
				tabId = btn.dataset.irTabsBtn;
			}
		}

		for(i = 0; i < tabs.length; i++)
		{
			var tab = tabs[i];

			if(!(tab instanceof HTMLElement))
			{
				continue;
			}

			if(i === tabNum)
			{
				tab.style.display = '';

				if(typeof this._params.onShow === 'function')
				{
					this._params.onShow(i);
				}

				if(this._params.useUrl)
				{
					Iridium.UrlData.set(this._tabsName, tabId + '');
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
			this.show(Iridium.UrlData.get(this._tabsName));
		}
	};

	/**
	 * @returns {boolean} True if all tab buttons is on the page.
	 * @private
	 */
	Tabs.prototype._onPage = function()
	{
		var btns = this._params.buttons;

		if(Iridium.empty(btns))
		{
			return false;
		}

		for(var i = 0; i < btns.length; i++)
		{
			if(!Iridium.onPage(btns[i]))
			{
				return false;
			}
		}

		return true;
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
			return list.slice();
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
		for(var i = 0; i < list.length; i++)
		{
			if(list[i]._tabsName && list[i]._tabsName === name)
			{
				return list[i];
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
		var i = list.length - 1;

		while(i >= 0)
		{
			if(!list[i]._onPage()) { list.splice(i, 1); }
		}

		var tabsElements = element.querySelectorAll('[data-ir-tabs]');

		for(i = 0; i < tabsElements.length; i++)
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