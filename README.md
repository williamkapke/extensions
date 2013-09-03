Javascript prototype extensions
===============================

Do not open an issue saying that augmenting prototypes is bad. I'm a big boy that
can ride my bike without training wheels now and I'm going to go have fun.

If something you read 10 years ago has still got you are scared of augmenting the
`prototype` of the `String`,`Object`,`Number`, and `Date` objects then do not use
this module.

Everything uses `Object.defineProperty` (introduced in ECMAScript 5) with
`enumerable:false`.

This is NOT a crazy big lib. Seriously- open `extensions.js` and see for yourself.

```
npm install extensions
```

FYI, the module does not exporting anything. It just needs to be `require`'d somewhere.
```javascript
//app.js

require("extensions")

```
<br>
<br>
<br>
<br>
# String
### String.prototype.padStart(length [,padchar])
### String.prototype.padEnd(length [,padchar])
Adds characters to the beginning or end of the `String`.
**length** is the total length you want the resulting string to be.

If you want to add `n` number of characters to a string, do this:
```javascript
//add 3 zeros to the beginning
var x = "EasyPeezy";
console.log(x.padStart(x.length+3, '0'));
//000EasyPeezy
```
### String.prototype.endsWith(string)
### String.prototype.startsWith(string)
It does what you think it does.

### String.prototype.isLongerThan(length)
### String.prototype.isShorterThan(length)
### String.prototype.lengthIsBetween(min,max)
Test the length of the `String`.

### String.isEmail(str)
### String.prototype.isEmail()
Tests if it matches a big long email `RegExp`.

### String.prototype.remove(string|regex)
This is an alias for:
```javascript
var x = "The Quick Brown".replace(value, '');
```

# Number
### Number.prototype.isBetween(min,max)
`min` and `max` are _inclusive_. Just like if you say "Pick a number between 1 and 100."

# Date
### Date.midnight([date])
Returns a new `Date` object that is set to midnight of `date`.
`date` defaults to `new Date()` if not passed in.

### Date.prototype.midnight()
Returns a new `Date` object that is set to midnight.

### Date.midnightUTC([date])
### Date.prototype.midnightUTC()
The usual UTC equivelants.

### Date.prototype.addDays(num)
Adds `num` days to the date.


#Object
### Object.enumerate(obj, callback)
### Object.prototype.forEach(callback)
Like Array.forEach- but the callback is passed the key & value;
```javascript
var x = {a:9, b:8, c:7};
x.forEach(function(key, value){
	console.log(key, value);
});
// a	9
// b	8
// c	7
```

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
