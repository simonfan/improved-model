/* jshint ignore:start */
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/* jshint ignore:end */

define(function defBindAttribute(require, exports, module) {

	var _ = require('lodash');

	// do nothing
	function _echo(v) { return v; }


	/**
	 * Processes the source values and sets the result onto the dest attribuet.
	 * @param  {[type]} dest      [description]
	 * @param  {[type]} src       [description]
	 * @param  {[type]} processor [description]
	 * @return {[type]}           [description]
	 */
	function _processSourceAndSetDest(model, dest, src, processor) {
		// get the values from source
		var values = _.map(src, model.get, model);

		// invoke processor
		var destValue = processor.apply(model, values);

		// set
		model.set(dest, destValue);
	}


	function _defineVirtualAttribute(model, dest, src, processor) {

		// processor defaults to:
		// 1) method on the model
		// 2) echo
		processor = processor || model[src] || _echo;

		// source is always an array of attributes.
		src = _.isArray(src) ? src : [src];

		// create an event string
		var events = _.map(src, function (src) {
			return 'change:' + src;
		}).join(' ');

		// listen
		model.on(events, _.partial(_processSourceAndSetDest, model, dest, src, processor));


		// initilize
		_processSourceAndSetDest(model, dest, src, processor);
	}





	/**
	 * Hash holding the virtual attribute definitions.
	 *
	 * @type {Object}
	 */
	exports._virtualAttributes = {};

	/**
	 * [initializeIMVirtual description]
	 * @return {[type]} [description]
	 */
	exports.initializeIMVirtual = function initializeIMVirtual() {
		// initialize virtuals
		this.virtual(this._virtualAttributes);
	};


	/**
	 * Binds an attribute to one or more sources.
	 *
	 *
	 * @param  {[type]} dest      [description]
	 * @param  {[type]} src       [description]
	 * @param  {[type]} processor [description]
	 * @return {[type]}           [description]
	 */
	exports.defineVirtualAttribute = function defineVirtualAttribute() {

		// parse out arguments.
		if (_.isObject(arguments[0])) {
			// hash of virtual arguments
			// {
			//     destAttribute: {
			//         src: 'srcAttribute',
			//         processor: function(srcAttribute) {
			//             return 'final value ' + srcAttribute
			//         }
			//     }
			// }
			_.each(arguments[0], function (definition, dest) {
				var src, processor;

				if (_.isObject(definition)) {
					src      = definition.src;
					processor = definition.processor;
				} else {
					src = definition;
				}



				// define the virtual dest
				_defineVirtualAttribute(this, dest, src, processor);

			}, this);

		} else if (_.isString(arguments[0])) {
			// arguments: [destAttribute, srcAttribute, processor]

			var args = _.toArray(arguments);
			args.unshift(this);

			// define the single virtual
			_defineVirtualAttribute.apply(null, args);
		}

		// return this
		return this;
	};

	/**
	 * Alias :)
	 *
	 * @type {[type]}
	 */
	exports.virtual = exports.defineVirtualAttribute;
});
