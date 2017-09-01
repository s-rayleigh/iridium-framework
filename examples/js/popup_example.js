/**
 * Example for Iridium Popup.
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
 * @version 0.1-indev
 */

window.addEventListener('load', function()
{
	var popup = new Iridium.Popup({
		header: 'Text of the header',
		content: 'Text content',
		buttons: [
			{
				content: 'say hello',
				hide: false,
				action: function()
				{
					alert('Hello!');
				}
			},
			{ content: 'close' }
		],
		closeButton: true
	});

	document.getElementById('open-button').addEventListener('click', function()
	{
		popup.show();
	})
});