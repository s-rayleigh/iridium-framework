/**
 * Iridium SVG.
 * TODO: cache
 *
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
 * @module svg
 * @requires Iridium
 * @requires Iridium.Net
 * @version 0.1-indev
 */

/**
 * SVG load result callback function.
 * @callback SVGLoad
 * @param {Node} svgNode Loaded svg.
 */

if(Iridium && Iridium.Net)
{
	/**
	 * Iridium SVG.
	 * Contains helper methods for working with the svg.
	 */
	Iridium.SVG = {
		/**
		 * Array of the loaded svg's.
		 */
		loaded: []
	};

	/**
	 * Loads svg file from url as <svg> tag.
	 * @param url URL of the svg file.
	 * @param {SVGLoad} callback Callback function that accepts loaded svg.
	 */
	Iridium.SVG.loadFromURL = function(url, callback)
	{
		var loaded = Iridium.SVG.loaded.find(function(s)
		{
			return s.link === url;
		});

		if(loaded)
		{
			callback(loaded.svg.cloneNode(true));
			return;
		}

		Iridium.Net.get(url, null, function(svgDoc)
		{
			var svgNodes = svgDoc.getElementsByTagName('svg');

			if(svgNodes.length < 1)
			{
				return;
			}

			var svgNode = svgNodes[0];

			//Store svg's per page load
			Iridium.SVG.loaded.push({
				link: url,
				svg: svgNode
			});

			callback(svgNode.cloneNode(true));
		}, Iridium.Net.DataType.XML);
	};

	/**
	 * Replaces image with svg src by loaded inline svg.
	 * @param {Image} img Image element.
	 */
	Iridium.SVG.replaceImgByInline = function(img)
	{
		if(img.src.split('.').pop().toLowerCase() !== 'svg')
		{
			return;
		}

		Iridium.SVG.loadFromURL(img.src, function(s)
		{
			img.parentNode.replaceChild(s.cloneNode(true), img);
		});
	};

	/**
	 * Loads all svg's from <img> tags with "data-inline-svg" attributes and replaces <img> with loaded <svg>.
	 */
	Iridium.SVG.loadOnPage = function()
	{
		var i,
			svgElements = document.querySelectorAll('[data-inline-svg]'),
			links       = []; // Links on svg's and corresponding elements

		for(i = 0; i < svgElements.length; i++)
		{
			(function(i)
			{
				var img     = svgElements[i],
					link    = img.src,
					linkObj = links.find(function(lo)
					{
						return lo.link === link;
					});

				if(linkObj)
				{
					linkObj.elements.push(img);
					return;
				}

				links.push({
					link: link,
					elements: [img]
				});

			})(i);
		}

		for(i = 0; i < links.length; i++)
		{
			Iridium.SVG.loadFromURL(links[i].link, function(svg)
			{
				for(var j = 0; j < this.elements.length; j++)
				{
					var img = this.elements[j];
					svg.setAttribute('class', img.className);
					img.parentNode.replaceChild(svg.cloneNode(true), img);
				}
			}.bind(links[i]));
		}
	};

	window.addEventListener('load', Iridium.SVG.loadOnPage);
}
else
{
	console.error('Iridium Core and Iridium Net must be included to be able to use Iridium SVG.');
}