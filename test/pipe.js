(function(name, factory) {

	var mod = typeof define !== 'function' ?
		// node
		'.././js' :
		// browser
		'improved-model',
		// dependencies for the test
		deps = [mod, 'should', 'lowercase-backbone'];

	if (typeof define !== 'function') {
		// node
		factory.apply(null, deps.map(require));
	} else {
		// browser
		define(deps, factory);
	}

})('test', function(improvedModel, should, backbone) {
	'use strict';

	describe('improved-model pipe', function () {

		it('pipe attribute', function () {

			var src = improvedModel();

			// dest
			var dest = backbone.model();

			// pipe data
			src.pipe(dest, {
				srcAttr : 'destAttr',
				srcAttr1: 'destAttr1'
			});

			// set attr on the md;
			src.set('srcAttr', 'some crazy value');

			// check the attr1 on the dest;
			dest.get('destAttr').should.eql('some crazy value');


			src.set({
				srcAttr : 'another value',
				srcAttr1: 'some val'
			});

			// check dest
			dest.get('destAttr').should.eql('another value');
			dest.get('destAttr1').should.eql('some val');
		});
	});
});
