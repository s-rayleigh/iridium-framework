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
 * @copyright 2017 Vladislav Pashaiev
 * @license LGPL-3.0+
 * @module tabs
 * @requires Iridium
 * @requires Iridium.Init
 * @version 0.1-indev
 */

if(Iridium)
{
	Iridium.Tabs = (function()
	{
		/**
		 * Counter for the tabs elements on the page.
		 * @type {number}
		 */
		var tabsCount = 0;

		/**
		 * Iridium Tabs.
		 *
		 * @param {object} params Tabs parameters.
		 * @param {HTMLElement[]} params.buttons Array with buttons.
		 * @param {HTMLElement[]} params.tabs Array with tabs.
		 * @param {int} [params.defaultTab=0] Number of the default tab.
		 * @param {boolean} [params.useUrl=true] Use URL to save number of the active tab.
		 * @param {string} [params.urlKeyName=tab_] Name of the key that is used to store number of the active tab in the url.
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

			/**
			 * Number of the tabs element on the page.
			 * @type {number}
			 * @private
			 */
			_._tabsNum = tabsCount++;

			if(_._params.useUrl && Iridium.UrlData.has(_._params.urlKeyName + _._tabsNum))
			{
				_.show(parseInt(Iridium.UrlData.get(_._params.urlKeyName + _._tabsNum)));
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
		}

		/**
		 * Shows tab with the specified number.
		 * @param tabNumber Number of the tab.
		 */
		Tabs.prototype.show = function(tabNumber)
		{
			var tabs = this._params.tabs,
				buttons = this._params.buttons,
				opened = false;

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
						Iridium.UrlData.set(this._params.urlKeyName + this._tabsNum, i+'');
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

		// Initialization
		Iridium.Init.register('tabs', function(element)
		{
			var tabsElements = element.querySelectorAll('[data-ir-tabs]');

			for(var i = 0; i < tabsElements.length; i++)
			{
				var te = tabsElements[i];

				var buttons = te.querySelectorAll('[data-ir-tabs-btn]'),
					container = document.getElementById(te.dataset.irTabs);

				if(!(buttons.length && container))
				{
					continue;
				}

				new Tabs({
					buttons: Array.prototype.slice.call(buttons),
					tabs: Array.prototype.slice.call(container.children)
				});
			}
		});

		return Tabs;
	}());
}
else
{
	console.error('Iridium Framework Core and Iridium Init should be included to be able to use Iridium Tabs.');
}