var headers = module.exports = function(request) {
	this._request = request;
}

headers.prototype.get = function(key) {
	if(typeof key !== "string") {
		throw new TypeError("argument key must be a string");
	}

	return this._request.headers[key.toLowerCase()];
}

headers.prototype.has = function(key) {
	if(typeof key !== "string") {
		throw new TypeError("argument key must be a string");
	}

	return this._headers.includes(key.toLowerCase());
}

headers.prototype.list = function() {
	return Object.keys(this._request.headers);
}