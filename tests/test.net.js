describe('Iridium.Net', () =>
{
	describe('.objectURLEncode()', () =>
	{
		it('should return empty string for empty object ({})', () =>
		{
			assert.equal(Iridium.Net.objectURLEncode({}), '');
		});

		it('should return empty string for null or undefined', () =>
		{
			assert.equal(Iridium.Net.objectURLEncode(undefined), '');
			assert.equal(Iridium.Net.objectURLEncode(null), '');
		});
	});
});