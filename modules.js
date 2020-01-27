/**
 * Modules.
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
 */

function flatten(arr)
{
	return Array.isArray(arr) ? arr.reduce((result, part) => {
		return result.concat(Array.isArray(part) ? flatten(part) : part);
	}, []) : arr;
}

function unique(arr)
{
	return arr.filter((v, i, a) => a.indexOf(v) === i);
}

/**
 * Describes Iridium module.
 */
class Module {
	/**
	 * Constructs new Module object.
	 * @param {string} name Name.
	 * @param {string[]|null} [requires=[]] Dependencies names.
	 * @param {boolean} [core=false] Is core module.
	 */
	constructor(name, requires, core)
	{
		if(typeof name !== 'string')
		{
			throw new Error('Argument "name" should be type of string.');
		}

		this.name      = name;
		this._requires = Array.isArray(requires) ? requires : [];
		this.core      = typeof core === 'boolean' ? core : false;
	}

	get dependencies()
	{
		return this._requires;
	}
}

/**
 * Modules manager.
 */
class ModulesManager
{
	/**
	 * Creates new ModulesManager object.
	 */
	constructor()
	{
		this._modules = [];
		this._enabled = [];
	}

	/**
	 * Finds added module by name.
	 * @param {string} name Name of the module.
	 * @returns {Module|null} Module.
	 * @private
	 */
	_find(name)
	{
		return this._modules.find(module => module.name === name);
	}

	/**
	 * Adds module(s).
	 * @param {...Module|Module[]} modules Module(s) to add.
	 */
	add(...modules)
	{
		modules = flatten(modules);

		for(let module of modules)
		{
			if(!(module instanceof Module))
			{
				throw new TypeError('Argument "module" should be instance of Module class.');
			}

			this._modules.push(module);
		}
	}

	/**
	 * Enables module(s).
	 * @param {...string|string[]} modules Name(s) of the module(s) to enable.
	 */
	enable(...modules)
	{
		modules = flatten(modules);

		for(let name of modules)
		{
			if(typeof name !== 'string')
			{
				throw new TypeError(`Name of the module should be type of string. The ${typeof name} is given.`);
			}

			let module = this._find(name);

			if(!module)
			{
				throw new Error(`Cannot enable nonexistent module "${name}".`);
			}

			if(this._enabled.includes(module))
			{
				throw new Error(`Module "${name}" already enabled.`);
			}

			this._enabled.push(module);
		}
	}

	/**
	 * Disables module(s).
	 * @param {...string|string[]} modules Name(s) of the module(s) to disable.
	 */
	disable(...modules)
	{
		modules = flatten(modules);

		for(let name of modules)
		{
			if(typeof name !== 'string')
			{
				throw new TypeError(`Name of the module should be type of string. The ${typeof name} is given.`);
			}

			let module = this._find(name);

			if(!module)
			{
				throw new Error(`Cannot disable nonexistent module "${name}".`);
			}

			let i = this._enabled.indexOf(module);

			if(i < 0)
			{
				throw new Error(`Module "${name}" is not enabled.`);
			}
			else
			{
				this._enabled.splice(i, 1);
			}

			this._enabled.remove(module);
		}
	}

	/**
	 * Checks if module is enabled.
	 * @param {string} name Name of the module.
	 * @returns {boolean} True if enabled.
	 */
	isEnabled(name)
	{
		return !!this._enabled.find(module => module.name === name);
	}

	/**
	 * Generates and returns list of the modules.
	 * @returns {Module[]} List of the modules.
	 */
	get list()
	{
		let dependenciesNames = [],
			dependencies = [],
			enabledNames = this._enabled.map(mod => mod.name);

		for(let module of this._enabled)
		{
			Array.prototype.push.apply(dependenciesNames, module.dependencies);
		}

		dependenciesNames = unique(dependenciesNames);

		for(let dep of dependenciesNames)
		{
			if(!enabledNames.includes(dep))
			{
				let depMod = this._find(dep);

				if(!depMod)
				{
					throw new Error(`Cannot find dependency "${dep}".`);
				}

				dependencies.push(depMod);
			}
		}

		// Core and modules
		return unique(this._modules.filter(module => module.core).concat(dependencies, this._enabled));
	}
}

let manager = new ModulesManager();

manager.add(
	// Core
	new Module('core', null, true),
	new Module('init', null, true),

	// Modules
	new Module('builder'),
	new Module('breakpoints'),
	new Module('url_data'),
	new Module('net'),
	new Module('animation'),
	new Module('css_animation'),
	new Module('combobox'),
	new Module('data_list', ['net']),
	new Module('popup', ['builder']),
	new Module('svg', ['net']),
	new Module('tabs', ['url_data']),
	new Module('tooltip', ['breakpoints']),
	new Module('touchable')
);

module.exports.manager = manager;
module.exports.Module = Module;