/**
 * Iridium framework core tests.
 * @requires Iridium
 * @author rayleigh <rayleigh@protonmail.com>
 * @licence GPL-3.0
 */

describe('Iridium', () =>
{
	describe('.stringContains()', () =>
	{
		let hs = 'what about some test string';

		it('should return true for equal strings', () =>
		{
			assert(Iridium.stringContains(hs, hs));
		});

		it('should return true for haystack contain needle', () =>
		{
			assert(Iridium.stringContains('about', hs));
			assert(Iridium.stringContains('what', hs));
			assert(Iridium.stringContains('string', hs));
			assert(Iridium.stringContains(' ', hs));
		});

		it('should return false if haystack does not contain needle', () =>
		{
			assert.equal(Iridium.stringContains('nothing', hs), false);
		});
	});

	describe('.empty()', () =>
	{
		it('should return true for empty object ({})', () =>
		{
			assert(Iridium.empty({}));
		});

		it('should return true for empty string ("")', () =>
		{
			assert(Iridium.empty(''));
		});
		
		it('should return true for empty array ([])', () =>
		{
			assert(Iridium.empty([]));
		});

		it('should return true for number 0 and 0.0', () =>
		{
			assert(Iridium.empty(0));
			assert(Iridium.empty(0.0));
		});

		it('should return false for not empty object', () =>
		{
			assert.equal(Iridium.empty({key: 'value'}), false);
		});

		it('should return false for nor empty string', () =>
		{
			assert.equal(Iridium.empty('test'), false);
		});

		it('should return false for not empty array', () =>
		{
			assert.equal(Iridium.empty([1, 2, 3]), false);
		})

		it('should return false for the numbers that differs from 0', () =>
		{
			assert.equal(Iridium.empty(42), false);
			assert.equal(Iridium.empty(0.5), false);
		});
	});

	describe('.merge()', () =>
	{
		it('should return target object if merget with null', () =>
		{
			let target = {prop: 'content'},
				res = Iridium.merge(target, null);
			assert(res.prop === 'content');
		});

		it('should return empty object if empty object(s) is passed', () =>
		{
			assert(Iridium.empty(Iridium.merge({})));
			assert(Iridium.empty(Iridium.merge({}, {})));
		});

		it('should merge two objects', () =>
		{
			let obj1 = {prop1: 'one'},
				obj2 = {prop2: 'two'};

			let res = Iridium.merge(obj1, obj2);

			assert(res.prop1 === 'one');
			assert(res.prop2 === 'two');
		});

		it('should override property if it already exists', () =>
		{
			let obj1 = {prop1: 'one', prop2: 'two'},
				obj2 = {prop1: 'test', prop3: 'three'};

			let res = Iridium.merge(obj1, obj2);

			assert(res.prop1 === 'test');
			assert(res.prop2 === 'two');
			assert(res.prop3 === 'three');
		});

		it('should merge three or more objects', () =>
		{
			let obj1 = {prop1: 'one'},
				obj2 = {prop2: 'two'},
				obj3 = {prop3: 'three'};

			let res = Iridium.merge(obj1, obj2, obj3);

			assert(res.prop1 === 'one' && res.prop2 === 'two' && res.prop3 === 'three');
		});

		it('should merge objects recursively', () =>
		{
			let obj1 = {prop1: {prop1: '1'}},
				obj2 = {prop1: {prop1: '11', prop2: '22'}},
				obj3 = {prop1: {prop3: '3'}};
			let res = Iridium.merge(obj1, obj2, obj3);
			assert(res.prop1.prop1 === obj2.prop1.prop1
				&& res.prop1.prop2 === obj2.prop1.prop2
				&& res.prop1.prop3 === obj3.prop1.prop3);
		});

		it('should just copy the references to the Node objects', () =>
		{
			let obj1 = {prop1: 1, prop2: document.documentElement},
				obj2 = {prop2: document.body};
			let res = Iridium.merge(obj1, obj2);
			assert(res.prop2 === document.body);
		});
	});
});