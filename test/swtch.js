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

	describe('improved-model swtch', function () {
		beforeEach(function (done) {
			done();
		});

		it('swtch', function () {

			var md = model();

			var control = {};

			var swtch = md.swtch({

				'name:Rafael': function () {
					control.Rafael = true;
				},
				'lastName:Matta': function () {
					control.Matta = true;
				},

				'default': function () {
					control['default'] = true;
				}
			});

			// set data onto model
			md.set('name', 'Rafael');
			control.Rafael.should.be.true;

			md.set('lastName', 'Adao');
			control.Rafael.should.be.true;

			md.set('name', 'Sergio');
			control['default'].should.be.true;

			md.set('lastName', 'Matta');
			control.Matta.should.be.true;

		});
	});
});
