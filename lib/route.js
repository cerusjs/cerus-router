var cerus;
var layer = require("./layer");
var methods = ["GET", "POST", "PUT", "DELETE", "HEAD"];

var route = module.exports = function(cerus_, path) {
	this._path = path || "";
	this._stack = [];
	this._methods = methods;

	cerus = cerus_;
}

route.prototype.router = function(path) {
	if(typeof path !== "string") {
		throw new TypeError("the argument path must be a string");
	}

	var route_ = new route(cerus, this._path + path);

	var promise = cerus.promise(function(event) {
		stack.push(new layer(path, this._path, event, {route: route_}));
	}.bind(this))
	.then(function(req, res) {
		route_.handle(req, res);
	});

	return route_;
}

route.prototype.handle = function(req, res) {
	var matches = 0;

	function next() {
		var match = false;
		var i = 0;
		var path = req.url;
		var method = req.method;

		while(match !== true && i < this._stack.length) {
			var layer = this._stack[i++];
			match = layer.match(path, method);

			if(match) {
				layer.callback("request", req, res, next);
				matches++;
			}
		}

		if(i === this._stack.length && matches === 0) {
			res.code(404);
			res.end();
		}
	}

	next = next.bind(this);

	next();
}

route.prototype.check = function(path) {
	if(typeof path !== "string") {
		throw new TypeError("the argument path must be a string");
	}

	return /^[0-9a-zA-Z-._~:/?#\[\]@!$&'()*+,;=`.]+$/.test(path);
}

route.prototype.remove = function(path, method) {
	if(typeof path !== "string") {
		throw new TypeError("the argument path must be a string");
	}

	for(var i = 0; i < this._stack.length; i++) {
		var layer_ = this._stack[i];

		if(layer_.path == path && (method === undefined || (layer_.method === method || layer_.method === "ALL"))) {
			this._stack.splice(i);
			return;
		}
	}

	throw new Error("the path " + path + " wasn't found, so couldn't be removed");
}

route.prototype.routes = function() {
	return this._stack.map(x => x.path);
}

route.prototype.route = function(path, method) {
	if(typeof path !== "string") {
		throw new TypeError("the argument path must be a string");
	}

	if(!this.check(path)) {
		throw new Error("the argument path must be a valid url path");
	}

	if(typeof method !== "string") {
		method = "ALL";
	}

	return cerus.promise(function(event) {
		this._stack.push(new layer(path, this._path, event, {method}));
	}.bind(this));
}

for(var i = 0; i < methods.length; i++) {
	var method = methods[i];

	route.prototype[method.toLowerCase()] = function(path) {
		if(typeof path !== "string") {
			throw new TypeError("the argument path must be a string");
		}

		if(!this.check(path)) {
			throw new Error("the argument path must be a valid url path");
		}

		return cerus.promise(function(event) {
			this._stack.push(new layer(path, this._path, event, {method}));
		}.bind(this));
	}
}