/**
 * Example for Iridium Combobox.
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
 * @version 0.1-indev
 */

window.addEventListener('load', function()
{
	// Simple combobox

	var simpleCombobox = new Iridium.Combobox({
		data: ['test 1', 'test 2', 'test 3']
	});

	simpleCombobox.addEventListener('input', function()
	{
		document.getElementById('simple-cb-value').innerHTML = simpleCombobox.value;
	});

	document.getElementById('simple-cb-place').appendChild(simpleCombobox);

	// Simple strict combobox

	var strictCombobox = new Iridium.Combobox({
		data: ['Lorem', 'Ipsum', 'Dolor', 'Sit', 'Amet'],
		strict: true
	});

	strictCombobox.addEventListener('input', function()
	{
		document.getElementById('strict-cb-value').innerHTML = strictCombobox.value;
	});

	document.getElementById('strict-cb-place').appendChild(strictCombobox);

	// Combobox with button
	var buttonCombobox = new Iridium.Combobox({
		data: ['quick', 'brown', 'fox', 'jumps', 'over'],
		button: true,
		buttonContent: 'hints',
		emptyInputHints: true
	});

	buttonCombobox.addEventListener('input', function()
	{
		document.getElementById('button-cb-value').innerHTML = buttonCombobox.value;
	});

	document.getElementById('button-cb-place').appendChild(buttonCombobox);

	// Combobox like select with button
	var selectCombobox = new Iridium.Combobox({
		data: ['Jackdaws', 'love', 'big', 'sphinx', 'quartz'],
		button: true,
		buttonContent: '▼',
		select: true
	});

	selectCombobox.addEventListener('input', function()
	{
		document.getElementById('select-btn-cb-value').innerHTML = selectCombobox.value;
	});

	document.getElementById('select-btn-cb-place').appendChild(selectCombobox);
});