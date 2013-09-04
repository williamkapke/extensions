
//helper to remove the repetitive {value: XXX} cruft
function define(obj, values){
	Object.keys(values).forEach(function(key){
		Object.defineProperty(obj, key, {
			value: values[key]
		});
	});
}

define(Object, {
	extend: require("extend"),
	define: define
});

define(String.prototype, {
	padStart: function (resultLength,padChar) { if(this.length>=resultLength) return this.valueOf(); return (new Array(resultLength-this.length+1)).join(padChar||' ') + this },
	padEnd: function (resultLength,padChar) { if(this.length>=resultLength) return this.valueOf(); return this+(new Array(resultLength-this.length+1)).join(padChar||' ') },
	endsWith: function (A) { return this.substr(this.length - A.length) === A },
	startsWith: function (A) { return this.substr(0, A.length) === A },
	isLongerThan: function (l) { return this.length > l },
	isShorterThan: function (l) { return this.length < l},
	lengthIsBetween: function (min,max) { return this.length.isBetween(min, max); },
	isEmail: function isEmail() { return String.isEmail(this.valueOf()); },
	remove: function (value) { return this.replace(value, ""); }
});

Date.midnight = function(date){
	date = date? new Date(date) : new Date;
	date.setHours(0,0,0,0);
	return date;
};
Date.midnightUTC = function(date){
	if(!date) date = new Date;
	var val = date.valueOf();
	return val - (val % 86400000);
};
define(Date.prototype, {
	midnight: function(){ return Date.midnight(this); },
	midnightUTC: function(){ return Date.midnightUTC(this); },
	addDays: function(value){
		this.setDate(this.getDate() + value); return this;
	}
});

define(Number.prototype, {
	isBetween: function (min,max) { return this >= min && this <= max; }
});

define(Object.prototype, {
	filter: function(callback){
		var result = {};
		this.forEach(function(key, value){
			var keep = callback(key, value);
			if(keep===true)
				result[key] = value;
		});
		return result;
	},
	map: function(callback){
		var result = {};
		this.forEach(function(key, value){
			result[key] = callback(key, value);
		});
		return result;
	},
	forEach: function(callback){
		var obj = this;
		Object.enumerate(this, callback);
	}
});
Object.enumerate = function(obj, callback){
	Object.keys(obj).forEach(function(name, i){
		callback.call(obj, name, obj[name], i);
	});
}

String.isEmail = function(str) {
	//I have no idea who deserves the credit for this RegExp.
	return /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/.test(str);
}
