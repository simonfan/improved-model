(function(name, factory) {

	var mod = typeof define !== 'function' ?
		// node
		'.././js' :
		// browser
		'improved-model',
		// dependencies for the test
		deps = [mod, 'should'];

	if (typeof define !== 'function') {
		// node
		factory.apply(null, deps.map(require));
	} else {
		// browser
		define(deps, factory);
	}

})('test', function(ImprovedModel, should) {
	'use strict';

	describe('ImprovedModel basics', function () {
		beforeEach(function (done) {
			done();
		});

		it('is fine (:', function () {
			var fruit = { name: 'banana' }
			fruit.should.have.property('name', 'banana');
		});
	});
});
