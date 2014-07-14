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

	describe('improved-model bindAttribute', function () {


		it('is fine (:', function () {

			var fruitModel = model.extend({
				initialize: function (attr, options) {

					model.prototype.initialize.call(this, attr, options);

					this.bindAttribute('name', 'uppercased-name', function (name) {
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
	});
});
