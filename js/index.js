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
		 * Hash holding the virtual attribute definitions.
		 *
		 * @type {Object}
		 */
		virtualAttributes: {},

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
		.assignProto(require('./__improved-model/virtual'))
		.assignProto(require('./__improved-model/pipe'));

	// define static methods
	model.assignStatic({

		/**
		 * Extends the currnet model and then sets the virtual attributes
		 * property on the prototype of the extended model constructor.
		 *
		 * @param  {[type]} virtuals [description]
		 * @return {[type]}          [description]
		 */
		extendVirtualAttributes: function extendVirtualAttributes(virtuals) {

			var extended = this.extend();

			extended.defineVirtualAttributes(virtuals);

			return extended;
		},

		/**
		 * Sets the virtualAttributes property on the prototype.
		 *
		 * @param  {[type]} virtuals [description]
		 * @return {[type]}          [description]
		 */
		defineVirtualAttributes: function defineVirtualAttributes(virtuals) {

			// set virtualAttributes property on the prototype.
			this.prototype.virtualAttributes = virtuals;

			return this;
		}
	});
});
