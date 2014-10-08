var _ = $_ = require('lodash');
var async = $async = require("async");
var type = require("type-of");

// Example: ({}).$property("foo", "ewc", 123);
Object.defineProperty(Object.prototype, "$property", {
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
Object.prototype.$property("$getter", function(name, options, getter) {
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
Object.prototype.$property("$flatten", "w", function(delimiter) {
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
//gets a deep nested item.
//Example: console.log({foo:{bar:{baz:123}}}.$get('foo.bar.baz'));
Object.prototype.$property("$get", "w", function(path) {
  if(!path) return this;
  path = path.split('.');
  var current, val = this;
  while((current = path.shift()) && (val = val[current]));
  return (current===undefined && val) || undefined;
});
//sets a deep nested item.
//Example: console.log({}.$set('foo.bar.baz', 123));
Object.prototype.$property("$set", "w", function(path, value) {
  if(typeof path==="string"){
    path = path.split('.');
    var obj = this;
    var last = path.pop();

    path.forEach(function(prop) {
      if(!_.isPlainObject(obj[prop])) obj[prop] = {};
      obj = obj[prop];
    });
    obj[last] = value;
  }
  return this;
});

String.prototype.$property("$padStart", "w", function (resultLength,padChar) { if(this.length>=resultLength) return this.valueOf(); return (new Array(resultLength-this.length+1)).join(padChar||' ') + this });
String.prototype.$property("$padEnd", "w", function (resultLength,padChar) { if(this.length>=resultLength) return this.valueOf(); return this+(new Array(resultLength-this.length+1)).join(padChar||' ') });
String.prototype.$property("$endsWith", "w", function (A) { return this.substr(this.length - A.length) === A });
String.prototype.$property("$startsWith", "w", function (A) { return this.substr(0, A.length) === A });
String.prototype.$property("$isLongerThan", "w", function (l) { return this.length > l });
String.prototype.$property("$isShorterThan", "w", function (l) { return this.length < l});
String.prototype.$property("$lengthIsBetween", "w", function (min,max) { return this.length.isBetween(min, max); });
String.prototype.$property("$isEmail", "w", function isEmail() { return String.isEmail(this.valueOf()); });
String.prototype.$property("$remove", "w", function (value) { return this.replace(value, ""); });
String.prototype.$property("$in", "w", function (values) { return Array.prototype.some.call(Array.isArray(values)? values : arguments, function(i){ return this.valueOf()===i.toString(); }, this) });
String.prototype.$property("$mask", "w", function () { return this.length && JSON.parse('{"'+this.valueOf().replace(/,/g,'":1,"')+'":1}') || {}; });
Array.prototype.$property("$mask", "w", function () { var out={}; this.forEach(function(k){out[k]=1}); return out; });

String.$isEmail = function(str) {
  //I have no idea who deserves the credit for this RegExp.
  return /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/.test(str);
};



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
}
Date.prototype.$property("$midnight", "w", function(){ return Date.midnight(this); });
Date.prototype.$property("$midnightUTC", "w", function(){ return Date.midnightUTC(this); });
Date.prototype.$property("$addDays", "w", function(value){ this.setDate(this.getDate() + value); return this; });


Number.prototype.$property("$isBetween", "w", function (min,max) { return this >= min && this <= max; });

Object.$property("$type", "w", type);
Object.prototype.$getter("$json", function() { return JSON.stringify(this); });
Object.prototype.$getter("$json2", function() { return JSON.stringify(this, null, 2); });
Object.prototype.$getter("$type", function() { return Object.$type(this); });
Object.prototype.$getter("$signature", function() {
  return this.$isArguments && Array.prototype.map.call(this, Object.$type).join();
});


var slice = Array.prototype.slice;
function lodashify(destination, name) {
  var fn = _[name];
  destination.$property("$"+name, "w", function() {
    var args = slice.bind(arguments)();
    args.unshift(this);
    return fn.apply(_, args);
  });
}

[
  "compact","difference","drop","findIndex","findLastIndex","first",
  "flatten","head","indexOf","initial","intersection","last","lastIndexOf",
  "object","pull","remove","rest","sortedIndex","tail","take","union",
  "uniq","unique","unzip","without","xor","zip","zipObject"
]
  .forEach(function(name) {
    lodashify(Array.prototype, name)
  });


var collections = [
  "all","any","at","collect","contains","countBy","detect","eachRight",
  "every","find","findLast","findWhere","foldl","foldr","forEach",
  "forEachRight","groupBy","include","indexBy","inject","invoke","max",
  "min","pluck","sample","select","shuffle",
  "size","some","sortBy","toArray","where"
]
  .forEach(function(name) {
    lodashify(Array.prototype, name)
    lodashify(Object.prototype, name)
    lodashify(String.prototype, name)
  });


[
  "after","bind","bindAll","bindKey","compose","curry","debounce","defer",
  "delay","memoize","once","partial","partialRight","throttle","wrap"
]
  .forEach(function(name) {
    lodashify(Function.prototype, name)
  });

[
  "assign","clone","cloneDeep","create","defaults","extend","findKey",
  "findLastKey","forIn","forInRight","forOwn","forOwnRight","has",
  "mapValues","merge","methods","omit","pick","transform"
]
  .forEach(function(name) {
    lodashify(Object.prototype, name)
  });

[
  "isArguments","isArray","isBoolean","isDate","isElement","isEmpty","isFinite",
  "isFunction","isNaN","isNull","isNumber","isObject","isPlainObject","isRegExp",
  "isString","keys","values","pairs","invert","functions"
]
  .forEach(function(name) {
    var fn = _[name];
    Object.defineProperty(Object.prototype, "w", "$"+name, {
      get:function() {
        return fn(this);
      }
    });
  });


//asyncify
function asyncify(destination, name) {
  var fn = async[name];
  destination.$property("$"+name, "w", function() {
    var args = slice.bind(arguments)();
    args.unshift(this);
    return fn.apply(async, args);
  });
}

[
  "eachSeries","eachLimit","mapSeries","mapLimit","filterSeries","rejectSeries",
  "detectSeries","concat","concatSeries","waterfall","applyEach","applyEachSeries","iterator"
]
  .forEach(function(name) {
    asyncify(Array.prototype, name)
  });

[
  "series","parallel","parallelLimit"
]
  .forEach(function(name) {
    asyncify(Array.prototype, name)
    asyncify(Object.prototype, name)
  });

asyncify(Object.prototype, "auto");


//these have overlapping names- so they need special handling
// ASYNC                               LODASH
//  $each(arr, iterator, callback)      $each(collection, [callback=identity], [thisArg])
//  $map(arr, iterator, callback)       $map(collection, [callback=identity], [thisArg])
//  $filter(arr, iterator, callback)    $filter(collection, [callback=identity], [thisArg])
//  $reject(arr, iterator, callback)    $reject(collection, [callback=identity], [thisArg])
//  $detect(arr, iterator, callback)    $detect(collection, [callback=identity], [thisArg])
//  $sortBy(arr, iterator, callback)    $sortBy(collection, [callback=identity], [thisArg])
//  $some(arr, iterator, callback)      $some(collection, [callback=identity], [thisArg])
//  $every(arr, iterator, callback)     $every(collection, [callback=identity], [thisArg])

[
  "each","map","filter","reject"
]
  .forEach(function(name) {
    lodashify(Object.prototype, name);
    lodashify(String.prototype, name);

    Array.prototype.$property("$"+name, "w", function(a,b) {
      var args = slice.bind(arguments)();
      args.unshift(this);

      //check for ASYNC (iterator, callback) signature
      if(_.isFunction(a) && _.isFunction(b))
        return async[name].apply(async, args);

      return _[name].apply(_, args);
    });
  });

//$$reduce(arr, memo, iterator, callback)         (collection, [callback=identity], [accumulator], [thisArg])
//$$reduceRight(arr, memo, iterator, callback)    (collection, [callback=identity], [accumulator], [thisArg])
[
  "reduce","reduceRight"
]
  .forEach(function(name) {
    lodashify(Object.prototype, name);
    lodashify(String.prototype, name);

    Array.prototype.$property("$"+name, "w", function(memo,a,b) {
      var args = slice.bind(arguments)();
      args.unshift(this);

      //check for ASYNC (iterator, callback) signature
      if(_.isFunction(a) && _.isFunction(b))
        return async[name].apply(async, args);

      return _[name].apply(_, args);
    });
  });


