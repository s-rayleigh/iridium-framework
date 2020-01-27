/*
 * CSS animation wrapper.
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
 * @copyright 2020 Vladislav Pashaiev
 * @license LGPL-3.0+
 */


/**
 * Creates new CSS animation object.
 * @param {string|object} animation Name of an existing CSS animation or keyframes to create a new CSS animation.
 * @constructor
 */
Iridium.CSSAnimation = (function()
{
	'use strict';

	/**
	 * Local Iridium abbreviation.
	 */
	var I = Iridium;

	/**
	 * Stylesheet for the animation.
	 * @type {CSSStyleSheet}
	 */
	var styleSheet;

	/**
	 * List of all created CSS animation objects.
	 * @type {CSSAnimation[]}
	 */
	var animations = [];

	/**
	 * List of created animation names.
	 * @type {string[]}
	 */
	var names = [];

	/**
	 * Creates new object to control the animation that applied to element.
	 * @constructor
	 */
	function AnimationControl(animation, element, params)
	{
		/**
		 * Animation object.
		 * @type {CSSAnimation}
		 * @private
		 */
		this._animation = animation;

		/**
		 * Element to which animation is applied.
		 */
		this._element = element;

		/**
		 *
		 * @type {boolean}
		 * @private
		 */
		this._stopped = false;

		/**
		 * Animation event listener method.
		 * @param {AnimationEvent} event Animation event.
		 * @private
		 */
		this._listener = function(event)
		{
			switch(event.type)
			{
				case 'animationstart':
					if(typeof params.onStart === 'function')
					{
						params.onStart(event);
					}
					break;
				case 'animationend':
					if(typeof params.onEnd === 'function')
					{
						params.onEnd(event);
					}
					break;
				case 'animationiteration':
					if(typeof params.onIteration === 'function')
					{
						params.onIteration(event);
					}
					break;
			}
		};

		element.addEventListener('animationstart', this._listener, false);
		element.addEventListener('animationend', this._listener, false);
		element.addEventListener('animationiteration', this._listener, false);

		/**
		 * Animation string that applied to the element.
		 * @type {string}
		 * @private
		 */
		this._animationString = animation._name + ' ' +
			params.duration + ' ' +
			params.function + ' ' +
			params.delay + ' ' +
			params.iterations + ' ' +
			params.direction + ' ' +
			params.fillMode + ' ' +
			params.state;

		element.style.animation = this._animationString;
	}

	/**
	 * Plays the animation.
	 */
	AnimationControl.prototype.play = function()
	{
		if(this._stopped)
		{
			this._element.style.animation = this._animationString;
			this._stopped = false;
		}

		this._element.style.animationPlayState = 'running';
	};

	/**
	 * Pauses the animation.
	 */
	AnimationControl.prototype.pause = function()
	{
		if(this._stopped) { return; }
		this._element.style.animationPlayState = 'paused';
	};

	/**
	 * Stops the animation.
	 * The animation will return to its initial state.
	 */
	AnimationControl.prototype.stop = function()
	{
		if(this._stopped) { return; }
		this._stopped = true;
		this._element.style.animation = '';
	};

	/**
	 * Destroys the animation control object and resets the animation of the element.
	 */
	AnimationControl.prototype.destroy = function()
	{
		this._animation._removeControl(this);
		this._destroyInternal();
	};

	/**
	 * Method for internal destruction that unsubscribes from events and cleans the animation from element.
	 * @protected
	 */
	AnimationControl.prototype._destroyInternal = function()
	{
		if(this._listener)
		{
			this._element.removeEventListener('animationstart', this._listener, false);
			this._element.removeEventListener('animationend', this._listener, false);
			this._element.removeEventListener('animationiteration', this._listener, false);
		}

		this._element.style.animation = '';
	};

	function CSSAnimation(animation)
	{
		/**
		 * Is animation destroyed.
		 * @type {boolean}
		 * @private
		 */
		this._destroyed = false;

		/**
		 * List of control objects of this animation.
		 * @type {AnimationControl[]}
		 * @private
		 */
		this._controls = [];

		/**
		 * If true, using the existing CSS animation.
		 * @type {boolean}
		 * @private
		 */
		this._predefined = typeof animation === 'string';

		if(this._predefined)
		{
			this._name = animation;
		}
		else if(typeof animation === 'object')
		{
			this._name = randomName();
			// It is required to store the animation name to prevent duplications
			names.push(this._name);
			styleSheet.insertRule(createAnimationRule(this._name, animation), 0);
		}
		else
		{
			throw new Error('Animation must be a type of string or object.');
		}

		animations.unshift(this);
	}

	/**
	 * <p>Destroy the animation and it's style rule.</p>
	 * <p><i>Once destroyed, the animation can no longer be used.</i></p>
	 */
	CSSAnimation.prototype.destroy = function()
	{
		if(this._destroyed) { return; }

		var index = animations.indexOf(this);

		if(index === -1)
		{
			throw new Error('Failed to destroy animation because failed to find it in the internal array.');
		}

		// Remove stored generated name for dynamically created animation
		if(!this._predefined)
		{
			var nameInd = names.indexOf(this._name);
			if(nameInd !== -1)
			{
				names.splice(nameInd, 1);
			}
		}

		// Destroy all controls
		for(var i = 0; i < this._controls.length; i++)
		{
			this._controls[i]._destroyInternal();
		}

		this._controls = undefined;

		// Rule index should match animation index
		styleSheet.deleteRule(index);
		animations.splice(index, 1);

		this._destroyed = true;
	};

	/**
	 * Applies CSS animation to an element with the specified parameters.
	 *
	 * @param {HTMLElement} element Element to which to apply the animation.
	 * @param {object} [params] Animation parameters. See {@link https://developer.mozilla.org/en-US/docs/Web/CSS/animation|CSS Animation - MDN}.
	 * @param {string} [params.duration=1s] Duration of the one animation iteration. This may be specified in either seconds (s) or milliseconds (ms).
	 * @param {string} [params.function=linear] Timing function.
	 * @param {string} [params.delay=0s] The time offset, from the moment at which the animation is applied to the element, at which the animation should begin. This may be specified in either seconds (s) or milliseconds (ms).
	 * @param {(number|'infinite')} [params.iterations=1] The number of times the animation will repeat.
	 * @param {('normal'|'reverse'|'alternate'|'alternate-reverse')} [params.direction=normal] Defines whether an animation should be played forwards, backwards or in alternate cycles.
	 * @param {('none'|'forwards'|'backwards'|'both')} [params.fillMode=none] Sets how a CSS animation applies styles to its target before and after its execution.
	 * @param {('running'|'paused')} [params.state=running] Sets whether an animation is running or paused.
	 * @param {function} [params.onStart] Callback function that called when a animation has started.
	 * @param {function} [params.onEnd] Callback function that called when a animation has has completed.
	 * @param {function} [params.onIteration] Callback function that called when an iteration of an animation ends and another one begins.
	 *
	 * @returns {AnimationControl} Object that allow to control animation applied to an element.
	 */
	CSSAnimation.prototype.apply = function(element, params)
	{
		if(this._destroyed)
		{
			throw new Error('Cannot apply destroyed animation to element.');
		}

		var defaultParams = {
			duration: '1s',
			function: 'linear',
			delay: '0s',
			iterations: 1,
			direction: 'normal',
			fillMode: 'none',
			state: 'running',
			onStart: undefined,
			onEnd: undefined,
			onIteration: undefined
		};

		var control = new AnimationControl(this, element, I.merge(defaultParams, params));

		this._controls.push(control);

		return control;
	};

	/**
	 * Removes {@see AnimationControl} from this animation.
	 * @param {AnimationControl} control Animation control object.
	 * @protected
	 */
	CSSAnimation.prototype._removeControl = function(control)
	{
		var index = this._controls.indexOf(control);
		if(index !== -1)
		{
			this._controls.splice(index, 1);
		}
	};

	/**
	 * Returns an array of all created CSS animations.
	 * @returns {CSSAnimation[]} Array of CSS animations.
	 */
	CSSAnimation.all = function() { return animations.slice(); };

	/**
	 * Creates the stylesheet rule for animation based on the passed name and keyframes.
	 * @param {string} name Animation name.
	 * @param {object} keyframes Animation keyframes.
	 * @returns {string} Stylesheet rule for animation.
	 */
	function createAnimationRule(name, keyframes)
	{
		// TODO: specification check (from, to, <n>%).

		var result = '@keyframes ' + name + ' { ';

		for(var keyframe in keyframes)
		{
			result += keyframe + ' {';
			//noinspection JSUnfilteredForInLoop
			var props = keyframes[keyframe];

			for(var prop in props)
			{
				//noinspection JSUnfilteredForInLoop
				result += prop + ':' + props[prop] + ';';
			}

			result += '} ';
		}

		return result + ' }';
	}

	/**
	 * Generates random unique name for the dynamically created animation.
	 * @returns {string} Animation name.
	 */
	var randomName = (function()
	{
		/**
		 * Variable that increments if a random identifier is already in use.
		 * @type {number}
		 */
		var rareInc = 0;

		return function()
		{
			var rand = I.randomId(),
				name = rand;

			while(names.includes(name))
			{
				// increment and concatenate
				name = rand + ++rareInc;
			}

			return 'ir-animation-' + name;
		};
	})();

	// Initialization that called only at document load
	I.Init.register('ir-css-animation', function()
	{
		var style = document.createElement('style');
		document.head.appendChild(style);
		styleSheet = /** @type {CSSStyleSheet} */ style.sheet;
	}, true);

	return CSSAnimation;
})();