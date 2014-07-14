/* jshint ignore:start */
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/* jshint ignore:end */

define(function defBindAttribute(require, exports, module) {

	var _ = require('lodash');

	// do nothing
	function echo(v) { return v; }


	/**
	 * Bind a single attribute.
	 *
	 * @param  {[type]} src       [description]
	 * @param  {[type]} dest      [description]
	 * @param  {[type]} processor [description]
	 * @return {[type]}           [description]
	 */
	function bindAttributeToSingleDestination(src, dest, processor) {

		this.on('change:' + src, function () {

			this.set(dest, processor(this.get(src)));

		}, this);

		// initialize
		this.set(dest, processor(this.get(src)));
	}

	/**
	 * [exports description]
	 * @param  {[type]} src       [description]
	 * @param  {[type]} dest      [description]
	 * @param  {[type]} processor [description]
	 * @return {[type]}           [description]
	 */
	exports.bindAttribute = function bindAttribute(src, dest, processor) {

		if (_.isArray(dest)) {

			// processor default to echo (that does nothing :)
			processor = processor || echo;
			// if processor is string, try to get method.
			processor = _.isString(processor) ? this[processor] : processor;

			// bind the src to all the destinations required
			// using the same processor.
			_.each(dest, function (d) {

				bindAttributeToSingleDestination.call(this, src, d, processor);

			}, this);

		} else if (_.isObject(dest)) {

			// loop through destinations
			// {
			//     dest: function (sourceValue) {
			//         dest.
			//     }
			// }
			_.each(dest, function (processor, d) {

				// get processor
				processor = _.isString(processor) ? this[processor] : processor;

				bindAttributeToSingleDestination.call(this, src, d, processor);

			}, this);

		} else {

			// processor default to echo (that does nothing :)
			processor = processor || echo;
			// if processor is string, try to get method.
			processor = _.isString(processor) ? this[processor] : processor;

			bindAttributeToSingleDestination.call(this, src, dest, processor);

		}
	};

});
