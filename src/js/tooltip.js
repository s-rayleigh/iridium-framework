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
 * @copyright 2017 Vladislav Pashaiev
 * @license LGPL-3.0+
 * @module tooltip
 * @requires Iridium
 * @requires Iridium.Init
 * @version 0.1-indev
 */

if(Iridium && Iridium.Init)
{
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
		 * @param {object} params
		 * @param {HTMLElement} params.element
		 * @param {string} [params.content=Empty]
		 * @param {('hover'|'focus')} [params.event = 'hover']
		 * @param {('top'|'right'|'bottom'|'left'|'mouse')} [params.position=mouse]
		 * @param {int} [params.margin=10]
		 * @param {string} [params.tooltipClass]
		 *
		 * @param {object} [params.responsive]
		 *
		 * @param {object} [params.responsive.sm]
		 * @param {('hover'|'focus')} [params.responsive.sm.event]
		 * @param {('top'|'right'|'bottom'|'left'|'mouse')} [params.responsive.sm.position]
		 * @param {int} [params.responsive.sm.margin=10]
		 *
		 * @param {object} [params.responsive.md]
		 * @param {('hover'|'focus')} [params.responsive.md.event]
		 * @param {('top'|'right'|'bottom'|'left'|'mouse')} [params.responsive.md.position]
		 * @param {int} [params.responsive.md.margin=10]
		 *
		 * @param {object} [params.responsive.lg]
		 * @param {('hover'|'focus')} [params.responsive.lg.event]
		 * @param {('top'|'right'|'bottom'|'left'|'mouse')} [params.responsive.lg.position]
		 * @param {int} [params.responsive.lg.margin=10]
		 *
		 * @param {object} [params.responsive.xs]
		 * @param {('hover'|'focus')} [params.responsive.xs.event]
		 * @param {('top'|'right'|'bottom'|'left'|'mouse')} [params.responsive.xs.position]
		 * @param {int} [params.responsive.xs.margin=10]
		 *
		 * @constructor
		 */
		function Tooltip(params)
		{
			var _ = this;

			if(!(params.element instanceof HTMLElement))
			{
				throw new Error('Parameter element should be instance of HTMLElement.');
			}

			_._params = {
				content: 'Empty',
				event: 'hover',
				position: 'mouse',
				margin: 10
			};

			Iridium.merge(_._params, params);
			this._currentParams = this._getCurrentParams();

			// Tooltip element creation
			_._element = document.createElement('div');
			_._element.innerHTML = _._params.content;
			_._updateTooltipElement();

			params.element.addEventListener('mouseenter', function()
			{
				if(_._currentParams.event === 'hover')
				{
					_.show();
				}
			});

			params.element.addEventListener('mousemove', function(e)
			{
				if(_._currentParams.event === 'hover')
				{
					_._updatePosition(e);
				}
			});

			params.element.addEventListener('mouseleave', function()
			{
				if(_._currentParams.event === 'hover')
				{
					_.hide();
				}
			});

			params.element.addEventListener('click', function()
			{
				if(_._currentParams.event === 'hover')
				{
					_.hide();
				}
			});

			params.element.addEventListener('focus', function()
			{
				if(_._currentParams.event === 'focus')
				{
					_.show();
					_._updatePosition();
				}
			});

			params.element.addEventListener('blur', function()
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
		 * @param e Event data.
		 * @private
		 */
		Tooltip.prototype._updatePosition = function(e)
		{
			var params = this._currentParams;

			if(params.position !== 'mouse' && !!params.position)
			{
				var elementRect = params.element.getBoundingClientRect(),
					top         = elementRect.top,
					left        = elementRect.left;

				switch(params.position)
				{
					case 'top':
						top -= this._element.offsetHeight + params.margin;
						left += (params.element.offsetWidth - this._element.offsetWidth) / 2;
						break;
					case 'bottom':
						top += params.element.offsetHeight + params.margin;
						left += (params.element.offsetWidth - this._element.offsetWidth) / 2;
						break;
					case 'left':
						left -= this._element.offsetWidth + params.margin;
						top += (params.element.offsetHeight - this._element.offsetHeight) / 2;
						break;
					case 'right':
						left += params.element.offsetWidth + params.margin;
						top += (params.element.offsetHeight - this._element.offsetHeight) / 2;
						break;
				}

				this._element.style.top  = Math.round(top) + 'px';
				this._element.style.left = Math.round(left) + 'px';

				return;
			}

			this._element.style.top  = (e.pageY + params.margin) + 'px';
			this._element.style.left = (e.pageX + params.margin) + 'px';
		};

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
			var params = Iridium.clone(this._params),
				breakpoints = Iridium.Breakpoints.getNames(),
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
		 */
		Tooltip.prototype.show = function()
		{
			if(!document.body.contains(this._element))
			{
				document.body.appendChild(this._element);
			}
		};

		/**
		 * Hides tooltip.
		 */
		Tooltip.prototype.hide = function()
		{
			if(document.body.contains(this._element))
			{
				document.body.removeChild(this._element);
			}
		};

		/**
		 * @returns {boolean} True if tooltip is visible.
		 */
		Tooltip.prototype.isVisible = function()
		{
			return document.body.contains(this._element);
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
			if(this._currentParams.event === 'focus')
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

		return Tooltip;
	}());

	// Initialization
	Iridium.Init.register('tooltip', function(element)
	{
		var ttElements = element.querySelectorAll('[data-ir-tt]');

		for(var i = 0; i < ttElements.length; i++)
		{
			var tt = ttElements[i],
				params = {
					element: tt,
					content: tt.dataset.irTt,
					event: tt.dataset.irTtEvent,
					position: tt.dataset.irTtPos,
					margin: tt.dataset.irTtMg,
					tooltipClass: tt.dataset.irTtClass,
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
}
else
{
	console.error('Iridium Framework Core and Iridium Init must be included to be able to use Iridium Tooltip.');
}