/* jshint ignore:start */

/* jshint ignore:end */

define('__improved-model/model-swtch/build-condition',['require','exports','module','object-query','lodash'],function (require, exports, module) {
	

	var objectQuery = require('object-query'),
		_           = require('lodash');



	var or    = /\s*\|\|\s*/g,
		and   = /\s*&&\s*/g,
		colon = /\s*:\s*/g,
		pipe  = /\s*\|\s*/g;

	/**
	 * If criteria is a string, parses it.
	 * Otherwise, simply return the criteria object.
	 *
	 * @param  {[type]} criteria [description]
	 * @return {[type]}          [description]
	 */
	function parseCriteriaStr(criteriaStr) {

		// examples:
		// 'attrName:attrValue'
		// 'attrName:maybeThis|orThat|orThatOther && anotherAttr:anotherVal || yetAnother:val'

		// [1] split ORs
		var ors = criteriaStr.split(or);

		var possibilities = _.map(ors, function (criteriaStr) {
			// criteriaStr: attr1:v1|v2|v3 && attr2:v4

			var criteria = {};

			_.each(criteriaStr.split(and), function (criteriaStr) {

				// criteriaStr: value:someValue|orAnother

				var split = criteriaStr.split(colon);

				if (!split[1]) {
					throw new Error('No value found for ' + key + ' criterion.');
				}

				var key   = split[0],
					value = split[1].split(pipe);

				// if value is an array of a single item, unwrap it
				criteria[key] = (value.length > 1) ? value : value[0];
			});

			return criteria;
		});

		return possibilities;
	}

	/**
	 * Returns a function that returns a boolean.
	 *
	 * @param  {[type]} criteria [description]
	 * @return {[type]}          [description]
	 */
	module.exports = function buildCondition(model, criteria) {

		// parse out the criteria
		if (_.isString(criteria)) {
			criteria = parseCriteriaStr(criteria);
		}

		// return a partialized objectQuery that
		// already has the model.
		return _.partial(objectQuery(criteria), model.attributes);
	};
});

/* jshint ignore:start */

/* jshint ignore:end */

define('__improved-model/model-swtch/build-callback',['require','exports','module','lodash'],function (require, exports, module) {
	

	var _ = require('lodash');

	function setCallback(model, values) {

		model.set(values);
	}

	/**
	 * Builds the callback function according to the type of the action.
	 *
	 * @param  {[type]} model  [description]
	 * @param  {[type]} action [description]
	 * @return {[type]}        [description]
	 */
	module.exports = function buildCallback(model, action) {

		if (_.isFunction(action)) {
			// simple callback
			return _.partial(action, model);
		} else {

			// setting callback
			return _.partial(setCallback, model, action);
		}
	};
});

/* jshint ignore:start */

/* jshint ignore:end */

define('__improved-model/model-swtch/index',['require','exports','module','swtch','lodash','./build-condition','./build-callback'],function defImprovedModelSwtch(require, exports, module) {

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
			// save reference to the model
			// do this before initializing the swtch
			// as swtch initialization tries to call
			// when method for each of the cases.
			this.model = options.model;

			// parse out cases
			var _cases;

			if (_.isArray(cases)) {
				// array of condition definiitons.
				_cases = cases;
			} else {
				// object that has to be parsed out.
				_cases = [];

				_.each(cases, function (action, criteria) {
					_cases.push({
						condition: criteria,
						value    : action,
					});
				});
			}

			// the original intialize method only takes the cases argument.
			_initializeSwtch.call(this, _cases);
		},

		/**
		 * Override the when method in order to introduce a condition builder.
		 *
		 */
		when: function modelSwtchWhen(criteria, action, context) {
			var args = _.toArray(arguments);

			if (criteria !== 'default') {

					// build the condition
				var condition = buildCondition(this.model, criteria),
					// build the callback
					callback  = buildCallback(this.model, action);

				// rebuild the arguments
				args = [condition, callback].concat(args.slice(2));
			}

			// invoke the original when method
			return _when.apply(this, args);
		}
	});
});

/* jshint ignore:start */

/* jshint ignore:end */

define('__improved-model/swtch',['require','exports','module','./model-swtch/index'],function (require, exports) {
	

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
});

/* jshint ignore:start */

/* jshint ignore:end */

define('__improved-model/virtual',['require','exports','module','lodash'],function defBindAttribute(require, exports, module) {

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
	function processSourceAndSetDest(model, dest, src, processor) {
		// get the values from source
		var values = _.map(src, model.get, model);

		// invoke processor
		var destValue = processor.apply(model, values);

		// set
		model.set(dest, destValue);
	}


	function defineVirtualProperty(model, dest, src, processor) {

		// processor defaults to echo
		processor = processor || echo;

		// source is always an array of attributes.
		src = _.isArray(src) ? src : [src];

		// create an event string
		var events = _.map(src, function (src) {
			return 'change:' + src;
		}).join(' ');

		// listen
		model.on(events, _.partial(processSourceAndSetDest, model, dest, src, processor));


		// initilize
		processSourceAndSetDest(model, dest, src, processor);
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
	exports.virtual = function virtual() {

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

				// define the virtual dest
				defineVirtualProperty(this, dest, definition.src, definition.processor);

			}, this);

		} else if (_.isString(arguments[0])) {
			// arguments: [destAttribute, srcAttribute, processor]

			var args = _.toArray(arguments);
			args.unshift(this);

			// define the single virtual
			defineVirtualProperty.apply(null, args);
		}

		// return this
		return this;
	};
});

//     improved-model
//     (c) simonfan
//     improved-model is licensed under the MIT terms.

/**
 * AMD and CJS module.
 *
 * @module improved-model
 */

/* jshint ignore:start */

/* jshint ignore:end */

define('improved-model',['require','exports','module','lowercase-backbone','lodash','./__improved-model/swtch','./__improved-model/virtual'],function (require, exports, module) {
	


	var backbone = require('lowercase-backbone'),
		_        = require('lodash');

	// direct reference to the backbone.model initialization logic
	var _initializeModel = backbone.model.prototype.initialize;


	// options that should be set directly to the object.
	var improvedModelOptions = ['cases', 'executionType'];

	var model = module.exports = backbone.model.extend({

		/**
		 * Overrride default model initialization.
		 *
		 * @param  {[type]} attributes [description]
		 * @param  {[type]} options    [description]
		 * @return {[type]}            [description]
		 */
		initialize: function initializeImprovedModel(attributes, options) {

			// initialize the backbone model
			_initializeModel.apply(this, arguments);

			// get options
			options = options || {};
			_.each(improvedModelOptions, function (opt) {

				this[opt] = options[opt] || this[opt];

			}, this);

			// create the main swtch
			this.mainSwtch = this.swtch(this.cases);


			// initialize virtuals
			this.virtual(this.virtualAttributes);
		},

		/**
		 * Hash holding the virtual attribute definitions.
		 *
		 * @type {Object}
		 */
		virtualAttributes: {},

		/**
		 * Determines which execution should be done (all|first)
		 *
		 * @type {String}
		 */
		executionType: 'all',
		cases: {},


		when: function whenThis(criteria, action, context) {
			this.mainSwtch.when(criteria, action, context);

			return this;
		}
	});

	model
		.assignProto(require('./__improved-model/swtch'))
		.assignProto(require('./__improved-model/virtual'));

	// define static methods
	model.assignStatic({

		/**
		 * Extends the currnet model and then sets the virtual attributes
		 * property on the prototype of the extended model constructor.
		 *
		 * @param  {[type]} virtuals [description]
		 * @return {[type]}          [description]
		 */
		extendVirtualAttributes: function extendVirtualAttributes(virtuals) {

			var extended = this.extend();

			extended.defineVirtualAttributes(virtuals);

			return extended;
		},

		/**
		 * Sets the virtualAttributes property on the prototype.
		 *
		 * @param  {[type]} virtuals [description]
		 * @return {[type]}          [description]
		 */
		defineVirtualAttributes: function defineVirtualAttributes(virtuals) {

			// set virtualAttributes property on the prototype.
			this.prototype.virtualAttributes = virtuals;

			return this;
		}
	});
});

