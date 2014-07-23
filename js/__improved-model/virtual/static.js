/* jshint ignore:start */
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/* jshint ignore:end */

define(function defBindAttribute(require, exports, module) {
	'use strict';

	var _ = require('lodash');


	/**
	 * Sets the virtualAttributes property on the prototype.
	 *
	 * @param  {[type]} virtuals [description]
	 * @return {[type]}          [description]
	 */
	exports.defineVirtualAttribute = function defineVirtualAttribute() {


		if (_.isObject(arguments[0])) {
			// hash of virtual attibute definition
			// arguments: [
			// 		{ dest: { src: [src], processor: function () {} }}
			// ]
			_.assign(this.prototype._virtualAttributes, arguments[0]);

		} else {
			// single virtual attribute definition
			// arguments: [dest, src, processor]
			this.prototype._virtualAttributes[arguments[0]] = {
				src: arguments[1],
				processor: arguments[2]
			};
		}

		return this;
	};

	/**
	 * Extends the currnet model and then sets the virtual attributes
	 * property on the prototype of the extended model constructor.
	 *
	 * @param  {[type]} virtuals [description]
	 * @return {[type]}          [description]
	 */
	exports.extendVirtualAttributes = function extendVirtualAttributes(virtuals) {


		var inheritedVirtuals = _.create(this.prototype._virtualAttributes);

		var extended = this.extend({ virtuals: inheritedVirtuals });

		extended.defineVirtualAttribute(virtuals);

		return extended;
	};
});
