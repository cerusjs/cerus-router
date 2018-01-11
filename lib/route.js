var cerus;
var layer = require("./layer");
var methods = ["GET", "POST", "PUT", "DELETE", "HEAD"];

var route = module.exports = function(cerus_, path) {
	// Set all the local variables
	this._path = path || "";
	this._stack = [];
	this._methods = methods;

	// Set the cerus object
	cerus = cerus_;
}

route.prototype.router = function(path) {
	// Check if the arguments are correct
	if(typeof path !== "string") {
		throw new TypeError("the argument path must be a string");
	}

	// Create a new route
	var route_ = new route(cerus, this._path + path);

	// Push a new layer to the stack array and handle the layer when requested
	var promise = cerus.promise(function(event) {
		stack.push(new layer(path, this._path, event, {route: route_}));
	}.bind(this))
	.then(function(req, res) {
		route_.handle(req, res);
	});

	// Return the new route
	return route_;
}

route.prototype.handle = function(req, res) {
	var matches = 0;
	var i = 0;

	// Create a next function
	function next() {
		var match = false;
		var path = req.url();
		var method = req.method();

		// Go through the layer until a match is found
		while(match !== true && i < this._stack.length) {
			// Create a layer variable
			var layer = this._stack[i++];

			// Check if the layer matches
			match = layer.match(path, method);

			// If a match is found call the layer
			if(match) {
				layer.callback("request", req, res, next);
				matches++;
			}
		}

		// If no match has been found return 404
		if(i === this._stack.length && matches === 0) {
			res.code(404);
			res.end();
		}
	}

	// Bind the function to this route
	next = next.bind(this);

	// Start looping through the first layers
	next();
}

route.prototype.check = route.prototype.test = function(path) {
	// Check if the arguments are correct
	if(typeof path !== "string") {
		throw new TypeError("the argument path must be a string");
	}

	// Return if the path matches the RegExp
	return /^[0-9a-zA-Z-._~:/?#\[\]@!$&'()*+,;=`.]+$/.test(path);
}

route.prototype.remove = function(path, method) {
	// Check if the arguments are correct
	if(typeof path !== "string") {
		throw new TypeError("the argument path must be a string");
	}

	// Loop through the layers in the stack
	for(var i = 0; i < this._stack.length; i++) {
		var layer_ = this._stack[i];

		// Remove the layer if it maches path and method
		if(layer_.path == path && (method === undefined || (layer_.method === method || layer_.method === "ALL"))) {
			this._stack.splice(i);
			return;
		}
	}

	// Throw an error when the layer wasn't found
	throw new Error("the path " + path + " wasn't found, so couldn't be removed");
}

route.prototype.routes = function() {
	// Return a map of paths from all the layers
	return this._stack.map(x => x.path);
}

route.prototype.use = function() {
	return this.route("/", true);
}

route.prototype.route = function(path, method, priority) {
	// Check if the arguments are correct
	if(typeof path !== "string") {
		throw new TypeError("the argument path must be a string");
	}

	// Check if the argument is a correct path
	if(!this.check(path)) {
		throw new Error("the argument path must be a valid url path");
	}

	var method_ = "ALL";
	var priority_ = false;

	// If the method isn't a string, set it to ALL
	if(typeof method === "string") {
		method_ = method;

		if(typeof priority === "boolean") {
			priority_ = priority;
		}
	}
	else if(typeof method === "boolean") {
		priority_ = method;
	}

	// Push a new layer to the stack
	return cerus.promise(function(event) {
		if(priority_) {
			var index = this._stack.findIndex(x => !x.priority);

			index = index === -1 ? this._stack.length : index;
			this._stack.splice(index, 0, new layer(path, this._path, event, {method: method_, priority: true}));
		}
		else {
			this._stack.push(new layer(path, this._path, event, {method: method_}));
		}
	}.bind(this));
}

// Go through all the methods
for(var i = 0; i < methods.length; i++) {
	const method = methods[i];

	route.prototype[method.toLowerCase()] = function(path) {
		// Check if the arguments are correct
		if(typeof path !== "string") {
			throw new TypeError("the argument path must be a string");
		}

		// Check if the argument is a correct path
		if(!this.check(path)) {
			throw new Error("the argument path must be a valid url path");
		}

		// Push a new layer to the stack
		return cerus.promise(function(event) {
			this._stack.push(new layer(path, this._path, event, {method}));
		}.bind(this));
	}
}