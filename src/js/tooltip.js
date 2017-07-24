/**
 * Iridium Tooltip.
 * Part of the Iridium Framework.
 * @module tooltip
 * @requires Iridium
 * @author rayleigh <rayleigh@protonmail.com>
 * @version 0.2.0 indev
 * @licence GPL-3.0
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
		var tooltipObj,
			tooltip = this;

		if(!element)
		{
			return;
		}

		params              = params || {};
		params.content      = params.content || element.dataset.irTooltip;
		params.event        = params.event || element.dataset.irTtEvent || 'hover';
		params.position     = params.position || element.dataset.irTtPos;
		params.tooltipClass = params.tooltipClass || element.dataset.irTtClass;

		this.updatePosition = function(e)
		{
			var margin = 10;

			if(params.position !== undefined)
			{
				var elementRect = element.getBoundingClientRect(),
					top         = elementRect.top,
					left        = elementRect.left;

				switch(params.position)
				{
					case 'top':
						top -= tooltipObj.offsetHeight + margin;
						left += (element.offsetWidth - tooltipObj.offsetWidth) / 2;
						break;
					case 'bottom':
						top += element.offsetHeight + margin;
						left += (element.offsetWidth - tooltipObj.offsetWidth) / 2;
						break;
					case 'left':
						left -= tooltipObj.offsetWidth + margin;
						top += (element.offsetHeight - tooltipObj.offsetHeight) / 2;
						break;
					case 'right':
						left += element.offsetWidth + margin;
						top += (element.offsetHeight - tooltipObj.offsetHeight) / 2;
						break;
				}

				tooltipObj.style.top  = top + 'px';
				tooltipObj.style.left = left + 'px';

				return;
			}

			tooltipObj.style.top  = (e.pageY + 15) + 'px';
			tooltipObj.style.left = (e.pageX + 15) + 'px';
		}

		function removeTooltipObject()
		{
			if(document.body.contains(tooltipObj))
			{
				document.body.removeChild(tooltipObj);
			}

			if(params.event === 'focus')
			{
				var index = tooltipScroll.indexOf(tooltip);
				if(index !== -1)
				{
					tooltipScroll.splice(index, 1);
				}
			}
		}

		function createTooltipObject(e)
		{
			tooltipObj           = document.createElement('div');
			tooltipObj.className = 'ir-tooltip-obj'
				+ (params.position ? ' ' + params.position : '')
				+ (params.tooltipClass ? ' ' + params.tooltipClass : '');
			tooltipObj.innerHTML = params.content;
			document.body.appendChild(tooltipObj);
			tooltip.updatePosition(e);

			if(params.event === 'focus')
			{
				tooltipScroll.push(tooltip);
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
	console.error('Iridium Core must be included to be able to use Iridium Tooltip.');
}