/**
 * Iridium Tooltip.
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
 * @module tooltip
 * @requires Iridium
 * @requires Iridium.Init
 * @requires Iridium.Breakpoints
 */


Iridium.Tooltip = (function()
{
	/**
	 * List of the all tooltips.
	 * @type {Array}
	 * @private
	 */
	var list = [];

	/**
	 * Creates Iridium Tooltip.
	 *
	 * @example
	 * <span data-ir-tt="Tooltip content">Text</span>
	 *
	 * @param {object} params Tooltip parameters.
	 * @param {HTMLElement} params.element Element.
	 * @param {string} [params.content = 'Empty'] Tooltip content. Supports HTML.
	 * @param {('hover'|'focus')} [params.event = 'hover']
	 * @param {('top'|'right'|'bottom'|'left'|'mouse')} [params.position='mouse']
	 * @param {number|string} [params.margin = 10]
	 * @param {string} [params.tooltipClass] Additional class of the tooltip element.
	 * @param {number} [params.showDelay = 50] Tooltip show delay.
	 * @param {number} [params.hideDelay = 0] Tooltip hide delay.
	 * @param {boolean} [params.html = true] Enable html rendering of the content.
	 *
	 * @param {object} [params.responsive]
	 *
	 * @param {object} [params.responsive.sm]
	 * @param {('hover'|'focus')} [params.responsive.sm.event]
	 * @param {('top'|'right'|'bottom'|'left'|'mouse')} [params.responsive.sm.position]
	 * @param {number} [params.responsive.sm.margin]
	 *
	 * @param {object} [params.responsive.md]
	 * @param {('hover'|'focus')} [params.responsive.md.event]
	 * @param {('top'|'right'|'bottom'|'left'|'mouse')} [params.responsive.md.position]
	 * @param {number} [params.responsive.md.margin]
	 *
	 * @param {object} [params.responsive.lg]
	 * @param {('hover'|'focus')} [params.responsive.lg.event]
	 * @param {('top'|'right'|'bottom'|'left'|'mouse')} [params.responsive.lg.position]
	 * @param {number} [params.responsive.lg.margin]
	 *
	 * @param {object} [params.responsive.xs]
	 * @param {('hover'|'focus')} [params.responsive.xs.event]
	 * @param {('top'|'right'|'bottom'|'left'|'mouse')} [params.responsive.xs.position]
	 * @param {number} [params.responsive.xs.margin]
	 *
	 * @constructor
	 */
	function Tooltip(params)
	{
		var _ = this;

		if(!(params.element instanceof HTMLElement))
		{
			throw new Error('Parameter "element" should be instance of HTMLElement.');
		}

		if(params.element.irTooltip)
		{
			throw new Error('Specified element already has a tooltip.');
		}

		_._params = {
			content: 'Empty',
			event: 'hover',
			position: 'mouse',
			margin: 10,
			showDelay: 50, // For prevent showing tooltip while cursor moving fast above element
			hideDelay: 0,
			html: true
		};

		Iridium.merge(_._params, params);
		_._params.margin = parseInt(_._params.margin);
		this._currentParams = this._getCurrentParams();

		// Element creation
		_._element           = document.createElement('div');

		if(_._params.html)
		{
			_._element.innerHTML = _._params.content;
		}
		else
		{
			_._element.appendChild(document.createTextNode(_._params.content));
		}

		_._updateTooltipElement();
		_._updatePosition(); // Set default position

		_._element.addEventListener('click', function()
		{
			_.hide();
		});

		// Remember tooltip object
		_._params.element.irTooltip = _;

		_._params.element.addEventListener('mouseenter', function(e)
		{
			if(_._currentParams.event === 'hover')
			{
				_.show();
				_._updatePosition(e);
			}
		});

		_._params.element.addEventListener('mousemove', function(e)
		{
			if(_._currentParams.event === 'hover')
			{
				_._updatePosition(e);
			}
		});

		_._params.element.addEventListener('mouseleave', function()
		{
			if(_._currentParams.event === 'hover')
			{
				_.hide();
			}
		});

		_._params.element.addEventListener('click', function()
		{
			if(_._currentParams.event === 'hover')
			{
				_.hide();
			}
		});

		_._params.element.addEventListener('focus', function()
		{
			if(_._currentParams.event === 'focus')
			{
				_.show();
				_._updatePosition();
			}
		});

		_._params.element.addEventListener('blur', function()
		{
			if(_._currentParams.event === 'focus')
			{
				_.hide();
			}
		});

		list.push(_);
	}

	/**
	 * Updates current position of the tooltip object.
	 * @param {MouseEvent} [e] Mouse event.
	 * @private
	 */
	Tooltip.prototype._updatePosition = function(e)
	{
		var _           = this,
			params      = this._currentParams,
			elementRect = params.element.getBoundingClientRect(),
			top         = elementRect.top,
			left        = elementRect.left;

		function place(l, t)
		{
			_._element.style.left = l + 'px';
			_._element.style.top  = t + 'px';
		}

		// Position relative to the element
		if(params.position !== 'mouse' && !!params.position)
		{
			switch(params.position)
			{
				case 'top':
					top -= _._element.offsetHeight + params.margin;
					left += (params.element.offsetWidth - _._element.offsetWidth) / 2;
					break;
				case 'bottom':
					top += params.element.offsetHeight + params.margin;
					left += (params.element.offsetWidth - _._element.offsetWidth) / 2;
					break;
				case 'left':
					left -= _._element.offsetWidth + params.margin;
					top += (params.element.offsetHeight - _._element.offsetHeight) / 2;
					break;
				case 'right':
					left += params.element.offsetWidth + params.margin;
					top += (params.element.offsetHeight - _._element.offsetHeight) / 2;
					break;
			}

			place(Math.round(left), Math.round(top));
			return;
		}

		if(e)
		{
			place(e.clientX + params.margin, e.clientY + params.margin);
			return;
		}

		place(left, top);
	};

	/**
	 * Updates class of the tooltip element.
	 * @private
	 */
	Tooltip.prototype._updateTooltipElement = function()
	{
		this._element.className = 'ir-tooltip-obj'
			+ (this._currentParams.position ? ' ' + this._currentParams.position : '')
			+ (this._params.tooltipClass ? ' ' + this._params.tooltipClass : '');
	};

	/**
	 * Returns parameters for current responsive breakpoint.
	 * @returns {object} Parameters.
	 * @private
	 */
	Tooltip.prototype._getCurrentParams = function()
	{
		var params            = Iridium.clone(this._params),
			breakpoints       = Iridium.Breakpoints.getNames(),
			currentBreakpoint = Iridium.Breakpoints.getCurrent();

		delete params.responsive;

		if(currentBreakpoint && this._params.responsive)
		{
			for(var i = 0; i < breakpoints.length; i++)
			{
				var bp = breakpoints[i];
				Iridium.merge(params, this._params.responsive[bp]);

				if(bp === currentBreakpoint)
				{
					break;
				}
			}
		}

		return params;
	};

	/**
	 * Displays tooltip.
	 * @returns {Iridium.Tooltip} Tooltip.
	 */
	Tooltip.prototype.show = function()
	{
		var _ = this;

		/**
		 * Local show function.
		 */
		function show()
		{
			if(!document.body.contains(_._element))
			{
				document.body.appendChild(_._element);
			}

			_._showTimeoutId = null;
		}

		// Wait untill delay ends
		if(_._showTimeoutId)
		{
			return _;
		}

		if(_._currentParams.showDelay > 0)
		{
			_._showTimeoutId = setTimeout(function()
			{
				show();
				if(_._currentParams.position !== 'mouse')
				{
					_._updatePosition();
				}
			}, _._currentParams.showDelay);
			return _;
		}

		show();
		return _;
	};

	/**
	 * Hides tooltip.
	 * @returns {Iridium.Tooltip} Tooltip.
	 */
	Tooltip.prototype.hide = function()
	{
		var _ = this;

		// Remove show delay
		if(_._showTimeoutId)
		{
			clearTimeout(_._showTimeoutId);
			_._showTimeoutId = null;
		}

		function hide()
		{
			if(document.body.contains(_._element))
			{
				document.body.removeChild(_._element);
			}

			_._hideTimeoutId = null;
		}

		if(_._hideTimeoutId)
		{
			return _;
		}

		if(_._currentParams.hideDelay > 0)
		{
			_._hideTimeoutId = setTimeout(hide, _._currentParams.hideDelay);
			return _;
		}

		hide();
		return _;
	};

	/**
	 * @returns {boolean} True if tooltip is visible.
	 */
	Tooltip.prototype.isVisible = function()
	{
		return document.body.contains(this._element);
	};

	/**
	 * @returns {boolean} True if tooltip object is on the page.
	 * @private
	 */
	Tooltip.prototype._onPage = function()
	{
		return !!this._currentParams.element.parentNode;
	};

	/**
	 * Called on window resize event.
	 * @private
	 */
	Tooltip.prototype._onWindowResize = function()
	{
		if(this._currentParams.event === 'focus')
		{
			this._updatePosition();
		}

		this._currentParams = this._getCurrentParams();
	};

	/**
	 * Called on window scroll event.
	 * @private
	 */
	Tooltip.prototype._onWindowScroll = function()
	{
		if(!this._onPage())
		{
			list.splice(list.indexOf(this, 1));
			return;
		}

		if(this.isVisible() && (this._currentParams.event === 'focus' || this._currentParams.position !== 'mouse'))
		{
			this._updatePosition();
		}
	};

	/**
	 * Called on breakpoint change.
	 * @private
	 */
	Tooltip.prototype._onBreakpointChange = function()
	{
		this._currentParams = this._getCurrentParams();
		this._updateTooltipElement();
	};

	/**
	 * Return list of the initialized tooltips.
	 * @returns {Tooltip[]} List of the initialized tooltips.
	 * @static
	 */
	Tooltip.getList = function()
	{
		return list.slice();
	};

	/**
	 * Hides all tooltips on the page.
	 * @static
	 */
	Tooltip.hideAll = function()
	{
		for(var i = 0; i < list.length; i++)
		{
			list[i].hide();
		}
	};

	window.addEventListener('scroll', function(e)
	{
		for(var i = 0; i < list.length; i++)
		{
			list[i]._onWindowScroll(e);
		}
	});

	window.addEventListener('resize', function(e)
	{
		for(var i = 0; i < list.length; i++)
		{
			list[i]._onWindowResize(e);
		}
	});

	Iridium.Breakpoints.addOnChange(function()
	{
		for(var i = 0; i < list.length; i++)
		{
			list[i]._onBreakpointChange();
		}
	});

	// Initialization
	Iridium.Init.register('tooltip', function(element)
	{
		// Remove all tooltips that in not on the page
		for(var i = list.length - 1; i >= 0; --i)
		{
			if(!list[i]._onPage())
			{
				list.splice(list.indexOf(list[i], 1));
			}
		}

		var ttElements = element.querySelectorAll('[data-ir-tt]');

		for(var i = 0; i < ttElements.length; i++)
		{
			var tt     = ttElements[i],
				params = {
					element: tt,
					content: tt.dataset.irTt,
					event: tt.dataset.irTtEvent,
					position: tt.dataset.irTtPos,
					margin: tt.dataset.irTtMg,
					tooltipClass: tt.dataset.irTtClass,
					showDelay: tt.dataset.irTtSd,
					hideDelay: tt.dataset.irTtHd,
					responsive: {
						sm: {
							event: tt.dataset.irTtSmEvent,
							position: tt.dataset.irTtSmPos,
							margin: tt.dataset.irTtSmMg
						},
						md: {
							event: tt.dataset.irTtMdEvent,
							position: tt.dataset.irTtMdPos,
							margin: tt.dataset.irTtMdMg
						},
						lg: {
							event: tt.dataset.irTtLgEvent,
							position: tt.dataset.irTtLgPos,
							margin: tt.dataset.irTtLgMg
						},
						xl: {
							event: tt.dataset.irTtXlEvent,
							position: tt.dataset.irTtXlPos,
							margin: tt.dataset.irTtXlMg
						}
					}
				};

			new Iridium.Tooltip(params);
		}
	});

	return Tooltip;
}());