Javascript prototype extensions
===============================

The power of [lodash](http://lodash.com/), [component-type](https://www.npmjs.org/package/component-type) and 
couple other useful helpers conveniently **placed on the prototypes** of the built in Javascript Objects.

To avoid collisions with other prototype augmentations you may have, `extensions` prefixes
everything with `$`. If `$` doesn't work for you, use the `EXTENSIONS_PREFIX` environment or GLOBAL variable 
to choose a different one!
<br>
<br>

### TLDR;
Most of [lodash](http://lodash.com/)'s function send the subject object as the first parameter so you just do this...

```
npm install extensions
```
... then write code
```javascript
require("extensions")

//write code
mything.$<lodash_fn>(...args)
```
<br>
<br>
<br>
Your object|array|string|function will get injected as the 1st parameter.

![Just swap the first argument!](http://williamkapke.github.io/extensions/extensions.gif)


<br>
<br>

#### Dear fearful ones...
Do not open an issue saying that augmenting prototypes is bad. I'm a big boy that
can ride my bike without training wheels now and I'm going to go have fun.

If something you read 10 years ago has still got you are scared of augmenting the
`prototype` of the `String`,`Object`,`Number`, and `Date` objects then do not use
this module.

Everything uses `Object.defineProperty` (introduced in ECMAScript 5) with
`enumerable:false`.

This is NOT a crazy big lib. Seriously- open `extensions.js` and see for yourself.
<br>
<br>


# lodash
As many of the [lodash](http://lodash.com/) functions have been made available as possible. For access to the entire [lodash](http://lodash.com/) framework, you can
use `GLOBAL.$_`.

For a full list, check out the source:<br>
https://github.com/williamkapke/extensions/blob/master/extensions.js
<br>
<br>



# Additional Extensions
## Object
### Object.prototype.$define(name, options, value)
Helper for `Object.defineProperty` to set a property value with configuration options.

```js
var x = {}.$define("foo", "ecw", 123);
console.log(x.foo);
```

#### options
A string of flags indicating which options you want enabled. Any options not found in the string are false.
*w* = writable
*e* = enumerable
*c* = configurable

#### value
The value you want the property set to.


### Object.prototype.$getter(name, options, getter)
Helper for `Object.defineProperty` to create a getter with configuration options.

```js
var x = {}.$getter("foo", "ec", function(){ return 123; });
console.log(x.foo);
```

#### options
A string of flags indicating which options you want enabled. Any options not found in the string are false.
*e* = enumerable
*c* = configurable

#### getter
The getter function for the property.



### $flatten([delimiter='.'])
Creates a flattened object by using dot notation (by default) properties on nested objects.

Specify the `delimiter` to use something other than a '.'

```js
console.log({foo:{bar:{baz:123}}}.$flatten());
// { 'foo.bar.baz': 123 }
```


### Object.$type(obj)
### Object.prototype.$type(obj)
See [type-of](https://www.npmjs.org/package/type-of)


### Object.prototype.$json
Shortcut for `JSON.stringify(obj)`
### Object.prototype.$json2
Shortcut for `JSON.stringify(obj, null, 2)`

### Object.prototype.$signature
Although this is on `Object.prototype`, it explicitly only works on an `arguments` Object.

```js
function fn(){
  return arguments.$signature
};

console.log( fn(1, true, function(){}) );
//number,boolean,function

console.log( fn("hello") );
//string

console.log( fn(/jazz/, new Date) );
//regexp,date
```

Use it like this:
```js
function connect(){
	switch(arguments.$signature){
		case "number,boolean,function":
			return foo.apply(this, arguments);
		case "string":
			return bar.apply(this, arguments);
		case "regexp,date":
			return baz.apply(this, arguments);
	}
}
```
<br>
<br>








## String

### String.prototype.$remove(string|regex)
This is an alias for:
```javascript
var x = "The Quick Brown".replace(value, '');
```

### String.prototype.$mask([delimiter=','])
Converts a delimited list of property names to a field mask. (Useful for mongo)
```js
console.log("foo,bar,baz".$mask())
// { foo: 1, bar: 1, baz: 1 }
```
<br>
<br>





## Array

### Array.prototype.$mask()
Converts an Array of property names to a field mask. (Useful for mongo)
```js
console.log(["foo","bar","baz"].$mask())
// { foo: 1, bar: 1, baz: 1 }
```
<br>
<br>




## Date

### Date.$midnight([date])
Returns a new `Date` object that is set to midnight of `date`.
`date` defaults to `new Date()` if not passed in.

### Date.prototype.$midnight()
Returns a new `Date` object that is set to midnight.

### Date.$midnightUTC([date])
### Date.prototype.$midnightUTC()
The usual UTC equivelants.

### Date.$nowISO()
A shortcut for `(new Date()).toISOString()`

### Date.prototype.$addDays(num)
Adds `num` days to the date.
<br>
<br>



## Number

### Number.prototype.$isBetween(min,max)
`min` and `max` are _inclusive_. Just like if you say "Pick a number between 1 and 100."
<br>
<br>



(un)license
===========

This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to [http://unlicense.org]
