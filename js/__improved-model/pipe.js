/* jshint ignore:start */
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/* jshint ignore:end */

define(function defModelPump(require, exports, module) {
	'use strict';

	var pipe = require('pipe'),
		_    = require('lodash');

	/**
	 * modelPipe
	 *
	 * @param  {[type]} model      [description]
	 * @param  {[type]} attribute) {			return   model.get(attribute);		} [description]
	 * @param  {[type]} set:       function      setToModel(model,         attribute,    value) {			return model.set(attribute, value);		}	} [description]
	 * @return {[type]}            [description]
	 */
	var modelPipe = pipe.extend({

		/**
		 * Gets data from the model.
		 *
		 * @param  {[type]} model     [description]
		 * @param  {[type]} attribute [description]
		 * @return {[type]}           [description]
		 */
		get: function getFromModel(model, attribute) {
			return model.get(attribute);
		},

		/**
		 * Sets the model on the attribute.
		 *
		 * @param {[type]} model     [description]
		 * @param {[type]} attribute [description]
		 * @param {[type]} value     [description]
		 */
		set: function setToModel(model, attribute, value) {
			return model.set(attribute, value);
		}
	});



	// methods

	exports.initializeIMPipe = function initializePipe() {

		// bind methods
		_.bindAll(this, ['pump']);

		// create array of pipes
		this.pipes = [];


		// listen to changes on model.
		// whenever changes occur on this model, pump data

		this.on('change', this.pump);
	};

	/**
	 * Pump data to destination.
	 *
	 * @return {[type]} [description]
	 */
	exports.pump = function pumpData() {
		_.each(this.pipes, function (pipe) {
			pipe.pump();

		});

		return this;
	};

	/**
	 * Defines a pipe object.
	 *
	 * @param  {[type]} map     [description]
	 * @param  {[type]} options [description]
	 * @return {[type]}         [description]
	 */
	exports.pipe = function defineModelPipe(dest, map, options) {

		// parse out the map
		if (_.isString(map)) {
			var attribute = map;

			map = {};
			map[attribute] = attribute;
		}

		// create a pipe on the model pump
		var pipe = modelPipe(this, dest, map, options);

		// add pipe to the pipes array
		this.pipes.push(pipe);


		// return the pipe
		return pipe;
	};

});
