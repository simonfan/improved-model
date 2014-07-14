/* jshint ignore:start */
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/* jshint ignore:end */

define(function defBindAttribute(require, exports, module) {

	var _ = require('lodash');

	// do nothing
	function echo(v) { return v; }


	/**
	 * Processes the source values and sets the result onto the dest attribuet.
	 * @param  {[type]} dest      [description]
	 * @param  {[type]} src       [description]
	 * @param  {[type]} processor [description]
	 * @return {[type]}           [description]
	 */
	function processSourceAndSetDest(dest, src, processor) {
		// get the values from source
		var values = _.map(src, this.get, this);

		// invoke processor
		var destValue = processor.apply(this, values);

		// set
		this.set(dest, destValue);
	}


	/**
	 * Binds an attribute to one or more sources.
	 *
	 *
	 * @param  {[type]} dest      [description]
	 * @param  {[type]} src       [description]
	 * @param  {[type]} processor [description]
	 * @return {[type]}           [description]
	 */
	exports.virtual = function virtual(dest, src, processor) {

		// processor defaults to echo
		processor = processor || echo;

		// source is always an array of attributes.
		src = _.isArray(src) ? src : [src];

		// create an event string
		var events = _.map(src, function (src) {
			return 'change:' + src;
		}).join(' ');

		// listen
		this.on(events, _.partial(processSourceAndSetDest, dest, src, processor), this);


		// initilize
		processSourceAndSetDest.call(this, dest, src, processor);
	};
});
