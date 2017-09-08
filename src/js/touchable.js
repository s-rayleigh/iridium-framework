/**
 * Touchable elements.
 * When touchable element lost focus, class 'touched' added to it.
 * To set element touchable add 'data-touchable' attribute (without parameters) to the element.
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
 * @module touchable
 * @requires Iridium
 * @requires Iridium.Init
 * @version 0.1-indev
 */

if(Iridium && Iridium.Init)
{
	Iridium.Init.register(function(element)
	{
		var elements = element.querySelectorAll('[data-touchable]');
		for(var i = 0; i < elements.length; i++)
		{
			elements[i].addEventListener('blur', function()
			{
				Iridium.addClass(this, 'touched');
			});
		}
	});
}
else
{
	console.error('Iridium Framework Core and Iridium Init must be included to be able to use Iridium Touchable.');
}