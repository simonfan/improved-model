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

define('__improved-model/when/build-condition',['require','exports','module','object-query','lodash'],function (require, exports, module) {
	

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
	module.exports = function buildCondition(criteria) {
		if (_.isString(criteria)) {
			criteria = parseCriteriaStr(criteria);
		}

		return objectQuery(criteria);
	};
});

/* jshint ignore:start */

/* jshint ignore:end */

define('__improved-model/when/index',['require','exports','module','lodash','./build-condition'],function (require, exports, module) {
	

	var _ = require('lodash');

	var buildCondition = require('./build-condition');

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
		var condition = buildCondition(criteria);

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
		var condition = buildCondition(criteria);

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

define('improved-model',['require','exports','module','lowercase-backbone','./__improved-model/when/index'],function (require, exports, module) {
	


	var backbone = require('lowercase-backbone');


	var model = module.exports = backbone.model.extend({



	});

	model.assignProto(require('./__improved-model/when/index'));
});

