var headers = module.exports = function(request) {
	// Set the local variables
	this._request = request;
};

headers.prototype.get = function(key) {
	// Check if the variables are correct
	if(typeof key !== "string") {
		throw new TypeError("argument key must be a string");
	}

	return this._request.headers[key.toLowerCase()];
};

headers.prototype.has = function(key) {
	// Check if the variables are correct
	if(typeof key !== "string") {
		throw new TypeError("argument key must be a string");
	}

	return this._headers.includes(key.toLowerCase());
};

headers.prototype.list = function() {
	return Object.keys(this._request.headers);
};