//     swtch
//     (c) simonfan
//     swtch is licensed under the MIT terms.

/**
 * AMD and CJS module.
 *
 * @module swtch
 */

/* jshint ignore:start */

/* jshint ignore:end */

define('__swtch/evaluate',['require','exports','module','lodash'],function (require, exports, module) {


	var _ = require('lodash');

	/**
	 * Finds the default case.
	 *
	 * @return {[type]} [description]
	 */
	function findDefault() {

		return _.find(this.cases, function (c_se) {
			return c_se.condition === 'default';
		});
	}


	/**
	 * Find the first case that matches the query.
	 *
	 * @param  {[type]} query [description]
	 * @return {[type]}       [description]
	 */
	exports.first = function first(query) {
		var matchedCase = _.find(this.cases, function (c_se) {
			return this.match(c_se.condition, query);
		}, this);


		// if no match is found,
		// return the default case
		matchedCase = matchedCase || findDefault.call(this);

		// if no default case was defined, simply return null.

		return matchedCase;
	};

	/**
	 * Find all cases that match a given query.
	 *
	 * @param  {[type]} query [description]
	 * @return {[type]}       [description]
	 */
	exports.all = function all(query) {

		var matchedCases = _.filter(this.cases, function (c_se) {
			return this.match(c_se.condition, query);
		}, this);

		// if matchedCases array is empty, add the default to it
		// if a default case was defined.
		if (matchedCases.length === 0) {

			var df = findDefault.call(this);

			if (df) {
				matchedCases.push(df);
			}
		}

		return matchedCases;
	};
});

//     swtch
//     (c) simonfan
//     swtch is licensed under the MIT terms.

/**
 * AMD and CJS module.
 *
 * @module swtch
 */

/* jshint ignore:start */

/* jshint ignore:end */

define('__swtch/exec',['require','exports','module','lodash'],function (require, exports, module) {


	var _ = require('lodash');

	/**
	 * Executes the first c_se found.
	 * Remember: the cases are stored in an array
	 * by order of addition. Thus, cases added first will have
	 * priority over those added later.
	 *
	 * @param  {[type]} query [description]
	 * @return {[type]}       [description]
	 */
	exports.execFirst = function execFirst(query) {

		var matchedCase = this.first(query);

		if (matchedCase) {
			return this.execCase(matchedCase, query);
		}
	};

	/**
	 * Executes all cases that match the value, in the order they were added.
	 *
	 * @param  {[type]} query [description]
	 * @return {[type]}       [description]
	 */
	exports.exec = function exec(query) {
		var matchedCases = this.all(query);

		return _.map(matchedCases, function (c, index) {
			return this.execCase(c, query);
		}, this);
	};

	/**
	 * Invokes the case's value when exec is invoked.
	 * Takes the case itself as first argument and
	 * the value with which 'exec' was invoked with as second.
	 *
	 * @param  {[type]} c_se  [description]
	 * @param  {[type]} value [description]
	 * @return {[type]}       [description]
	 */
	exports.execCase = function execCase(c_se, query) {
		return c_se.value.call(c_se.context);
	};
});

//     swtch
//     (c) simonfan
//     swtch is licensed under the MIT terms.

/**
 * AMD and CJS module.
 *
 * @module swtch
 */

/* jshint ignore:start */

/* jshint ignore:end */

define('swtch',['require','exports','module','lodash','subject','./__swtch/evaluate','./__swtch/exec'],function (require, exports, module) {


	var _       = require('lodash'),
		subject = require('subject');

	var swtch = module.exports = subject({

		/**
		 * Basically creates the c_se array and
		 * adds cases if passed an array of cases
		 * at start.
		 *
		 * @param  {[type]} cases [description]
		 * @return {[type]}            [description]
		 */
		initialize: function initializeSwtch(cases) {


			this.cases = [];

			_.each(cases, function (c) {

				this.when(c.condition, c.value);

			}, this);
		},

		/**
		 * Checks if a case is valid query the
		 * @param  {[type]} c_se    [description]
		 * @param  {[type]} query [description]
		 * @return {[type]}         [description]
		 */
		match: function match(condition, query) {

			if (_.isRegExp(condition)) {

				return condition.test(query);

			} else if (_.isFunction(condition)) {

				return condition(query);

			} else {
				// (_.isString(condition) || _.isNumber(condition) || _.isBoolean(condition))

				return condition === query;
			}
		},

		/**
		 * Defines a case.
		 *
		 * @return {[type]} [description]
		 */
		when: function when() {

			// parse out arguments
			var c_se;

			if (arguments.length === 1 && _.isObject(arguments[0])) {
				// arguments = [case]
				c_se = arguments[0];
			} else {
				// arguments = [condition, value, context]
				c_se = {
					condition: arguments[0],
					value    : arguments[1],
					context  : arguments[2]
				};
			}

			// push case to the cases array
			this.cases.push(c_se);

			return this;
		},

		/**
		 * Defines the default value. To be used when no
		 * other case is matched.
		 *
		 * @param  {[type]} value [description]
		 * @return {[type]}       [description]
		 */
		d_fault: function d_fault(value, context) {

			this.when('default', value, context);

			return this;
		},
	});

	swtch
		.assignProto(require('./__swtch/evaluate'))
		.assignProto(require('./__swtch/exec'));
});


//     Iterator
//     (c) simonfan
//     Iterator is licensed under the MIT terms.

define("iterator/base",["subject","lodash"],function(t,r){var e=t({initialize:function(t,r){this.data=t,r=r||{},this.currentIndex=r.startAt||-1,this.options=r,this.evaluate=r.evaluate||r.evaluator||this.evaluate},move:function(t){return this.index(this.currentIndex+t),this},evaluate:function(t){return t},evaluator:function(t){return this.evaluate=t,this},start:function(){return this.currentIndex=-1,this},end:function(){return this.currentIndex=this.length(),this},index:function(t){if(t>this.length()-1||0>t)throw new Error("No such index "+t);return this.currentIndex=t,this},countBefore:function(){return this.currentIndex+1},countAfter:function(){return this.length()-(this.currentIndex+1)},range:function(t,r){for(var e=[];r>=t;)e.push(this.at(t)),t++;return e},hasNext:function(){return this.currentIndex<this.length()-1},next:function(){return this.move(1),this.current()},nextN:function(t){for(var r=[],e=this.currentIndex+t-1;this.hasNext()&&this.currentIndex<=e;)r.push(this.next());return r},hasPrevious:function(){return this.currentIndex>0},previous:function(){return this.move(-1),this.current()},previousN:function(t){for(var r=[],e=this.currentIndex-t+1;this.hasPrevious()&&this.currentIndex>=e;)r.push(this.previous());return r},current:function(){return this.at(this.currentIndex)},value:function(){return this.data}});e.proto({hasPrev:e.prototype.hasPrevious,prev:e.prototype.previous,prevN:e.prototype.previousN});var n=["map","filter","compact","difference"];return r.each(n,function(t){e.proto(t,function(){var e=r(this.data);e=e[t].apply(e,arguments);var n=this.constructor(e.value());return n})}),e}),define("iterator/array",["require","exports","module","./base","lodash"],function(t){var r=t("./base"),e=t("lodash"),n=r.extend({at:function(t){return this.evaluate(this.data[t],t)},length:function(){return this.data.length}}),i=["push","reverse","shift","sort","splice","unshift"];return e.each(i,function(t){n.proto(t,function(){return this.data[t].apply(this.data,arguments),this})}),e.each(["concat","slice"],function(t){n.proto(t,function(){var r=this.data[t].apply(this.data,arguments);return this.constructor(r)})}),n}),define("iterator/object",["require","exports","module","./base","lodash"],function(t){var r=t("./base"),e=t("lodash"),n=r.extend({initialize:function(t,n){n=n||{},r.prototype.initialize.apply(this,arguments),this.order=n.order||e.keys(t)},keyAt:function(t){return this.order[t]},at:function(t){var r=this.keyAt(t),e=this.data[r];return this.evaluate(e,r)},length:function(){return this.order.length},nextKey:function(){return this.keyAt(this.currentIndex+1)},currentKey:function(){return this.keyAt(this.currentIndex)},previousKey:function(){return this.keyAt(this.currentIndex-1)},map:function(t){var r={};return e.each(this.order,function(e,n){r[e]=t(this.data[e],e,n)}.bind(this)),this.constructor(r)}});return n.proto("constructor",n),n}),define("itr",["require","exports","module","./iterator/array","./iterator/object","lodash"],function(t){var r=t("./iterator/array"),e=t("./iterator/object"),n=t("lodash"),i=function(t){var i;return n.isArray(t)?i=r:n.isObject(t)&&(i=e),i.apply(this,arguments)};return i.object=e,i.array=r,i});
//     Deep
//     (c) simonfan
//     Deep is licensed under the MIT terms.

define("__deep__/keys",["require","exports","module"],function(){return function(e){return e.replace(/\[(["']?)([^\1]+?)\1?\]/g,".$2").replace(/^\./,"").split(".")}}),define("__deep__/walker",["require","exports","module","lodash","itr","./keys"],function(e,r,t){var n=e("lodash"),i=e("itr"),s=e("./keys"),u=i.object.extend({nextStep:function(){var e=new RegExp("^"+this.currentKey()+"\\.");return this.nextKey().replace(e,"")},currentStep:function(){var e=new RegExp("^"+this.previousKey()+"\\.");return this.currentKey().replace(e,"")},previousStep:function(){var e=this.previousKey()||"";return n.last(e.split("."))},remainingSteps:function(){var e=new RegExp("^"+this.currentKey()+"\\.");return this.destination().replace(e,"")},destination:function(){return n.last(this.order)}});t.exports=function(e,r){r=n.isArray(r)?r:s(r);var t={"":e},i=[""];return n.every(r,function(s,u){var o=n.first(r,u+1).join(".");return i.push(o),e=e[s],t[o]=e,!n.isUndefined(e)}),u(t,{order:i})}}),define("__deep__/getset",["require","exports","module","lodash","./keys"],function(e,r){var t=e("lodash"),n=e("./keys");r.get=function(e,r){return r=t.isArray(r)?r:n(r),t.reduce(r,function(e,r){return e[r]},e)},r.set=function(e,i,s){i=t.isArray(i)?i:n(i);var u=i.pop();e=r.get(e,i),e[u]=s}}),define("deep",["require","exports","module","lodash","./__deep__/keys","./__deep__/walker","./__deep__/getset"],function(e){var r=e("lodash"),t={};return t.parseKeys=e("./__deep__/keys"),t.walker=e("./__deep__/walker"),r.extend(t,e("./__deep__/getset")),t});
//     Containers
//     (c) simonfan
//     Containers is licensed under the MIT terms.

define("containers",["lodash"],function(){function n(n,i){return _.all(i,function(i){return _.contains(n,i)})}function i(n,i){return _.any(i,function(i){return _.contains(n,i)})}function t(n,i){return n[0]<i&&i<n[1]}function r(n,i){return n[0]<=i&&i<=n[1]}function u(n,i,u){var e=u?t:r;return e=_.partial(e,n),_.isArray(i)?_.every(i,e):e(i)}return{containsAll:n,containsAny:i,exclusiveWithin:t,inclusiveWithin:r,within:u}});
//     ObjectMatcher
//     (c) simonfan
//     ObjectMatcher is licensed under the MIT terms.

define("__object-query__/operators/match",["require","exports","module","lodash"],function(e,n){var r=e("lodash");n.$matchSingle=function(e,n){return r.isRegExp(e)?e.test(n):e===n},n.$match=function(e,t){return r.isArray(t)?r.any(t,function(r){return n.$matchSingle(e,r)}):n.$matchSingle(e,t)}}),define("__object-query__/operators/range",["require","exports","module"],function(e,n){n.$lt=function(e,n){return e>n},n.$lte=function(e,n){return e>=n},n.$gt=function(e,n){return n>e},n.$gte=function(e,n){return n>=e}}),define("__object-query__/operators/set",["require","exports","module","lodash","containers"],function(e,n){var r=e("lodash"),t=e("containers");n.$in=function(e,n){return r.isArray(n)?t.containsAny(e,n):r.contains(e,n)},n.$nin=function(e,n){return r.isArray(n)?!t.containsAny(e,n):!r.contains(e,n)},n.$all=function(e,n){return t.containsAll(n,e)}}),define("__object-query__/operators/boolean",["require","exports","module"],function(e,n){n.$e=function(){},n.$ne=function(){},n.$not=function(){},n.$or=function(){},n.$and=function(){},n.$exists=function(){}}),define("__object-query__/operators/index",["require","exports","module","lodash","deep","containers","./match","./range","./set","./boolean"],function(e,n){var r=e("lodash");e("deep"),e("containers"),r.extend(n,e("./match"),e("./range"),e("./set"),e("./boolean")),n.evaluateValue=function(e,t){return r.isObject(e)&&!r.isRegExp(e)?r.every(e,function(e,r){var o=n[r];if(o)return o(e,t);throw new Error("The operator "+r+" is not supported by object-query.")}):n.$match(e,t)}}),define("__object-query__/match",["require","exports","module","lodash","deep","./operators/index"],function(e,n,r){var t=e("lodash"),o=e("deep"),i=e("./operators/index"),u=/[0-9]+/,a=function(e,n,r){return t.any(n,function(n){return c(e,n,r)})},c=r.exports=function(e,n,r){for(var c,s=o.walker(n,r);s.hasNext();){var f=s.next();{if(!s.hasNext()){c=i.evaluateValue(e,f);break}if(t.isArray(f)&&!u.test(s.nextStep())){c=a(e,f,s.remainingSteps());break}}}return c}}),define("__object-query__/find",["require","exports","module","lodash","deep","./operators/index"],function(e,n,r){var t=e("lodash"),o=e("deep"),i=e("./operators/index"),u=/[0-9]+/,a=function(e,n,r){return t.any(n,function(n){return c(e,n,r)})},c=r.exports=function(e,n,r){for(var c,s=o.walker(n,r);s.hasNext();){var f=s.next();{if(!s.hasNext()){c=i.evaluateValue(e,f);break}if(t.isArray(f)&&!u.test(s.nextStep())){c=a(e,f,s.remainingSteps());break}}}return c}}),define("object-query",["require","exports","module","lodash","./__object-query__/match","./__object-query__/find"],function(e){function n(e,n){return t.every(e,function(e,r){return o(e,n,r)})}function r(e,r){return t.isArray(e)?t.any(e,function(e){return n(e,r)}):n(e,r)}var t=e("lodash"),o=e("./__object-query__/match");e("./__object-query__/find");var i=function(e){return e=e||{},t.partial(r,e)},u=["every","all","some","any","filter","find","reject"];return t.each(u,function(e){i[e]=function(n,r){return t[e](n,i(r))}}),i});
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

	/**
	 * Sets a swtch onto another model.
	 *
	 * @param  {[type]} other [description]
	 * @param  {[type]} cases [description]
	 * @return {[type]}       [description]
	 */
	exports.swtchOther = function defineSwtchOther(other, cases) {

		// instantiate the mswtch
		var mswtch = modelSwtch(cases, { model: other });

		// get execution method
		var _exec = this.executionType === 'all' ? mswtch.exec : mswtch.execFirst;

		// set event listeners.
		this.listenTo(other, 'change', function (model) {
			_exec.call(mswtch, model.attributes);
		});

		// exec once
		_exec.call(mswtch, other.attributes);

		return mswtch;
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

define('improved-model',['require','exports','module','lowercase-backbone','lodash','./__improved-model/swtch'],function (require, exports, module) {
	


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
		},

		/**
		 * Determines which execution should be done (all|first)
		 *
		 * @type {String}
		 */
		executionType: 'all',
		cases: {},


		when: function whenThis(criteria, callback, context) {
			this.mainSwtch.when(criteria, callback, context);

			return this;
		},

		whenOther: function whenOther(other, criteria, callback, context) {

			// create a swtch
			var mswtch = this.swtchOther(other);

			mswtch.when(criteria, callback, context);

			return this;
		}

	});

	model.assignProto(require('./__improved-model/swtch'));
});

