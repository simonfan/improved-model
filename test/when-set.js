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

	describe('improved-model when-set', function () {
		it('is fine (:', function () {

			var md = model();

			md.when({ size: 'large' }, {
				width: 1000,
				height: 600,
			})
			.when('size:small', {
				width: 200,
				height: 200
			});

			md.set('size', 'small');
			md.get('width').should.eql(200);
			md.get('height').should.eql(200);

			md.set('size', 'large');
			md.get('width', 1000);
			md.get('height', 600);
		});
	});
});
