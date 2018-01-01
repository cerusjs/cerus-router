var response = require("./response");
var request = require("./request");
var route = require("./route");
var cerus;

var router = module.exports = function(cerus_) {
	this._route = new route(cerus_, "");

	cerus_.server().callback(function(req, res) {
		this.handle(new request(req, cerus_), new response(res, req, cerus_));
	}.bind(this));

	for(var i = 0; i < this._route._methods.length; i++) {
		var method = this._route._methods[i].toLowerCase();
		this[method] = function(path) {
			return this._route[method](path);
		}.bind(this);
	}

	cerus = cerus_;
}

// Future feature?
//router.prototype.param = function() {
//
//}

router.prototype.handle = function(req, res) {
	this._route.handle(req, res);
}

router.prototype.router = function(path) {
	return this._route.router(path);
}

router.prototype.route = function(path, method) {
	return this._route.route(path, method);
}

router.prototype.check = function(path) {
	return this._route.check(path);
}

router.prototype.routes = function() {
	return this._route.routes();
}

router.prototype.remove = function(path, method) {
	this._route.remove(path, method);
}

/*
module.exports = function(cerus) {
	var self = {};
	
	var response = require("./response");
	var request = require("./request");

	var routes = [];
	var middlewares = [];

	cerus.server().callback(function(req, res) {
		new request(req, cerus).then(function(request_) {
			var response_ = new response(res, request_, cerus);
			var match = function(url, method) {
				method = method || "ALL";

				if(url instanceof RegExp) {
					if(req.url.match(url) && (method === "ALL" || method === request_.method())) {
						return true;
					}

					return false;
				}
				else if(typeof url === "string") {
					if(url.endsWith("*") && req.url.startsWith(url.substring(0, url.length - 1))
						&& (method === "ALL" || method === request_.method())) {
						return true;
					}
					else if(req.url === url && (method === "ALL" || method === request_.method())) {
						return true;
					}

					return false;
				}

				return false;
			}

			for(var i = 0; i < middlewares.length; i++) {
				var middleware = middlewares[i];

				if(match(middleware.url)) {
					middleware.func(request_, response_);
				}

				if(response_.ended()) {
					return;
				}
			}

			for(var i = 0; i < routes.length; i++) {
				var route = routes[i];

				if(match(route.url)) {
					route.func(request_, response_);
					return;
				}
			}

			response_.status(404);
			response_.end();
		});
	});

	self.route = function(url, arg1, arg2) {
		if(typeof url !== "string") {
			throw new TypeError("argument url must be a string");
		}

		if(!self.check(url)) {
			throw new TypeError("argument url is incorrect");
		}

		var method = "ALL";
		var override = false;

		if(typeof arg1 === "string") {
			method = arg1;

			if(typeof arg2 === "boolean") {
				override = arg2;
			}
		}
		else if(typeof arg1 === "boolean") {
			override = arg1;
		}

		return cerus.promise(function(event) {
			for(var i = 0; i < routes.length; i++) {
				if(routes[i].url === url && (routes[i].method === "ALL" || routes[i].method === method)) {
					if(override) {
						routes[i] = {
							"url": url,
							"method": method,
							"func": function(req, res) {
								event("request", req, res);
							}
						}

						return;
					}
					else {
						return event("error", "The route " + url + " is not unique!");
					}
				}
			}

			routes[routes.length] = {
				"url": url,
				"method": method,
				"func": function(req, res) {
					event("request", req, res);
				}
			}
		});
	}

	self.get = function(url, override) {
		return self.route(url, "GET", override);
	}

	self.put = function(url, override) {
		return self.route(url, "PUT", override);
	}

	self.post = function(url, override) {
		return self.route(url, "POST", override);
	}

	self.delete = function(url, override) {
		return self.route(url, "DELETE", override);
	}

	self.head = function(url, override) {
		return self.route(url, "DELETE", override);
	}

	self.remove = function(url, method) {
		if(typeof url !== "string") {
			throw new TypeError("argument url must be a string");
		}

		var removed = false;

		for(var i = 0; i < routes.length; i++) {
			if(routes[i].url == url && 
				(method === undefined || (routes[i].method == method || routes[i].method === "ALL"))) {
				routes.splice(i);
				removed = true;
			}
		}

		if(!removed) {
			throw new Error("the url " + url + " doesn't exist");
		}
	}

	self.check = function(url) {
		return /^[0-9a-zA-Z-._~:/?#\[\]@!$&'()*+,;=`.]+$/.test(url);
	}

	self.routes = function() {
		return routes;
	}

	self.use = function(uri) {
		return self.middleware().add(uri);
	}

	self.middleware = function() {
		var self_ = {};

		self_.add = function(url) {
			url = url || "*";

			return cerus.promise(function(event) {
				middlewares[middlewares.length] = {
					"url": url,
					"func": function(req, res) {
						event("request", req, res);
					}
				}
			});
		}

		self_.has = function(url) {
			if(url === undefined) {
				return false;
			}

			for(var i = 0; i < middlewares.length; i++) {
				if(middlewares[i].url === url) {
					return true;
				}
			}

			return false;
		}

		self_.remove = function(url) {
			if(url === undefined) {
				throw new TypeError("argument url must be a string");
			}

			for(var i = 0; i < middlewares.length; i++) {
				if(middlewares[i].url === url) {
					middlewares.splice(i, 1);
				}
			}
		}

		self_.get = function(url) {
			if(url === undefined) {
				throw new TypeError("argument url must be a string");
			}

			for(var i = 0; i < middlewares.length; i++) {
				if(middlewares[i].url === url) {
					return middlewares[i];
				}
			}
		}

		self_.list = function() {
			return middlewares;
		}

		self_.clear = function() {
			middlewares = [];
		}

		return self_;
	}

	return self;
}*/