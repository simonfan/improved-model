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

})('test', function(model, should) {
	'use strict';

	describe('improved-model when', function () {

		it('when(Object, callback, else)', function () {


			// instantiate model
			var md = model();

			// control object
			var control = false;

			// set when condition
			md.when({
				name: 'John',
				lastName: 'Smith'
			}, function () {
				control = true;
			});

			// only set name
			md.set('name', 'John');

			// nothing happens
			control.should.be.false;

			// set last name
			md.set('lastName', 'Smith');

			// callback invoked
			control.should.be.true;
		});

		it('when(String, callback')
	});
});
