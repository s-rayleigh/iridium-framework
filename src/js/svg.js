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
 * @copyright 2018 Vladislav Pashaiev
 * @license LGPL-3.0+
 * @module svg
 * @requires Iridium
 * @requires Iridium.Init
 * @requires Iridium.Net
 */

/**
 * SVG load result callback function.
 * @callback SVGLoad
 * @param {Node} svgNode Loaded svg.
 */

if(Iridium && Iridium.Init && Iridium.Net)
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
	 * Returns loaded svg.
	 * @param url URL of the loaded svg.
	 * @returns {Node|null} Loaded svg.
	 */
	Iridium.SVG.getLoaded = function(url)
	{
		for(var i = 0; i < Iridium.SVG.loaded.length; i++)
		{
			if(Iridium.SVG.loaded[i].link === url)
			{
				return Iridium.SVG.loaded[i].svg.cloneNode(true);
			}
		}

		return null;
	};

	/**
	 * Loads svg file from url as <svg> tag.
	 * @param url URL of the svg file.
	 * @param {SVGLoad} [callback] Callback function that accepts loaded svg.
	 */
	Iridium.SVG.loadFromURL = function(url, callback)
	{
		var loaded = this.getLoaded(url);

		if(loaded)
		{
			if(typeof callback === 'function')
			{
				callback(loaded.cloneNode(true));
			}

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

			if(typeof callback === 'function')
			{
				callback(svgNode.cloneNode(true));
			}

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

	Iridium.Init.register('inline-svg', function(element)
	{
		var i,
			svgElements = element.querySelectorAll('[data-inline-svg]'),
			links       = []; // Links on svg's and corresponding elements

		for(i = 0; i < svgElements.length; i++)
		{
			(function(i)
			{
				var img     = svgElements[i],
					link    = img.src,
					linkObj;

				for(var j = 0; j < links.length; j++)
				{
					if(links[j].link === link)
					{
						linkObj = links[j];
					}
				}

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
	});
}
else
{
	console.error('Iridium Core, Iridium Init and Iridium Net must be included to be able to use Iridium SVG.');
}