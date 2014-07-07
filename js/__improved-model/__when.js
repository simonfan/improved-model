/* jshint ignore:start */
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/* jshint ignore:end */

define(function (require, exports, module) {
	'use strict';

	var _ = require('lodash');

	/**
	 * Runs the condition against a model and
	 * if successful, executes the callback passing
	 * the model itself as the first argument.
	 *
	 * @param  {[type]}   model     [description]
	 * @param  {[type]}   condition [description]
	 * @param  {Function} fn        [description]
	 * @param  {[type]}   context   [description]
	 * @return {[type]}             [description]
	 */
	function _execCallback(model, condition, fn, context) {
		// run the condition fn
		if (condition(model.attributes)) {

			// exec callback
			fn.apply(context, [model]);
		}
	}


	/**
	 * Creates an event listener that tracks changes on the model
	 * and tries to match a criteria.
	 * When the criteria is matched, the callback fn
	 * is invoked.
	 *
	 * @param  {[type]}   criteria [description]
	 * @param  {Function} fn       [description]
	 * @param  {[type]}   context  [description]
	 * @return {[type]}            [description]
	 */
	function _whenThisDo(criteria, fn, context) {

		// create a condition fn based on the criteria.
		var condition = this.condition(criteria);

		// listen to change events.
		this.on('change', _.partial(_execCallback, this, condition, fn, context), this);

	}



	/**
	 * Creates a condition tracker that
	 * when matched sets the values
	 * onto the context (defaults to the model itself)
	 *
	 * @param {[type]} criteria [description]
	 * @param {[type]} values   [description]
	 */
	function _whenThisSet(criteria, values) {
		// build a callback fn
		var setCallback = _.partial(this.set, values);

		// create a normal when condition
		_whenThisDo.call(this, criteria, setCallback, this);
	}


	/**
	 * Sets a situation.
	 *
	 * @param  {[type]}   criteria [description]
	 * @param  {Function} action   [description]
	 * @return {[type]}            [description]
	 */
	exports.when = function whenThis(criteria, action, context) {


		// straight callback function
		if (_.isFunction(action)) {
			_whenThisDo.apply(this, arguments);

		} else if (_.isObject(action)) {
			_whenThisSet.apply(this, arguments);
		}

		// always return this;
		return this;
	};








	/**
	 * Stands to '_when' as 'listenTo' stands to 'on';
	 *
	 * @param  {[type]}   other    [description]
	 * @param  {[type]}   criteria [description]
	 * @param  {Function} fn       [description]
	 * @param  {[type]}   context  [description]
	 * @return {[type]}            [description]
	 */
	function _whenOtherDo(other, criteria, fn) {

		// build condition.
		var condition = this.condition(criteria);

		// context defaults to 'this', as 'listenTo' would do.
		context = context || this;

		// create listener.
		this.listenTo(other, 'change', _.partial(_execCallback, other, condition, fn, this));

	}




	function _whenOtherSet(other, criteria, values) {
		// build a callback fn
		var setCallback = _.partial(this.set, values);

		// create a normal when condition
		_whenOtherDo.call(this, criteria, setCallback, this);
	}


	exports.whenOther = function whenOther(other, criteria, action) {

		// straight callback function
		if (_.isFunction(action)) {
			_whenOtherDo.apply(this, arguments);

		} else if (_.isObject(action)) {
			_whenOtherSet.apply(this, arguments);
		}
	};
});
