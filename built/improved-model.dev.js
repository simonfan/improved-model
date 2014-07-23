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

				var key   = split[0],
					value = split[1].split(pipe);

				if (!split[1]) {
					throw new Error('No value found for ' + key + ' criterion.');
				}

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


	exports.initializeIMSwtch = function initializeIMSwtch() {
		// create the main swtch
		this.mainSwtch = this.swtch(this.cases);
	};


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

define('__improved-model/virtual/prototype',['require','exports','module','lodash'],function defBindAttribute(require, exports, module) {
	

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
		processor = processor || model[dest] || _echo;

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

//     pipe
//     (c) simonfan
//     pipe is licensed under the MIT terms.

define("__pipe/pump",["require","exports","module","lodash"],function(t,i){var e=t("lodash");i.pump=function(t,i){var s=this.maps.to,r=this.src,h=this.dest;t=t?e.pick(s,t):s;var n=i&&i.force;e.each(t,function(t,i){var s=this.srcGet(r,i);e.each(t,function(t){(n||!this.cacheCheck(i,s))&&this.destSet(h,t,s)},this)},this)}}),define("__pipe/drain",["require","exports","module","lodash"],function(t,i){var e=t("lodash");i.drain=function(){var t,i,s=arguments[0],r=arguments[1],h=this.maps.from;e.isArray(s)?(t=e.pick(h,s),i=r):e.isString(s)?(t={},t[s]=h[s],i=r):(t=h,i=s),i=i||{};{var n=i.force;this.src,this.dest}return e.each(t,function(t,i){var e=this.destGet(this.dest,t[0]);(n||!this.cacheCheck(i,e))&&this.srcSet(this.src,i,e)},this),this}}),define("__pipe/inject",["require","exports","module","lodash"],function(t,i){var e=t("lodash");i.inject=function(t,i){if(!this.src)throw new Error("No src for pipe");e.each(t,function(t,e){(!this.cacheCheck(e,t)||i&&i.force)&&this.srcSet(this.src,e,t)},this),this.pump(null,{force:!0})}}),define("__pipe/map",["require","exports","module","lodash"],function(t,i){var e=t("lodash");i.mapSingle=function(t,i,s){i=e.isArray(i)?i:[i],s&&"both"!==s?this.maps[s][t]=i:(this.maps.to[t]=i,this.maps.from[t]=i)},i.map=function(){if(e.isString(arguments[0]))this.mapSingle.apply(this,arguments);else if(e.isObject(arguments[0])){var t=arguments[1];e.each(arguments[0],function(i,s){var r;e.isString(i)?r=i:(r=i.dest,t=i.direction||t),this.mapSingle(s,r,t)},this)}return this},i.unmap=function(t){return e.each(this.maps,function(i){delete i[t]}),this}}),define("__pipe/cache",["require","exports","module"],function(t,i){i.cacheClear=function(){return this.cache={},this},i.cacheCheck=function(t,i){return this.cache?this.cache[t]!==i?(this.cache[t]=i,!1):!0:!1}}),define("pipe",["require","exports","module","subject","lodash","./__pipe/pump","./__pipe/drain","./__pipe/inject","./__pipe/map","./__pipe/cache"],function(t,i,e){var s=t("subject"),r=(t("lodash"),e.exports=s({initialize:function(t,i,e,s){s=s||{},this.srcGet=this.srcGet||this.get,this.srcSet=this.srcSet||this.set,this.destGet=this.destGet||this.get,this.destSet=this.destSet||this.set,s.cache!==!1&&this.cacheClear(),this.maps={from:{},to:{}},t&&this.from(t),i&&this.to(i),e&&this.map(e,s.direction)},get:function(t,i){return t[i]},set:function(t,i,e){return t[i]=e,t},from:function(t){return this.cacheClear(),this.src=t,this},to:function(t){return this.cacheClear(),this.dest=t,this}}));r.assignProto(t("./__pipe/pump")).assignProto(t("./__pipe/drain")).assignProto(t("./__pipe/inject")).assignProto(t("./__pipe/map")).assignProto(t("./__pipe/cache"))});
/* jshint ignore:start */

/* jshint ignore:end */

define('__improved-model/pipe',['require','exports','module','pipe','lodash'],function defModelPump(require, exports, module) {
	

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

/* jshint ignore:start */

/* jshint ignore:end */

define('__improved-model/virtual/static',['require','exports','module','lodash'],function defBindAttribute(require, exports, module) {
	

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

define('improved-model',['require','exports','module','lowercase-backbone','lodash','./__improved-model/swtch','./__improved-model/virtual/prototype','./__improved-model/pipe','./__improved-model/virtual/static'],function (require, exports, module) {
	


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

			// INITIALIZATION.
			this.initializeIMSwtch();

			this.initializeIMVirtual();

			this.initializeIMPipe();
		},

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
		.assignProto(require('./__improved-model/virtual/prototype'))
		.assignProto(require('./__improved-model/pipe'));

	// define static methods
	model.assignStatic(require('./__improved-model/virtual/static'));
});

