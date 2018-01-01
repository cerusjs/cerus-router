var cookie = require("./cookie");

var cookies = module.exports = function() {
	this._cookies = [];
}

cookies.prototype.create = function(key, value, options) {
	return new cookie(key, value, options);
}

cookies.prototype.add = function(cookie_) {
	if(!(cookie_ instanceof cookie)) {
		throw new TypeError("the argument cookie_ must be a cookie");
	}

	if(typeof cookie_.key() !== "string") {
		throw new TypeError("the key of the inserted key must be a string");
	}

	this._cookies.push(cookie_);
}

cookies.prototype.get = function(key) {
	if(typeof key !== "string") {
		throw new TypeError("the argument key must be a string");
	}

	return this.cookies[this._cookies.map(x => x.key()).indexOf(key)];
}

cookies.prototype.has = function(key) {
	if(typeof key !== "string") {
		throw new TypeError("the argument key must be a string");
	}

	return this._cookies.map(x => x.key()).includes(key);
}

cookies.prototype.remove = function(key) {
	this._cookies.splice(this._cookies.map(x => x.key()).indexOf(key));
}

cookies.prototype.list = function() {
	return this._cookies.map(x => x.key());
}

cookies.prototype.clear = function() {
	for(var i = 0; i < this._cookies.length; i++) {
		this.remove(this._cookies[i].key());
	}
}