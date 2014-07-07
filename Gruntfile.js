/**
Gruntfile designed to work for modules that work on browser and node.
*/

module.exports = function (grunt) {

	'use strict';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		connect: {
			default: {
				options: {
					hostname: 'localhost',
					port: 8000,
					keepalive: true,
					livereload: true,
					open: 'http://localhost:8000',
				}
			},
		},

		bower: {
			target: {
				rjsConfig: 'amdconfig.js',
				options: {
					baseUrl: './js'
				}
			}
		},

		simplemocha: {
			options: {
			//	globals: ['should'],
				timeout: 3000,
				ignoreLeaks: false,
			//	grep: '*-test',
				ui: 'bdd',
				reporter: 'dot'
			},

			all: { src: ['test/*.js'] }
		},

		yuidoc: {
			compile: {
				name: 'improved-model',
				version: '0.0.0',
			//	description: '',
			// 	url: '',
				options: {
					paths: 'js/',
				//	themedir: 'path/to/custom/theme/',
					outdir: 'docs/'
				}
			}
		},


		jshint: {
			options: {
				jshintrc: '.jshintrc',
				force: true,
			},
			gruntfile: {
				src: 'Gruntfile.js'
			},

			// tests
			test: {
				src: ['test/**/*.js']
			},

			// js
			js: {
				src: ['js/**/*.js']
			}
		},

		concurrent: {
			target: ['connect', 'watch']
		},

		watch: {
			live: {
				files: ['amdconfig.js', 'js/**/*.js', 'test/**', 'demo/**', 'docs/**', 'Gruntfile.js'],
				options: {
					livereload: true
				},
				tasks: ['jshint:gruntfile', 'jshint:js', 'simplemocha']
			},

			bower: {
				files: ['bower.json'],
				tasks: ['bower']
			}
		},

		requirejs: {
			// run r.js to generate a single file as the output
			// minifying and inlining all dependencies.
			file: {
				options: {
					// base url where to look for module files
					// and relative to which the module paths will be defined
					// (must coincide with that defined in mainConfigFile)
					baseUrl: './js',
					// module name
					name: 'improved-model',
					// output here
					out: 'built/improved-model.js',
					// config file
					mainConfigFile: 'amdconfig.js',

					// include these modules
					include: [],

					// exclude these modules AND their dependencies
					// (excluding your bower dependencies)
					exclude: ["lowercase-backbone"],

					// excludeShallow
					excludeShallow: [],

					optimize: 'uglify2',

					pragmas: {
						exclude: true,
					},
				}
			},

			dev: {
				options: {
					// base url where to look for module files
					// and relative to which the module paths will be defined
					// (must coincide with that defined in mainConfigFile)
					baseUrl: './js',
					// module name
					name: 'improved-model',
					// output here
					out: './built/improved-model.dev.js',
					// config file
					mainConfigFile: 'amdconfig.js',

					// include these modules
					include: [],

					// exclude these modules AND their dependencies
					// (excluding your bower dependencies)
					exclude: ["lowercase-backbone"],

					// excludeShallow
					excludeShallow: [],

					optimize: 'none',

					pragmas: {
						exclude: true,
					},
				}
			},
		}
	});

	/**
	 * Task loading
	 */
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-yuidoc');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-concurrent');

	grunt.loadNpmTasks('grunt-bower-requirejs');
	/**
	Gets dependencies from bower.json and puts them into the require.js
	configuration script (amdconfig.js).
	*/

	grunt.loadNpmTasks('grunt-simple-mocha');


	// mocha tests
	grunt.registerTask('mocha', 'simplemocha');

	grunt.registerTask('default', ['bower', 'yuidoc', 'jshint:gruntfile', 'jshint:js', 'requirejs', 'simplemocha', 'concurrent']);
};
