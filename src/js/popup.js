/**
 * Iridium Popup.
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
 * @module popup
 * @requires Iridium
 * @requires Iridium.Builder
 * @version 0.1-indev
 */

if(Iridium && Iridium.Builder)
{
	Iridium.Popup = (function()
	{
		/**
		 * List of the visible popup windows.
		 * @type {Iridium.Popup[]}
		 */
		var list = [];

		/**
		 * Iridium Popup.
		 *
		 * @param {object} [parameters] Parameters of the popup window.
		 *
		 * @param {boolean} [parameters.overlay=true] Create overlay under the window.
		 *
		 * @param {boolean} [parameters.closeButton=false] Show close button.
		 * @param {string|HTMLElement} [parameters.closeButtonContent=X] Content of the close button.
		 *
		 * @param {string|HTMLElement} [parameters.header] Content of the window header.
		 * @param {string|HTMLElement} [parameters.content] Content of the window.
		 *
		 * @param {object[]} [parameters.buttons] Buttons data.
		 * @param {string|HTMLElement} [parameters.buttons[].content] Content of the button.
		 * @param {boolean} [parameters.buttons[].hide=true] Hide window on click.
		 * @param {function} [parameters.buttons[].action] Action that done on click.
		 *
		 * @param {function} [parameters.onShow] Callback function that called on window show.
		 * @param {function} [parameters.onHide] Callback function that called on window hide.
		 *
		 * @constructor
		 */
		function Popup(parameters)
		{
			this._params = {
				overlay: true,
				closeButton: false,
				closeButtonContent: 'X'
			};

			Iridium.merge(this._params, parameters);
		}

		/**
		 * Sets text of the header.
		 * @param {string|HTMLElement} header Text of the header.
		 * @return {Iridium.Popup} Popup.
		 */
		Popup.prototype.setHeader = function(header)
		{
			this._params.header = header;
			return this;
		};

		/**
		 * Sets content of the window.
		 * @param {string|HTMLElement} content Content.
		 * @returns {Iridium.Popup} Popup.
		 */
		Popup.prototype.setContent = function(content)
		{
			this._params.content = content;
			return this;
		};

		/**
		 * Adds button to the window.
		 * @param {string|HTMLElement} content Content of the button.
		 * @param {boolean} hide Hide window on click.
		 * @param {function} action Action that done on click.
		 * @returns {Iridium.Popup} Popup.
		 */
		Popup.prototype.addButton = function(content, hide, action)
		{
			if(!Array.isArray(this._params.buttons))
			{
				this._params.buttons = [];
			}

			this._params.buttons.push({
				content: content,
				hide: hide,
				action: action
			});

			return this;
		};

		/**
		 * Builds window element.
		 * @returns {Iridium.Popup}
		 * @see Iridium.Popup.isBuilded
		 */
		Popup.prototype.build = function()
		{
			var _ = this,
				structure = {
				class: 'ir-popup',
				childs: []
			};

			if(this._params.overlay)
			{
				structure.childs.push({
					class: 'ir-pp-overlay',
					on: { click: function() { _.hide(); } }
				});
			}

			var windowStructure = {
				class: 'ir-pp-window',
				childs: []
			};

			if(this._params.header)
			{
				var headerStruct = {
					class: 'ir-pp-header',
					childs: []
				};

				if(typeof this._params.header === 'string')
				{
					headerStruct.html = this._params.header;
				}

				if(this._params.header instanceof HTMLElement)
				{
					headerStruct.childs.push(this._params.header);
				}

				if(this._params.closeButton)
				{
					var closeButtonStruct = {
						tag: 'button',
						class: 'ir-pp-close-btn',
						on: {
							click: function()
							{
								_.hide();
							}
						}
					};

					if(typeof this._params.closeButtonContent === 'string')
					{
						closeButtonStruct.html = this._params.closeButtonContent;
					}

					if(this._params.closeButtonContent instanceof HTMLElement)
					{
						closeButtonStruct.childs = [this._params.closeButtonContent];
					}

					headerStruct.childs.push(closeButtonStruct);
				}

				windowStructure.childs.push(headerStruct);
			}

			if(this._params.content)
			{
				var contentStructure = { class: 'ir-pp-content' };

				if(typeof this._params.content === 'string')
				{
					contentStructure.html = this._params.content;
				}

				if(this._params.content instanceof HTMLElement)
				{
					contentStructure.childs = [this._params.content];
				}

				windowStructure.childs.push(contentStructure);
			}

			if(Array.isArray(this._params.buttons))
			{
				var buttonsStructure = {
					class: 'ir-pp-buttons',
					childs: []
				};

				this._params.buttons.forEach(function(buttonData)
				{
					var buttonStruct = {
						tag: 'button',
						class: 'ir-pp-btn',
						on: {
							click: function(e)
							{
								e.stopPropagation();
								e.preventDefault();

								if(typeof buttonData.action === 'function')
								{
									buttonData.action();
								}

								if(buttonData.hide === undefined || buttonData.hide)
								{
									_.hide();
								}
							}
						}
					};

					if(typeof buttonData.content === 'string')
					{
						buttonStruct.html = buttonData.content;
					}
					else if(buttonData.content instanceof HTMLElement)
					{
						buttonStruct.childs.push(buttonData.content);
					}

					buttonsStructure.childs.push(buttonStruct);
				});

				windowStructure.childs.push(buttonsStructure);
			}

			structure.childs.push(windowStructure);

			this._element = new Iridium.Builder(structure).build();
			this._window = this._element.getElementsByClassName('ir-pp-window')[0];

			return this;
		};

		/**
		 * Updates position of the window.
		 */
		Popup.prototype.updatePosition = function()
		{
			if(!this._element)
			{
				return;
			}

			this._window.style.top  = (this._element.offsetHeight / 2 - this._window.offsetHeight / 2) + 'px';
			this._window.style.left = (this._element.offsetWidth / 2 - this._window.offsetWidth / 2) + 'px';
		};

		/**
		 * Builds (if not builded) and appends window element to the body.
		 * @returns {Iridium.Popup} Popup.
		 * @see Iridium.Popup.build
		 */
		Popup.prototype.create = function()
		{
			if(!this._element)
			{
				this.build();
			}

			this._element.style.display = 'none';
			document.body.appendChild(this._element);

			return this;
		};

		/**
		 * Creates (if not created) and shows window.
		 * @returns {Iridium.Popup} Popup.
		 * @see Iridium.Popup.create
		 */
		Popup.prototype.show = function()
		{
			if(!this.isCreated())
			{
				this.create();
			}

			if(typeof this._params.onShow === 'function')
			{
				this._params.onShow();
			}

			this._element.style.display = '';
			this.updatePosition();
			list.push(this);

			return this;
		};

		/**
		 * Hides window if it visible.
		 * @returns {Iridium.Popup} Popup.
		 * @see Iridium.Popup.isVisible
		 */
		Popup.prototype.hide = function()
		{
			if(!this.isVisible())
			{
				return this;
			}

			if(typeof this._params.onHide === 'function')
			{
				this._params.onHide();
			}

			this._element.style.display = 'none';

			var i = list.indexOf(this);
			if(i > -1)
			{
				list.splice(i, 1);
			}

			return this;
		};

		/**
		 * Removes window (if it created) from the body.
		 * @returns {Iridium.Popup} Popup.
		 * @see Iridium.Popup.isCreated
		 */
		Popup.prototype.remove = function()
		{
			if(!this.isCreated())
			{
				return this;
			}

			document.body.removeChild(this._element);

			return this;
		};

		/**
		 * Returns true if window element builded.
		 * @returns {boolean} True if window element builded.
		 */
		Popup.prototype.isBuilded = function()
		{
			return !!this._element;
		};

		/**
		 * Returns true if window element builded and appended to the body.
		 * @returns {boolean} True if window element builded and appended to the body.
		 */
		Popup.prototype.isCreated = function()
		{
			return this.isBuilded() && document.body.contains(this._element);
		};

		/**
		 * Returns true if window is visible.
		 * @returns {boolean} True if window is visible.
		 */
		Popup.prototype.isVisible = function()
		{
			return this.isCreated() && this._element.style.display !== 'none';
		};

		window.addEventListener('resize', function()
		{
			list.forEach(function(popup)
			{
				popup.updatePosition();
			});
		});

		return Popup;
	}());
}
else
{
	console.error('Iridium Framework Core and Iridium Builder must be included to be able to use Iridium Popup.');
}