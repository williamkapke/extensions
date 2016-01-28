var _ = $_ = require('lodash');
var type = require("component-type");

// Example: ({}).$define("foo", "ewc", 123);
Object.defineProperty(Object.prototype, "$define", {
  value: function(name, options, value) {
    value = arguments[arguments.length-1];
    if(options===value) options = "";

    Object.defineProperty(this, name, {
      //true if and only if the value associated with the property may be changed with an assignment operator. Defaults to false.
      writable: !!~options.indexOf("w"),
      //true if and only if this property shows up during enumeration of the properties on the corresponding object. Defaults to false.
      enumerable: !!~options.indexOf("e"),
      //true if and only if the type of this property descriptor may be changed and if the property may be deleted from the corresponding object. Defaults to false.
      configurable: !!~options.indexOf("c"),
      value: value
    });
    return this;
  }
});
Object.prototype.$define("$getter", function(name, options, getter) {
  getter = arguments[arguments.length-1];
  if(options===getter) options = "";

  Object.defineProperty(this, name, {
    //true if and only if this property shows up during enumeration of the properties on the corresponding object. Defaults to false.
    enumerable: !!~options.indexOf("e"),
    //true if and only if the type of this property descriptor may be changed and if the property may be deleted from the corresponding object. Defaults to false.
    configurable: !!~options.indexOf("c"),
    get: getter
  });
  return this;
});

//Example: console.log({foo:{bar:{baz:123}}}.$flatten());

//Example: (filtering)...
// function f(path, key, value) { return key === "zzz"? false : "."; }
// console.log({foo:{bar:{baz:123},zzz:{asdf:123}}}.$flatten(f));
Object.prototype.$define("$flatten", "w", function(delimiter) {
  var filter, out = {};

  if(typeof delimiter === "function")
    filter = delimiter;
  else if(typeof delimiter === "string")
    filter = function(){ return delimiter };
  else
    filter = function(){ return '.' };

  function r(path, obj) {
    Object.keys(obj).forEach(function(key) {
      var val = obj[key];
      var delimiter = filter(path, key, val);
      if(delimiter===false) return;

      if (_.isPlainObject(val))
        return r((path && path+delimiter)+key, val);

      out[(path && path+delimiter)+key] = val;
    });
  }

  r("", this);
  return out;
});

String.prototype.$define("$remove", "w", function (value) { return this.replace(value, ""); });
String.prototype.$define("$mask", "w", function (d) { return this.split(d||',').$mask() });
Array.prototype.$define("$mask", "w", function () { var out={}; this.forEach(function(k){out[k]=1}); return out; });



Date.$midnight = function(date){
  date = date? new Date(date) : new Date;
  date.setHours(0,0,0,0);
  return date;
};
Date.$midnightUTC = function(date){
  if(!date) date = new Date;
  var val = date.valueOf();
  return val - (val % 86400000);
};
Date.$nowISO = function(){
  return (new Date()).toISOString();
};
Date.prototype.$define("$midnight", "w", function(){ return Date.$midnight(this); });
Date.prototype.$define("$midnightUTC", "w", function(){ return Date.$midnightUTC(this); });
Date.prototype.$define("$addDays", "w", function(value){ this.setDate(this.getDate() + value); return this; });


Number.prototype.$define("$isBetween", "w", function (min,max) { return this >= min && this <= max; });

Object.$define("$type", "w", type);
Object.prototype.$getter("$json", function() { return JSON.stringify(this); });
Object.prototype.$getter("$json2", function() { return JSON.stringify(this, null, 2); });
Object.prototype.$getter("$type", function() { return Object.$type(this); });
Object.prototype.$getter("$signature", function() {
  return this.$isArguments && Array.prototype.map.call(this, Object.$type).join();
});


////////////////////////////////////////////////////////////
//                                                        //
//                ADD LODASH TO PROTOTYPES                //
//                                                        //
////////////////////////////////////////////////////////////

var slice = Array.prototype.slice;
function lodashify(destination, name) {
  var fn = _[name];
  if(!fn) return;// console.log('skipped', name);//ignore features that do not exist in the installed version
  destination.$define("$"+name, "w", function() {
    var args = slice.bind(arguments)();
    args.unshift(this);
    return fn.apply(_, args);
  });
}

//Arrays
[
  "chunk","compact","difference","drop","dropRight","dropRightWhile","dropWhile",
  "fill","findIndex","findLastIndex","first","flatten","flattenDeep","head",
  "indexOf","initial","last","lastIndexOf","object","pull","pullAt","remove",
  "rest","slice","sortedIndex","sortedLastIndex","tail","take","takeRight",
  "takeRightWhile","takeWhile","uniq","unique","unzip","unzipWith","without",
  "zipObject","method","property","maxBy","minBy","keyBy","sortedIndexOf",
  "sortedLastIndexOf","sortedIndexBy","sortedLastIndexBy","sumBy","sortedUniq",
  "sortedUniqBy","uniqBy","mean","concat","differenceBy","differenceWith","uniqWith",
  "flatMap","join","pullAll","pullAllBy","reverse","matchesProperty"
]
.forEach(function(name) {
  lodashify(Array.prototype, name)
});


[
  //Collections
  "all","any","at","collect","map","contains","countBy",
  "detect","each","eachRight","every","filter",
  "find","findLast","findWhere","foldl","foldr","forEach",
  "forEachRight","groupBy","include","includes","indexBy","inject",
  "invoke","map","partition","pluck","reduce","reduceRight","reject",
  "sample","select","shuffle","size","some","sortBy","sortByAll",
  "sortByOrder","where","max","min","sum","invokeMap","orderBy",
  "sampleSize",

  //Objects
  "wrap","isEqual","isMatch","clone","cloneDeep","eq","gt","gte","lt","lte",
  "toArray","toPlainObject","assign","create","defaults","defaultsDeep",
  "extend","findKey","findLastKey","forIn","forInRight","forOwn","forOwnRight",
  "functions","get","has","invert","keys","keysIn","mapKeys","mapValues","merge",
  "methods","omit","pairs","pick","result","set","transform","values","valuesIn",
  "constant","identity","methodOf","propertyOf","toPairs","omitBy","pickBy",
  "isEqualWith","isMatchWith","cloneDeepWith","cloneWith","toInteger","toLength",
  "toNumber","toSafeInteger","toString","assignIn","assignInWith","assignWith",
  "extendWith","functionsIn","hasIn","mergeWith","setWith","toPairsIn","unset",
  "conforms","matches"
]
.forEach(function(name) {
  lodashify(Object.prototype, name);
});

// Object.is* getters
[
  "isArguments","isArray","isBoolean","isDate","isElement","isEmpty","isError",
  "isFinite","isFunction","isNaN","isNative","isNull","isNumber","isObject",
  "isPlainObject","isRegExp","isString","isTypedArray","isUndefined",
  "isArrayLike","isArrayLikeObject","isInteger","isLength","isNil","isObjectLike",
  "isSafeInteger","isSymbol"
]
.forEach(function(name) {
  var fn = _[name];
  if(!fn) return;//ignore features that do not exist in the installed version
  Object.defineProperty(Object.prototype, "$"+name, {
    get:function() {
      return fn(this);
    }
  });
});


//Functions
// excluding flow & backflow/compose/flowRight since their args do not work here.
[
  "after","before","bindAll","bindKey","ary","bind","curry","curryRight",
  "debounce","defer","delay","memoize","modArgs","negate","once","partial",
  "partialRight","rearg","restParam","spread","throttle","attempt","overArgs",
  "rest","flip","unary","iteratee"
]
.forEach(function(name) {
  lodashify(Function.prototype, name)
});

//Numbers
[
  "add","ceil","floor","round","inRange","random","times","clamp","subtract","nthArg"
]
.forEach(function(name) {
  lodashify(Number.prototype, name)
});


//Strings
[
  "camelCase","capitalize","deburr","endsWith","escape","escapeRegExp","kebabCase",
  "pad","padLeft","padRight","parseInt","repeat","snakeCase","startCase","startsWith",
  "template","trim","trimLeft","trimRight","trunc","unescape","words","method","property",
  "padStart","padEnd","trimStart","trimEnd","truncate","lowerCase","lowerFirst","replace",
  "split","toLower","toUpper","upperCase","upperFirst","matchesProperty","toPath"
]
.forEach(function(name) {
  lodashify(String.prototype, name)
});

