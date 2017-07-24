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
 * @version 0.1-indev
 */

if(Iridium)
{
	/**
	 * @type {Array} Array of created tooltips for update its position on user scrolls the page.
	 */
	var tooltipScroll = [];

	/**
	 * Creates Iridium Tooltip.
	 * @param {HTMLElement} element
	 * @param {object} [params]
	 * @param {string} [params.content]
	 * @param {('hover'|'focus')} [params.event = 'hover']
	 * @param {('top'|'right'|'bottom'|'left')} [params.position]
	 * @param {string} [params.tooltipClass]
	 * @constructor
	 */
	Iridium.Tooltip = function(element, params)
	{
		var tooltipElement,
			_ = this;

		if(!(element instanceof HTMLElement))
		{
			throw new Error('Argument "element" must be HTMLElement.');
		}

		params = params || {};
		params.content = params.content || element.dataset.irTooltip || 'Empty';
		params.event = params.event || element.dataset.irTtEvent || 'hover';
		params.position = params.position || element.dataset.irTtPos;
		params.margin = params.margin || element.dataset.irMg || 10;
		params.tooltipClass = params.tooltipClass || element.dataset.irTtClass;

		this.updatePosition = function(e)
		{
			if(params.position !== undefined)
			{
				var elementRect = element.getBoundingClientRect(),
					top         = elementRect.top,
					left        = elementRect.left;

				switch(params.position)
				{
					case 'top':
						top -= tooltipElement.offsetHeight + params.margin;
						left += (element.offsetWidth - tooltipElement.offsetWidth) / 2;
						break;
					case 'bottom':
						top += element.offsetHeight + params.margin;
						left += (element.offsetWidth - tooltipElement.offsetWidth) / 2;
						break;
					case 'left':
						left -= tooltipElement.offsetWidth + params.margin;
						top += (element.offsetHeight - tooltipElement.offsetHeight) / 2;
						break;
					case 'right':
						left += element.offsetWidth + params.margin;
						top += (element.offsetHeight - tooltipElement.offsetHeight) / 2;
						break;
				}

				tooltipElement.style.top  = Math.round(top) + 'px';
				tooltipElement.style.left = Math.round(left) + 'px';

				return;
			}

			tooltipElement.style.top = (e.pageY + params.margin) + 'px';
			tooltipElement.style.left = (e.pageX + params.margin) + 'px';
		}

		function removeTooltipObject()
		{
			if(document.body.contains(tooltipElement))
			{
				document.body.removeChild(tooltipElement);
			}

			if(params.event === 'focus')
			{
				var index = tooltipScroll.indexOf(_);
				if(index !== -1)
				{
					tooltipScroll.splice(index, 1);
				}
			}
		}

		function createTooltipObject(e)
		{
			tooltipElement = document.createElement('div');
			tooltipElement.className = 'ir-tooltip-obj'
				+ (params.position ? ' ' + params.position : '')
				+ (params.tooltipClass ? ' ' + params.tooltipClass : '');
			tooltipElement.innerHTML = params.content;
			document.body.appendChild(tooltipElement);
			_.updatePosition(e);

			if(params.event === 'focus')
			{
				tooltipScroll.push(_);
			}
		}

		if(params.event === 'hover')
		{
			element.addEventListener('mouseenter', createTooltipObject);
			element.addEventListener('mousemove', this.updatePosition);
			element.addEventListener('mouseleave', removeTooltipObject);
			element.addEventListener('click', removeTooltipObject);
		}
		else if(params.event === 'focus')
		{
			element.addEventListener('focus', createTooltipObject);
			element.addEventListener('blur', removeTooltipObject);
		}
	}

	//Initialization
	window.addEventListener('load', function()
	{
		var ttElements = document.querySelectorAll('[data-ir-tooltip]');

		for(var i = 0; i < ttElements.length; i++)
		{
			new Iridium.Tooltip(ttElements[i]);
		}
	});

	//Update position on page scroll
	window.addEventListener('scroll', function()
	{
		for(var i = 0; i < tooltipScroll.length; i++)
		{
			tooltipScroll[i].updatePosition();
		}
	});
}
else
{
	console.error('Iridium Framework Core must be included to be able to use Iridium Tooltip.');
}