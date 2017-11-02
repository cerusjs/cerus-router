module.exports = function(cerus) {
	var self = {};
	
	var response = require("./response");
	var request = require("./request");

	var routes = [];
	var middlewares = [];

	var cancel = function(obj) {
		if(obj instanceof Error) {
			throw obj;
		}
	}

	cerus.server().callback(function(req, res) {
		new request(req, cerus)
		.then(function(request_) {
			var response_ = new response(res, request_, cerus);
			var cancel_ = function() {
				continue_ = false;

				cancel(obj);
			}

			for(var i = 0; i < middlewares.length; i++) {
				continue_ = true;

				middlewares[i]("request", request_, response_, cancel_);

				if(!continue_) {
					return;
				}
			}

			for(var i = 0; i < routes.length; i++) {
				var route = routes[i];

				if(route.url.endsWith("*")) {
					var url = route.url.substring(0, route.url.length - 1);

					if(req.url.startsWith(url)) {
						if(route.method != "ALL" && route.method != request_.method()) {
							continue;
						}

						route.func(request_, response_, cancel_);
						return;
					}
				}
				else if(req.url == route.url) {
					if(route.method != "ALL" && route.method != request_.method()) {
						continue;
					}

					route.func(request_, response_, cancel_);
					return;
				}
			}
		});
	});

	self.route = function(url, method, override) {
		if(typeof url !== "string") {
			throw new TypeError("argument url must be a string");
		}

		var method_ = "ALL";
		var override_ = false;

		if(typeof method === "string") {
			method_ = method;

			if(typeof method === "boolean") {
				override_ = override;
			}
		}
		else if(typeof method === "boolean") {
			override_ = override
		}

		return cerus.promise(function(event) {
			for(var i = 0; i < routes.length; i++) {
				if(routes[i].url.startsWith(url) && !override_) {
					return event("error", "The route " + url + " is not unique!");
				}
			}

			routes[routes.length] = {
				url: url,
				method: method_,
				func: function(req, res) {
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

	self.remove = function(url) {
		if(typeof url !== "string") {
			throw new TypeError("argument url must be a string");
		}

		for(var i = 0; i < routes.length; i++) {
			if(routes[i].url == url) {
				routes.splice(i);
			}
		}
	}

	self.use = function() {
		return cerus.promise(function(event) {
			middlewares[middlewares.length] = event;
		});
	}

	return self;
}