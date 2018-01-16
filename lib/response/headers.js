var headers = module.exports = function(response) {
	// Set the local variables
	this._response = response;
	this._headers = [];
};

headers.prototype.set = function(key, value) {
	var value_ = value || null;

	// Check if the variables are correct
	if(typeof key !== "string") {
		throw new TypeError("the argument key must be a string");
	}

	if(this._response.finished) {
		return;
	}

	value_ = Array.isArray(value_) ? value_.map(String) : String(value_);

	this._headers.push(key);
	this._response.setHeader(key, value_);
};

headers.prototype.get = function(key) {
	// Check if the variables are correct
	if(typeof key !== "string") {
		throw new TypeError("the argument key must be a string");
	}
	
	return this._response.getHeader(key);
};

headers.prototype.has = function(key) {
	// Check if the variables are correct
	if(typeof key !== "string") {
		throw new TypeError("the argument key must be a string");
	}
	
	return this._response.hasHeader(key);
};

headers.prototype.remove = function(key) {
	// Check if the variables are correct
	if(typeof key !== "string") {
		throw new TypeError("the argument key must be a string");
	}

	if(!this._headers.includes(key)) {
		throw new Error("the specified header doesn't exist");
	}
	
	this._headers.splice(this._headers.indexOf(key));

	this._response.removeHeader(key);
};

headers.prototype.append = function(key, value) {
	// Check if the variables are correct
	if(typeof key !== "string") {
		throw new TypeError("the argument key must be a string");
	}

	if(typeof value !== "string") {
		throw new TypeError("the argument value must be a string");
	}

	if(this._response.finished) {
		return;
	}

	var header = this.get(key);
	var val = value;

	if(header) {
		val = Array.isArray(header) ? header.concat(value) : Array.isArray(value) ? [header].concat(value) : [header, value];
	}

	this.set(key, val);
};

headers.prototype.clear = function() {
	for(var i = 0; i < this._headers.length; i++) {
		this.remove(this._headers[i]);
	}
};

headers.prototype.list = function() {
	return this._headers;
};