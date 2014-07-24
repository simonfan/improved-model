/* jshint ignore:start */
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/* jshint ignore:end */

define(function defImproveModelSet(require, exports) {

	var _ = require('lodash');

	exports.type = function defineType() {

		if (_.isString(arguments[0])) {
			this.prototype.types[arguments[0]] = arguments[1];
		} else {
			_.assign(this.prototype.types, arguments[0]);
		}

		return this;
	};

	/**
	 *
	 * @param  {[type]} types [description]
	 * @return {[type]}       [description]
	 */
	exports.extendTypes = function extendTypes(types) {

		var extendedTypes = _.create(this.prototype.types);
		_.assign(extendedTypes, types);

		return this.extend({ types: extendedTypes });
	};

	/**
	 * Defines attribute types
	 * @return {[type]} [description]
	 */
	exports.attributeType = function defineAttributeType() {

		if (_.isString(arguments[0])) {
			this.prototype.attributeTypes[arguments[0]] = arguments[1];
		} else {
			_.assign(this.prototype.attributeTypes, arguments[0]);
		}

		return this;
	};

	/**
	 * Extends and defines attributes types.
	 *
	 * @param  {[type]} attributeTypes [description]
	 * @return {[type]}                [description]
	 */
	exports.extendAttributeTypes = function extendAttributeTypes(attributeTypes) {

		var extendedAttributeTypes = _.create(this.prototype.attributeTypes);
		_.assign(extendAttributeTypes, attributeTypes);

		return this.extend({ attributeTypes: extendAttributeTypes });
	};
});
