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

		it('when(Object, callback, context)', function () {


			// instantiate model
			var md = model();

			// control object
			var control = false;

			// set when condition
			md.when({
				name: 'John',
				lastName: 'Smith',
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

		it('when(Array, callback)', function () {
			var md = model();

			var control = false;

			var conditions = [];
			conditions.push({
				name: 'Ricardo',
				lastName: 'Moraes'
			});

			conditions.push({
				name: 'Joao'
			});

			md.when(conditions, function () {
				control = md.get('name');
			});

			md.set('name', 'Ricardo');
			control.should.be.false;

			md.set('name', 'Joao');
			control.should.eql('Joao');

			md.set({
				name: 'Ricardo',
				lastName: 'Moraes'
			});
			control.should.eql('Ricardo');
		});

		describe('when(String, callback)', function () {

			it('&& (AND)', function () {
				var md = model();

				var control = false;

				md.when('name:Maria && lastName:Figueiredo', function () {
					control = true;
				});


				// set name only
				md.set('lastName', 'Figueiredo');
				control.should.be.false;

				md.set('name', 'Joana');
				control.should.be.false;

				md.set('name', 'Maria');
				control.should.be.true;
			});

			it('|| (OR)', function () {

				var md = model();

				var control = false;

				md.when('name:Maria && lastName:Figueiredo || name:Joao', function () {
					control = md.get('name');
				});

				md.set('name', 'Joao');
				control.should.eql('Joao');

				md.set('name', 'Maria');
				// unchanged
				control.should.eql('Joao');

				md.set('lastName', 'Figueiredo');
				control.should.eql('Maria');
			});
		});

	});
});
