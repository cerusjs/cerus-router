var layer = require("./layer");

class route {
	constructor(cerus, path) {
		this._path = path || "";
		this._stack = [];
		this._cerus = cerus;
		this._methods = ["GET", "POST", "PUT", "DELETE", "HEAD"];

		for(var i = 0; i < this._methods.length; i++) {
			const method = this._methods[i];

			this[method.toLowerCase()] = function(path) {
				return this.route(path, method);
			};
		}
	}

	router(path) {
		if(typeof path !== "string") {
			throw new TypeError("the argument path must be a string");
		}

		if(!this.check(path)) {
			throw new Error("the argument path must be a valid url path");
		}

		var route_ = new route(this._cerus, this._path + path);

		// Push a new layer to the stack array and handle the layer when requested
		this._cerus.promise(function(event) {
			this._stack.push(new layer(path, this._path, event, {route: route_}));
		}.bind(this))
		.then(function(req, res) {
			route_.handle(req, res);
		});

		return route_;
	}

	handle(req, res) {
		var matches = 0;
		var i = 0;

		var next = function() {
			var match = false;
			var path = req.url();
			var method = req.method();

			// Go through the layer until a match is found, else send a 404 error
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
		};

		next = next.bind(this);

		next();
	}

	check(path) {
		if(typeof path !== "string") {
			throw new TypeError("the argument path must be a string");
		}

		return /^[0-9a-zA-Z-._~:/?#[\]@!$&'()*+,;=`.]+$/.test(path);
	}

	remove(path, method) {
		if(typeof path !== "string") {
			throw new TypeError("the argument path must be a string");
		}

		for(var i = 0; i < this._stack.length; i++) {
			var layer_ = this._stack[i];

			if(layer_.path === path && (method === undefined || (layer_.method === method || layer_.method === "ALL"))) {
				this._stack.splice(i);

				return;
			}
		}

		throw new Error("the path " + path + " wasn't found, so couldn't be removed");
	}

	routes() {
		return this._stack.map(x => x.path);
	}

	use() {
		return this.route("/", true);
	}

	route(path, method, priority) {
		if(typeof path !== "string") {
			throw new TypeError("the argument path must be a string");
		}

		if(!this.check(path)) {
			throw new Error("the argument path must be a valid url path");
		}

		var method_ = "ALL";
		var priority_ = false;

		// Set the arguments depending on there type
		if(typeof method === "string") {
			method_ = method;

			if(typeof priority === "boolean") {
				priority_ = priority;
			}
		}
		else if(typeof method === "boolean") {
			priority_ = method;
		}

		// Push a new layer to the stack, placed depending on it's priority
		return this._cerus.promise(function(event) {
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
}

module.exports = route;