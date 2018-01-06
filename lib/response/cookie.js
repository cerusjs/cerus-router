var cookie = module.exports = function(key, value, options) {
	// Set the local variables
	this._key = key;
	this._value = value;
	this._options = options || {};
}

cookie.prototype.key = function(key) {
	if(typeof key === "string") {
		this._key = key;
	}

	return this._key;
}

cookie.prototype.value = function(value) {
	if(typeof value === "string") {
		this._value = value;
	}

	return this._value;
}

cookie.prototype.maxage = function(maxage) {
	if(typeof maxage === "number") {
		this._options["maxage"] = maxage;
	}

	return this._options["maxage"];
}

cookie.prototype.domain = function(domain) {
	if(typeof domain === "string") {
		this._options["domain"] = domain;
	}

	return this._options["domain"];
}

cookie.prototype.path = function(path) {
	if(typeof path === "string") {
		this._options["path"] = path;
	}

	return this._options["path"];
}

cookie.prototype.expires = function(expires) {
	if(expires instanceof Date) {
		this._options["expires"] = expires;
	}

	return this._options["expires"];
}

cookie.prototype.httponly = function(httponly) {
	if(typeof httponly === "boolean") {
		this._options["httponly"] = httponly;
	}

	return this._options["httponly"];
}

cookie.prototype.secure = function(secure) {
	if(typeof secure === "boolean") {
		this._options["secure"] = secure;
	}

	return this._options["secure"];
}

cookie.prototype.same = function(same) {
	if(typeof same === "string") {
		this._options["same"] = same;
	}

	return this._options["same"];
}

cookie.prototype.build = function() {
	var str = key + "=" + value;

	this._options.path = this._options.path || "/";

	if(typeof this._options.maxage === "string") {
		str += '; Max-Age=' + Math.floor(this._options.maxage);
	}

	if(typeof this._options.domain === "string") {
		str += '; Domain=' + this._options.domain;
	}

	if(typeof this._options.path === "string") {
		str += '; Path=' + this._options.path;
	}

	if(this._options.expires instanceof Date) {
		str += '; Expires=' + this._options.expires.toUTCString();
	}

	if(this._options.httponly) {
		str += '; HttpOnly';
	}

	if(this._options.secure) {
		str += '; Secure';
	}

	if(typeof this._options.same === "string") {
		switch(this._options.same) {
			case "lax":
				str += "; SameSite=Lax";
				break;
			case "strict":
			default:
				str += "; SameSite=Strict";
				break;
		}
	}

	return str;
}