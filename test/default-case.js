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

})('test', function(modeli, should) {
	'use strict';

	describe('modeli default-case', function () {

		it('is fine (:', function () {

			var control = {};

			var md = modeli();

			md.when({
				name: 'Agnes',
				lastName: 'Rojo'
			}, function () {
				control.Agnes = true;
				control.default = false;
			});

			md.when('default', function () {
				control.Agnes = false;
				control.default = true;
			});

			md.set('name', 'Agnes');

			control.Agnes.should.be.false;
			control.default.should.be.true;

			md.set('lastName', 'Rojo');
			control.Agnes.should.be.true;
			control.default.should.be.false;

			md.set('middleName', 'Andrade');
			control.Agnes.should.be.true;
			control.default.should.be.false;

			md.set('lastName', 'Correa');
			control.Agnes.should.be.false;
			control.default.should.be.true;
		});
	});
});
