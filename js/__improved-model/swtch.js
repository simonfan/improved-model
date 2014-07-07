/* jshint ignore:start */
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/* jshint ignore:end */

define(function (require, exports) {
	'use strict';

		// the modelSwtch constructor.
	var modelSwtch = require('./model-swtch/index');

	/**
	 * Create a model swtch related to this model.
	 *
	 * @param  {[type]} cases [description]
	 * @return {[type]}       [description]
	 */
	exports.swtch = function defineSwtch(cases) {

		// instantiate the modelSwtch
		var mswtch = modelSwtch(cases, { model: this });

		// get execution method, based on executionType option
		var _exec = this.executionType === 'all' ? mswtch.exec : mswtch.execFirst;

		// set event listeners for execution
		this.on('change', function (model) {
			// invoke the exec.
			_exec.call(mswtch, model.attributes);
		});

		// exec once
		_exec.call(mswtch, this.attributes);

		return mswtch;
	};

	/**
	 * Sets a swtch onto another model.
	 *
	 * @param  {[type]} other [description]
	 * @param  {[type]} cases [description]
	 * @return {[type]}       [description]
	 */
	exports.swtchOther = function defineSwtchOther(other, cases) {

		// instantiate the mswtch
		var mswtch = modelSwtch(cases, { model: other });

		// get execution method
		var _exec = this.executionType === 'all' ? mswtch.exec : mswtch.execFirst;

		// set event listeners.
		this.listenTo(other, 'change', function (model) {
			_exec.call(mswtch, model.attributes);
		});

		// exec once
		_exec.call(mswtch, other.attributes);

		return mswtch;
	};
});
