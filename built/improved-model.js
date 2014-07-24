//     pipe
//     (c) simonfan
//     pipe is licensed under the MIT terms.

//     improved-model
//     (c) simonfan
//     improved-model is licensed under the MIT terms.

define("__improved-model/model-swtch/build-condition",["require","exports","module","object-query","lodash"],function(t,e,i){function r(t){var e=t.split(o),i=n.map(e,function(t){var e={};return n.each(t.split(a),function(t){var i=t.split(u),r=i[0],s=i[1].split(c);if(!i[1])throw new Error("No value found for "+r+" criterion.");e[r]=s.length>1?s:s[0]}),e});return i}var s=t("object-query"),n=t("lodash"),o=/\s*\|\|\s*/g,a=/\s*&&\s*/g,u=/\s*:\s*/g,c=/\s*\|\s*/g;i.exports=function(t,e){return n.isString(e)&&(e=r(e)),n.partial(s(e),t.attributes)}}),define("__improved-model/model-swtch/build-callback",["require","exports","module","lodash"],function(t,e,i){function r(t,e){t.set(e)}var s=t("lodash");i.exports=function(t,e){return s.isFunction(e)?s.partial(e,t):s.partial(r,t,e)}}),define("__improved-model/model-swtch/index",["require","exports","module","swtch","lodash","./build-condition","./build-callback"],function(t,e,i){{var r=t("swtch"),s=t("lodash"),n=t("./build-condition"),o=t("./build-callback"),a=r.prototype.initialize,u=r.prototype.when;i.exports=r.extend({initialize:function(t,e){this.model=e.model;var i;s.isArray(t)?i=t:(i=[],s.each(t,function(t,e){i.push({condition:e,value:t})})),a.call(this,i)},when:function(t,e){var i=s.toArray(arguments);if("default"!==t){var r=n(this.model,t),a=o(this.model,e);i=[r,a].concat(i.slice(2))}return u.apply(this,i)}})}}),define("__improved-model/swtch",["require","exports","module","./model-swtch/index"],function(t,e){var i=t("./model-swtch/index");e.initializeIMSwtch=function(){this.mainSwtch=this.swtch(this.cases)},e.swtch=function(t){var e=i(t,{model:this}),r="all"===this.executionType?e.exec:e.execFirst;return this.on("change",function(t){r.call(e,t.attributes)}),r.call(e,this.attributes),e}}),define("__improved-model/virtual/prototype",["require","exports","module","lodash"],function(t,e){function i(t){return t}function r(t,e,i,r){var s=n.map(i,t.get,t),o=r.apply(t,s);t.set(e,o)}function s(t,e,s,o){o=o||t[e]||i,s=n.isArray(s)?s:[s];var a=n.map(s,function(t){return"change:"+t}).join(" ");t.on(a,n.partial(r,t,e,s,o)),r(t,e,s,o)}var n=t("lodash");e._virtualAttributes={},e.initializeIMVirtual=function(){this.virtual(this._virtualAttributes)},e.defineVirtualAttribute=function(){if(n.isObject(arguments[0]))n.each(arguments[0],function(t,e){var i,r;n.isObject(t)?(i=t.src,r=t.processor):i=t,s(this,e,i,r)},this);else if(n.isString(arguments[0])){var t=n.toArray(arguments);t.unshift(this),s.apply(null,t)}return this},e.virtual=e.defineVirtualAttribute}),define("__pipe/pump",["require","exports","module","lodash"],function(t,e){var i=t("lodash");e.pump=function(t,e){var r=this.maps.to,s=this.src,n=this.dest;t=t?i.pick(r,t):r;var o=e&&e.force;i.each(t,function(t,e){var r=this.srcGet(s,e);i.each(t,function(t){(o||!this.cacheCheck(e,r))&&this.destSet(n,t,r)},this)},this)}}),define("__pipe/drain",["require","exports","module","lodash"],function(t,e){var i=t("lodash");e.drain=function(){var t,e,r=arguments[0],s=arguments[1],n=this.maps.from;i.isArray(r)?(t=i.pick(n,r),e=s):i.isString(r)?(t={},t[r]=n[r],e=s):(t=n,e=r),e=e||{};var o=e.force;return this.src,this.dest,i.each(t,function(t,e){var i=this.destGet(this.dest,t[0]);(o||!this.cacheCheck(e,i))&&this.srcSet(this.src,e,i)},this),this}}),define("__pipe/inject",["require","exports","module","lodash"],function(t,e){var i=t("lodash");e.inject=function(t,e){if(!this.src)throw new Error("No src for pipe");i.each(t,function(t,i){(!this.cacheCheck(i,t)||e&&e.force)&&this.srcSet(this.src,i,t)},this),this.pump(null,{force:!0})}}),define("__pipe/map",["require","exports","module","lodash"],function(t,e){var i=t("lodash");e.mapSingle=function(t,e,r){e=i.isArray(e)?e:[e],r&&"both"!==r?this.maps[r][t]=e:(this.maps.to[t]=e,this.maps.from[t]=e)},e.map=function(){if(i.isString(arguments[0]))this.mapSingle.apply(this,arguments);else if(i.isObject(arguments[0])){var t=arguments[1];i.each(arguments[0],function(e,r){var s;i.isString(e)?s=e:(s=e.dest,t=e.direction||t),this.mapSingle(r,s,t)},this)}return this},e.unmap=function(t){return i.each(this.maps,function(e){delete e[t]}),this}}),define("__pipe/cache",["require","exports","module"],function(t,e){e.cacheClear=function(){return this.cache={},this},e.cacheCheck=function(t,e){return this.cache?this.cache[t]!==e?(this.cache[t]=e,!1):!0:!1}}),define("pipe",["require","exports","module","subject","lodash","./__pipe/pump","./__pipe/drain","./__pipe/inject","./__pipe/map","./__pipe/cache"],function(t,e,i){var r=t("subject"),s=(t("lodash"),i.exports=r({initialize:function(t,e,i,r){r=r||{},this.srcGet=this.srcGet||this.get,this.srcSet=this.srcSet||this.set,this.destGet=this.destGet||this.get,this.destSet=this.destSet||this.set,r.cache!==!1&&this.cacheClear(),this.maps={from:{},to:{}},t&&this.from(t),e&&this.to(e),i&&this.map(i,r.direction)},get:function(t,e){return t[e]},set:function(t,e,i){return t[e]=i,t},from:function(t){return this.cacheClear(),this.src=t,this},to:function(t){return this.cacheClear(),this.dest=t,this}}));s.assignProto(t("./__pipe/pump")).assignProto(t("./__pipe/drain")).assignProto(t("./__pipe/inject")).assignProto(t("./__pipe/map")).assignProto(t("./__pipe/cache"))}),define("__improved-model/pipe",["require","exports","module","pipe","lodash"],function(t,e){var i=t("pipe"),r=t("lodash"),s=i.extend({get:function(t,e){return t.get(e)},set:function(t,e,i){return t.set(e,i)}});e.initializeIMPipe=function(){r.bindAll(this,["pump"]),this.pipes=[],this.on("change",this.pump)},e.pump=function(){return r.each(this.pipes,function(t){t.pump()}),this},e.pipe=function(t,e,i){if(r.isString(e)){var n=e;e={},e[n]=n}var o=s(this,t,e,i);return this.pipes.push(o),o}}),define("__improved-model/types/prototype",["require","exports","module","lodash","lowercase-backbone"],function(t,e){var i=t("lodash"),r=t("lowercase-backbone").model,s=e.types={};s.String=function(t){return""+t},s.Integer=function(t){return parseInt(t)},s.Int=s.Integer,s.Float=function(t){return parseFloat(t)},s.Array=function(t){return i.isArray(t)?t:[t]},s.Boolean=function(t){return t?!0:!1},e.attributeTypes={};var n=r.prototype.set;e.set=function(){if(i.isString(arguments[0])){var t=arguments[0],e=arguments[1],r=this.attributeTypes[t];return e=r?this.types[r].call(this,e):e,n.call(this,t,e,arguments[2])}var s=arguments[0],o=this.attributeTypes;return s=i.mapValues(arguments[0],function(t,e){var i=o[e];return i?this.types[i].call(this,t):t},this),n.call(this,s,arguments[1])},e.getAs=function(t,e){var i=this.get(e);return this.types[t].call(this,i)}}),define("__improved-model/virtual/static",["require","exports","module","lodash"],function(t,e){var i=t("lodash");e.defineVirtualAttribute=function(){return i.isObject(arguments[0])?i.assign(this.prototype._virtualAttributes,arguments[0]):this.prototype._virtualAttributes[arguments[0]]={src:arguments[1],processor:arguments[2]},this},e.extendVirtualAttributes=function(t){var e=i.create(this.prototype._virtualAttributes),r=this.extend({virtuals:e});return r.defineVirtualAttribute(t),r}}),define("__improved-model/types/static",["require","exports","module","lodash"],function(t,e){var i=t("lodash");e.type=function(){return i.isString(arguments[0])?this.prototype.types[arguments[0]]=arguments[1]:i.assign(this.prototype.types,arguments[0]),this},e.extendTypes=function(t){var e=i.create(this.prototype.types);return i.assign(e,t),this.extend({types:e})},e.attributeType=function(){return i.isString(arguments[0])?this.prototype.attributeTypes[arguments[0]]=arguments[1]:i.assign(this.prototype.attributeTypes,arguments[0]),this},e.extendAttributeTypes=function r(t){i.create(this.prototype.attributeTypes);return i.assign(r,t),this.extend({attributeTypes:r})}}),define("improved-model",["require","exports","module","lowercase-backbone","lodash","./__improved-model/swtch","./__improved-model/virtual/prototype","./__improved-model/pipe","./__improved-model/types/prototype","./__improved-model/virtual/static","./__improved-model/types/static"],function(t,e,i){var r=t("lowercase-backbone"),s=t("lodash"),n=r.model.prototype.initialize,o=["cases","executionType"],a=i.exports=r.model.extend({initialize:function(t,e){n.apply(this,arguments),e=e||{},s.each(o,function(t){this[t]=e[t]||this[t]},this),this.initializeIMSwtch(),this.initializeIMVirtual(),this.initializeIMPipe()},executionType:"all",cases:{},when:function(t,e,i){return this.mainSwtch.when(t,e,i),this}});a.assignProto(t("./__improved-model/swtch")).assignProto(t("./__improved-model/virtual/prototype")).assignProto(t("./__improved-model/pipe")).assignProto(t("./__improved-model/types/prototype")),a.assignStatic(t("./__improved-model/virtual/static")).assignStatic(t("./__improved-model/types/static"))});