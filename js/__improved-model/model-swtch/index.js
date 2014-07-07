/* jshint ignore:start */
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/* jshint ignore:end */

define(function defImprovedModelSwtch(require, exports, module) {

	var swtch = require('swtch'),
		_     = require('lodash');


		// the condition builder
	var buildCondition = require('./build-condition'),
		// the callback builder
		buildCallback  = require('./build-callback');

	// direct reference to original methods
	var _initializeSwtch = swtch.prototype.initialize,
		_when            = swtch.prototype.when;

	var modelSwtch = module.exports = swtch.extend({
		initialize: function initializeModelSwtch(cases, options) {

			// the original intialize method only takes the cases argument.
			_initializeSwtch.call(this, cases);

			// save reference to the model
			this.model = options.model;
		},

		/**
		 * Override the when method in order to introduce a condition builder.
		 *
		 */
		when: function modelSwtchWhen(criteria, action, context) {

				// build the condition
			var condition = buildCondition(this.model, criteria),
				// build the callback
				callback  = buildCallback(this.model, action);

			// rebuild the arguments
			var args = Array.prototype.slice.call(arguments, 1);
			args.unshift(condition);

			// invoke the original when method
			return _when.apply(this, args);
		}
	});
});
