/**
 * Example for Iridium Animation.
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
	var element = document.getElementById('box'),
		animation = new Iridium.Animation({
			element: element,
			animation: 'fadeIn',
			direction: 'out',
			function: 'quad',
			duration: 1000,
			autostart: false,
			repeats: Infinity,
			onStop: function()
			{
				console.log('stop');
			},
			onRepeat: function()
			{
				console.log('repeat');
			}
		});

	document.getElementById('run-button').addEventListener('click', function()
	{
		animation.start();
	});

	document.getElementById('stop-button').addEventListener('click', function()
	{
		animation.stop();
	});
});