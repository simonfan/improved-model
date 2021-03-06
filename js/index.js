//     improved-model
//     (c) simonfan
//     improved-model is licensed under the MIT terms.

/**
 * AMD and CJS module.
 *
 * @module improved-model
 */

/* jshint ignore:start */
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/* jshint ignore:end */

define(function (require, exports, module) {
	'use strict';


	var backbone = require('lowercase-backbone'),
		_        = require('lodash');

	// direct reference to the backbone.model initialization logic
	var _initializeModel = backbone.model.prototype.initialize;


	// options that should be set directly to the object.
	var improvedModelOptions = ['cases', 'executionType'];

	var model = module.exports = backbone.model.extend({

		/**
		 * Overrride default model initialization.
		 *
		 * @param  {[type]} attributes [description]
		 * @param  {[type]} options    [description]
		 * @return {[type]}            [description]
		 */
		initialize: function initializeImprovedModel(attributes, options) {

			// initialize the backbone model
			_initializeModel.apply(this, arguments);

			// get options
			options = options || {};
			_.each(improvedModelOptions, function (opt) {

				this[opt] = options[opt] || this[opt];

			}, this);

			// INITIALIZATION.
			this.initializeIMSwtch();

			this.initializeIMVirtual();

			this.initializeIMPipe();
		},

		/**
		 * Determines which execution should be done (all|first)
		 *
		 * @type {String}
		 */
		executionType: 'all',
		cases: {},


		when: function whenThis(criteria, action, context) {
			this.mainSwtch.when(criteria, action, context);

			return this;
		}
	});

	model
		.assignProto(require('./__improved-model/swtch'))
		.assignProto(require('./__improved-model/virtual/prototype'))
		.assignProto(require('./__improved-model/pipe'))
		.assignProto(require('./__improved-model/types/prototype'));

	// define static methods
	model
		.assignStatic(require('./__improved-model/virtual/static'))
		.assignStatic(require('./__improved-model/types/static'));

	// !!!!!!!!!!!!!!!!!!!!!!!!!
	// DEFINE NEW EXTEND METHOD
	// This new extension method allows for
	// extending object properties.
	//
	// STUDY FURTHER!!!!!
	// !!!!!!!!!!!!!!!!!!!!!!!!!
	var _extend = model.extend;
	model.extend = function extendImprovedModel(extensions, options) {


		extensions._virtualAttributes = _.assign(_.create(this.prototype._virtualAttributes), extensions._virtualAttributes);

		return _extend.call(this, extensions, options);
	};
});
