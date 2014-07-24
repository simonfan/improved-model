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

	describe('improved-model types', function () {

		it('extendAttributeTypes', function () {

			var md = modeli.extendAttributeTypes({
				integer: 'Integer',
				string: 'String',
				array: 'Array',
				bool: 'Boolean',
			});


			var inst = md({
				integer: '700',
			});

			inst.get('integer').should.exactly(700);

			inst.set('array', 'red');
			inst.get('array').should.eql(['red']);

			inst.set({
				bool: 'oqweq',
				string: 9000
			});

			inst.get('bool').should.be.true;
			inst.get('string').should.exactly('9000');


		});

		it('getAs', function () {

			var inst = modeli({
				id: '6000'
			});

			inst.getAs('Integer', 'id').should.exactly(6000);
		});
	});
});
