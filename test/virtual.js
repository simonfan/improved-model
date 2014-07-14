(function(name, factory) {

	var mod = typeof define !== 'function' ?
		// node
		'.././js' :
		// browser
		'improved-model',
		// dependencies for the test
		deps = [mod, 'should', 'lodash'];

	if (typeof define !== 'function') {
		// node
		factory.apply(null, deps.map(require));
	} else {
		// browser
		define(deps, factory);
	}

})('test', function(model, should, _) {
	'use strict';

	describe('improved-model virtual', function () {


		it('single source', function () {

			var fruitModel = model.extend({
				initialize: function (attr, options) {

					model.prototype.initialize.call(this, attr, options);

					this.virtual('uppercased-name', 'name', function (name) {
						return name.toUpperCase();
					});

				},
			})

			var md = fruitModel({
				name: 'Banana',
				color: 'Yellow'
			});

			md.get('uppercased-name').should.eql('BANANA');

		});

		it('multiple sources', function () {


			var md = model();

			// set some bound attributes
			md.virtual('fullName', ['name', 'middleName', 'lastName'], function () {
				return _.toArray(arguments).join(' ');
			});


			md.set({
				name: 'Alice',
				middleName: 'Rocha',
				lastName: 'Santos'
			});

			md.get('fullName').should.eql('Alice Rocha Santos');

		});

	});
});
