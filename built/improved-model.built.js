//     improved-model
//     (c) simonfan
//     improved-model is licensed under the MIT terms.

define("__improved-model/model-swtch/build-condition",["require","exports","module","object-query","lodash"],function(t,e,i){function r(t){var e=t.split(o),i=s.map(e,function(t){var e={};return s.each(t.split(a),function(t){var i=t.split(u),r=i[0],n=i[1].split(l);if(!i[1])throw new Error("No value found for "+r+" criterion.");e[r]=n.length>1?n:n[0]}),e});return i}var n=t("object-query"),s=t("lodash"),o=/\s*\|\|\s*/g,a=/\s*&&\s*/g,u=/\s*:\s*/g,l=/\s*\|\s*/g;i.exports=function(t,e){return s.isString(e)&&(e=r(e)),s.partial(n(e),t.attributes)}}),define("__improved-model/model-swtch/build-callback",["require","exports","module","lodash"],function(t,e,i){function r(t,e){t.set(e)}var n=t("lodash");i.exports=function(t,e){return n.isFunction(e)?n.partial(e,t):n.partial(r,t,e)}}),define("__improved-model/model-swtch/index",["require","exports","module","swtch","lodash","./build-condition","./build-callback"],function(t,e,i){{var r=t("swtch"),n=t("lodash"),s=t("./build-condition"),o=t("./build-callback"),a=r.prototype.initialize,u=r.prototype.when;i.exports=r.extend({initialize:function(t,e){this.model=e.model;var i;n.isArray(t)?i=t:(i=[],n.each(t,function(t,e){i.push({condition:e,value:t})})),a.call(this,i)},when:function(t,e){var i=n.toArray(arguments);if("default"!==t){var r=s(this.model,t),a=o(this.model,e);i=[r,a].concat(i.slice(2))}return u.apply(this,i)}})}}),define("__improved-model/swtch",["require","exports","module","./model-swtch/index"],function(t,e){var i=t("./model-swtch/index");e.initializeIMSwtch=function(){this.mainSwtch=this.swtch(this.cases)},e.swtch=function(t){var e=i(t,{model:this}),r="all"===this.executionType?e.exec:e.execFirst;return this.on("change",function(t){r.call(e,t.attributes)}),r.call(e,this.attributes),e}}),define("__improved-model/virtual/prototype",["require","exports","module","lodash"],function(t,e){function i(t){return t}function r(t,e,i,r){var n=s.map(i,t.get,t),o=r.apply(t,n);t.set(e,o)}function n(t,e,n,o){o=o||t[e]||i,n=s.isArray(n)?n:[n];var a=s.map(n,function(t){return"change:"+t}).join(" ");t.on(a,s.partial(r,t,e,n,o)),r(t,e,n,o)}var s=t("lodash");e._virtualAttributes={},e.initializeIMVirtual=function(){this.virtual(this._virtualAttributes)},e.defineVirtualAttribute=function(){if(s.isObject(arguments[0]))s.each(arguments[0],function(t,e){var i,r;s.isObject(t)?(i=t.src,r=t.processor):i=t,n(this,e,i,r)},this);else if(s.isString(arguments[0])){var t=s.toArray(arguments);t.unshift(this),n.apply(null,t)}return this},e.virtual=e.defineVirtualAttribute}),define("__improved-model/pipe",["require","exports","module","pipe","lodash"],function(t,e){var i=t("pipe"),r=t("lodash"),n=i.extend({get:function(t,e){return t.get(e)},set:function(t,e,i){return t.set(e,i)}});e.initializeIMPipe=function(){r.bindAll(this,["pump"]),this.pipes=[],this.on("change",this.pump)},e.pump=function(){return r.each(this.pipes,function(t){t.pump()}),this},e.pipe=function(t,e,i){if(r.isString(e)){var s=e;e={},e[s]=s}var o=n(this,t,e,i);return this.pipes.push(o),o}}),define("__improved-model/types/prototype",["require","exports","module","lodash","lowercase-backbone"],function(t,e){var i=t("lodash"),r=t("lowercase-backbone").model,n=e.types={};n.String=function(t){return""+t},n.Integer=function(t){return parseInt(t)},n.Int=n.Integer,n.Float=function(t){return parseFloat(t)},n.Array=function(t){return i.isArray(t)?t:[t]},n.Boolean=function(t){return t?!0:!1},e.attributeTypes={};var s=r.prototype.set;e.set=function(){if(i.isString(arguments[0])){var t=arguments[0],e=arguments[1],r=this.attributeTypes[t];return e=r?this.types[r].call(this,e):e,s.call(this,t,e,arguments[2])}var n=arguments[0],o=this.attributeTypes;return n=i.mapValues(arguments[0],function(t,e){var i=o[e];return i?this.types[i].call(this,t):t},this),s.call(this,n,arguments[1])},e.getAs=function(t,e){var i=this.get(e);return this.types[t].call(this,i)}}),define("__improved-model/virtual/static",["require","exports","module","lodash"],function(t,e){var i=t("lodash");e.defineVirtualAttribute=function(){return i.isObject(arguments[0])?i.assign(this.prototype._virtualAttributes,arguments[0]):this.prototype._virtualAttributes[arguments[0]]={src:arguments[1],processor:arguments[2]},this},e.extendVirtualAttributes=function(t){var e=i.create(this.prototype._virtualAttributes),r=this.extend({virtuals:e});return r.defineVirtualAttribute(t),r}}),define("__improved-model/types/static",["require","exports","module","lodash"],function(t,e){var i=t("lodash");e.type=function(){return i.isString(arguments[0])?this.prototype.types[arguments[0]]=arguments[1]:i.assign(this.prototype.types,arguments[0]),this},e.extendTypes=function(t){var e=i.create(this.prototype.types);return i.assign(e,t),this.extend({types:e})},e.attributeType=function(){return i.isString(arguments[0])?this.prototype.attributeTypes[arguments[0]]=arguments[1]:i.assign(this.prototype.attributeTypes,arguments[0]),this},e.extendAttributeTypes=function r(t){i.create(this.prototype.attributeTypes);return i.assign(r,t),this.extend({attributeTypes:r})}}),define("improved-model",["require","exports","module","lowercase-backbone","lodash","./__improved-model/swtch","./__improved-model/virtual/prototype","./__improved-model/pipe","./__improved-model/types/prototype","./__improved-model/virtual/static","./__improved-model/types/static"],function(t,e,i){var r=t("lowercase-backbone"),n=t("lodash"),s=r.model.prototype.initialize,o=["cases","executionType"],a=i.exports=r.model.extend({initialize:function(t,e){s.apply(this,arguments),e=e||{},n.each(o,function(t){this[t]=e[t]||this[t]},this),this.initializeIMSwtch(),this.initializeIMVirtual(),this.initializeIMPipe()},executionType:"all",cases:{},when:function(t,e,i){return this.mainSwtch.when(t,e,i),this}});a.assignProto(t("./__improved-model/swtch")).assignProto(t("./__improved-model/virtual/prototype")).assignProto(t("./__improved-model/pipe")).assignProto(t("./__improved-model/types/prototype")),a.assignStatic(t("./__improved-model/virtual/static")).assignStatic(t("./__improved-model/types/static"))});