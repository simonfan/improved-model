/* jshint ignore:start */
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/* jshint ignore:end */

define(function defImproveModelSet(require, exports) {

	var _     = require('lodash'),
		model = require('lowercase-backbone').model;

	var types = exports.types = {};

	types['String']  = function typeString(v) { return '' + v; };
	types['Integer'] = function typeInt(v) { return parseInt(v); };
	types['Int']     = types['Integer'];	// alias
	types['Float']   = function typeFloat(v) { return parseFloat(v); };
	types['Array']   = function typeArray(v) { return _.isArray(v) ? v : [v]; };
	types['Boolean'] = function typeBoolean(v) { return v ? true : false; }


	/**
	 * Maps the attributes to their respective types.
	 * @type {Object}
	 */
	exports.attributeTypes = {};


	// direct reference to the original set method
	var _set = model.prototype.set;

	/**
	 * Override set in order to convert type on set :)
	 */
	exports.set = function iset() {

		if (_.isString(arguments[0])) {
			// arguments = [key, value, options]

			var key     = arguments[0],
				value   = arguments[1];

			// convert value to right type if there is
			// a type defined on attributeTypes hash
			var attrType = this.attributeTypes[key];
			value = attrType ? this.types[attrType].call(this, value) : value;

			return _set.call(this, key, value, arguments[2]);

		} else {
			// arguments = [{ key: value }, options]
			var values = arguments[0],
				attributeTypes = this.attributeTypes;

			values = _.mapValues(arguments[0], function (value, key) {

				var attrType = attributeTypes[key];
				return attrType ? this.types[attrType].call(this, value) : value;

			}, this);

			return _set.call(this, values, arguments[1])
		}
	};


	/**
	 * Override get in ordre to allow 'getAs'
	 * @param  {[type]} attr [description]
	 * @param  {[type]} type [description]
	 * @return {[type]}      [description]
	 */
	exports.getAs = function getAs(type, attr) {

		// get value
		var value = this.get(attr);

		// convert and return
		return this.types[type].call(this, value);
	};
});
