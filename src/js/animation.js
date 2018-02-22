/**
 * Iridium Animation.
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
 * @module animation
 * @requires Iridium
 */


if(Iridium)
{
	Iridium.Animation = (function()
	{
		/**
		 * Splits property value to the number and unit.
		 * @param {string|number} value Value.
		 * @return {{value: number, unit: string}} Number and unit of the value.
		 */
		function splitValue(value)
		{
			if(typeof value === 'number')
			{
				return {value: value, unit: ''};
			}

			// From end to start
			for(var i = value.length; i > 0; i--)
			{
				if(value[i] <= '9' && value[i] >= '0')
				{ break; }
			}

			return {
				value: parseFloat(value.substring(0, ++i)),
				unit: value.substring(i)
			};
		}

		/**
		* Iridium Animation.
		*
		* @example
		* var animation = new Iridium.Animation({
		* 	element: document.getElementById('element-id')
		* });
		*
		* @param {object} [parameters] Parameters of the animation.
		* @param {HTMLElement} [parameters.element] Element.
		*
		* @param {object|('fadeIn'|'fadeOut')} [parameters.animation=fadeIn] Animation data or predefined animation.
		* @param {object} [parameters.animation.start] Start parameters of the animation.
		* @param {object} [parameters.animation.end] End parameters of the animation.
		*
		* @param {('in'|'out'|'inout')} [parameters.direction=in] Direction of the time function.
		* @param {function|('linear'|'quad'|'sqrt')} [parameters.function] Function of the animation.
		* @param {number} [parameters.duration=1000] Duration in milliseconds.
		*
		* @param {number|Infinity} [parameters.repeats=0] Number of the repeats.
		* Can be set to Infinity for the endless cycle animation.
		*
		* @param {boolean} [parameters.autostart=true] Autostart animation after creation.
		*
		* @param {function} [parameters.onStop] Callback function, that called after the animation stop.
		* @param {function} [parameters.onRepeat] Callback function, that called after the animation repeat.
		*
		* @constructor
		*/
		function Animation(parameters)
		{
			// TODO: move to private properties
			var params = {
				animation: 'fadeIn',
				direction: 'in',
				function: 'linear',
				duration: 1000,
				repeats: 0,
				autostart: true
			};

			Iridium.merge(params, parameters);

			this._element = params.element;

			if(typeof this.timeFunctions[params.function] === 'function')
			{
				this._timeFunction = this.timeFunctions[params.function];
			}
			else if(typeof params.function === 'function')
			{
				this._timeFunction = params.function;
			}

			if(!this._timeFunction)
			{
				throw new Error('Incorrect time function.');
			}

			if(typeof params.animation === 'object')
			{
				this._animation = params.animation;

				if(this._animation.start === undefined && this._animation.end === undefined)
				{
					throw new Error('Property "animation" should have "start" and/or "stop" property.');
				}
			}
			else if(typeof params.animation === 'string' && typeof this.animations[params.animation] === 'object')
			{
				this._animation = Iridium.clone(this.animations[params.animation]);
			}

			if(!this._animation)
			{
				throw new Error('Cannot obtain animation properties.');
			}

			this._direction = params.direction;

			if(this._direction !== 'in' && this._direction !== 'out' && this._direction !== 'inout')
			{
				throw new Error('Time direction should be "in" or "out" or "inout".');
			}

			this._duration = params.duration > 0 ? params.duration : 1000;

			if(typeof params.onStop === 'function')
			{
				this._onStop = params.onStop;
			}

			if(typeof params.onStop === 'function')
			{
				this._onStop = params.onStop;
			}

			if(typeof params.onRepeat === 'function')
			{
				this._onRepeat = params.onRepeat;
			}

			/**
			 * Is animation started.
			 * @type {boolean}
			 * @private
			 */
			this._started = false;

			/**
			 * Is need to stop animation in the next frame.
			 * @type {boolean}
			 * @private
			 */
			this._needStop = false;

			/**
			 * Number of the repeats.
			 * @type {boolean}
			 * @private
			 */
			this._repeats = params.repeats;

			if(params.autostart)
			{
				this.start();
			}
		}

		/**
		 * Standard time functions.
		 * f(0) = 0, f(1) = 1
		 */
		Animation.prototype.timeFunctions = {
			/**
			 * y = x
			 */
			linear: function(x) { return x; },

			/**
			 * y = x^2
			 */
			quad: function(x) { return Math.pow(x, 2); },

			/**
			 * y = sqrt(x)
			 */
			sqrt: function(x) { return Math.sqrt(x); }
		};

		/**
		 * Standart animations.
		 */
		Animation.prototype.animations = {
			fadeIn: {
				start: {opacity: 0},
				end: {opacity: 1}
			},
			fadeOut: {
				start: {opacity: 1},
				end: {opacity: 0}
			}
		};

		/**
		 * Starts the animation.
		 * @return {Iridium.Animation} Animation.
		 */
		Animation.prototype.start = function()
		{
			if(!(this._element instanceof HTMLElement))
			{
				throw new Error('Set element that is instance of HTMLElement.');
			}

			if(this._started)
			{
				this._repeats++;
				return this;
			}

			this._started   = true;
			this._needStop  = false;
			this._startTime = performance.now();

			if(!this._animation.difference)
			{
				// Create start or end if they does not exist
				this._animation.start = this._animation.start || {};
				this._animation.end   = this._animation.end || {};

				// Difference between start and end
				this._animation.difference = {};

				var prop;

				// Copy properties from end to start
				for(prop in this._animation.end)
				{
					if(!this._animation.start.hasOwnProperty(prop))
					{
						this._animation.start[prop] = Iridium.getStyle(this._element, prop);
					}
				}

				for(prop in this._animation.start)
				{
					// Copy properties from start to end
					if(!this._animation.end.hasOwnProperty(prop))
					{
						this._animation.end[prop] = Iridium.getStyle(this._element, prop);
					}

					this._animation.start[prop] = splitValue(this._animation.start[prop]);
					this._animation.end[prop]   = splitValue(this._animation.end[prop]);

					// Merge units
					if(this._animation.start[prop].unit !== this._animation.end[prop].unit)
					{
						if(!this._animation.start[prop].unit.length)
						{
							this._animation.start[prop].unit = this._animation.end[prop].unit;
						}
						else
						{
							this._animation.end[prop].unit = this._animation.start[prop].unit;
						}
					}

					// Find defference
					this._animation.difference[prop] = {
						value: this._animation.end[prop].value - this._animation.start[prop].value,
						unit: this._animation.start[prop].unit
					};
				}
			}

			var _ = this;

			requestAnimationFrame(function animationFrame(time)
			{
				// [0; 1]
				var fractionTime = (time - _._startTime) / _._duration;

				if(fractionTime > 1)
				{
					fractionTime = 1;
				}

				var progress;

				switch(_._direction)
				{
					case 'in':
						progress = _._timeFunction(fractionTime);
						break;
					case 'out':
						progress = 1 - _._timeFunction(1 - fractionTime);
						break;
					case 'inout':
						if(fractionTime < 0.5)
						{
							progress = _._timeFunction(fractionTime * 2) / 2;
						}
						else
						{
							progress = (2 - _._timeFunction((1 - fractionTime) * 2)) / 2;
						}
						break;
				}

				for(var prop in _._animation.start)
				{
					_._element.style[prop] = (_._animation.start[prop].value + _._animation.difference[prop].value * progress) + _._animation.start[prop].unit;
				}

				if(!_._needStop)
				{
					if(fractionTime < 1)
					{
						requestAnimationFrame(animationFrame);
						return;
					}
					else if(_._repeats > 0)
					{
						_._startTime = performance.now();
						_._repeats--;
						_._onRepeat && _._onRepeat();
						requestAnimationFrame(animationFrame);
						return;
					}
				}

				_._started = false;
				_._onStop && _._onStop();
			});

			return this;
		};

		/**
		 * Stops the animation.
		 * @return {Iridium.Animation} Animation.
		 */
		Animation.prototype.stop = function()
		{
			if(!this._started)
			{
				return this;
			}

			this._needStop = true;
			return this;
		};

		/**
		 * Returns state of the animation.
		 * @return {boolean} True, if animation is running.
		 */
		Animation.prototype.isRunning = function()
		{
			return this._started;
		};

		/**
		 * Sets element.
		 * @param {HTMLElement} element Element.
		 * @return {Iridium.Animation} Animation.
		 */
		Animation.prototype.setElement = function(element)
		{
			if(this._started)
			{
				throw new Error('Cannot set element while animation is running.');
			}

			this._element = element;
			return this;
		};

		return Animation;
	}());
}
else
{
	console.error('Iridium Framework Core must be included to be able to use Iridium Animation.');
}