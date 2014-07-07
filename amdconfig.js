require.config({
	urlArgs: 'bust=0.46394207794219255',
	baseUrl: '/js',
	paths: {
		requirejs: '../bower_components/requirejs/require',
		text: '../bower_components/requirejs-text/text',
		mocha: '../node_modules/mocha/mocha',
		should: '../node_modules/should/should',
		'improved-model': 'index',
		jquery: '../bower_components/jquery/dist/jquery',
		backbone: '../bower_components/backbone/backbone',
		'lowercase-backbone': '../bower_components/lowercase-backbone/built/lowercase-backbone',
		lodash: '../bower_components/lodash/dist/lodash.compat',
		qunit: '../bower_components/qunit/qunit/qunit',
		'requirejs-text': '../bower_components/requirejs-text/text',
		subject: '../bower_components/subject/built/subject',
		underscore: '../bower_components/underscore/underscore',
		containers: '../bower_components/containers/built/containers',
		deep: '../bower_components/deep/built/deep',
		itr: '../bower_components/itr/built/itr',
		'object-query': '../bower_components/object-query/built/object-query',
		swtch: '../bower_components/swtch/built/swtch'
	},
	shim: {
		backbone: {
			exports: 'Backbone',
			deps: [
				'jquery',
				'underscore'
			]
		},
		underscore: {
			exports: '_'
		},
		mocha: {
			exports: 'mocha'
		},
		should: {
			exports: 'should'
		}
	}
});
