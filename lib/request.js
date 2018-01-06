var typeis = require("type-is");
var headers = require("./request/headers");
var cookies = require("./request/cookies");
var accepts = require("./request/accepts");
var agent = require("./request/agent");
var cerus;

var request = module.exports = function(request, cerus_) {
	// Set the local variables
	this._request = request;
	this._body = "";
	this._url = require("url").parse(request.url, true);

	// Append the data to the body
	request.on("data", function(data) {
		this._body += data;
	});

	// Set the cerus object
	cerus = cerus_;
}

request.prototype.event = function() {
	// Create a new promise and create listeners for all events
	return cerus.promise(function(event) {
		this._request.on("data", function(data) {
			event("data", data);
		});

		this._request.on("end", function() {
			event("end");
		});

		this._request.on("close", function() {
			event("close");
		});

		this._request.on("aborted", function() {
			event("aborted");
		});

		this._request.connection.on("error", function() {
			event("error");
		});

		this._request.connection.on("timeout", function() {
			event("timeout");
		});
	}.bind(this));
}

request.prototype.remote = function() {
	// Create the remote address object if it is undefined
	if(this._remote === undefined) {
		this._remote = new remote(request.socket);
	}

	// Return the remote address object
	return this._remote;
}

var remote = function(socket) {
	// Set the local variables
	this._socket = socket;
}

remote.prototype.address = function() {
	return this._socket.remoteAddress;
}

remote.prototype.port = function() {
	return this._socket.remotePort;
}

remote.prototype.family = function() {
	return this._socket.remoteFamily;
}

request.prototype.local = function() {
	// Create the local address object if it is undefined
	if(this._local === undefined) {
		this._local = new local(request.socket);
	}

	// Return the local address object
	return this._local;
}

var local = function(socket) {
	// Set the local variables
	this._socket = socket;
}

local.prototype.address = function() {
	return this._socket.localAddress;
}

local.prototype.port = function() {
	return this._socket.localPort;
}

request.prototype.readable = function() {
	return this._request.readable;
}

request.prototype.domain = function() {
	return this._request.domain;
}

request.prototype.url = function() {
	return this._request.url;
}

request.prototype.method = function() {
	return this._request.method;
}

request.prototype.version = function() {
	return this._request.httpVersion;
}

request.prototype.protocol = function() {
	// Return "http" or "https" depending on if it is encrypted
	return this._request.connection.encrypted ? "https" : "http";
}

request.prototype.headers = function() {
	// Create the headers object if it is undefined
	if(this._headers === undefined) {
		this._headers = new headers(request);
	}

	// Return the headers object
	return this._headers;
}

request.prototype.header = function(key) {
	return this.headers().get(key);
}

request.prototype.cookies = function() {
	// Create the cookie object if it is undefined
	if(this._cookies === undefined) {
		this._cookies = new cookies(request);
	}

	// Return the cookies object
	return this._cookies;
}

request.prototype.cookie = function(key) {
	return this.cookies().get(key);
}

request.prototype.host = request.prototype.hostname = function() {
	// Set the host to the forwarded version first
	var host = this.header("X-Forwarded-Host");

	// Test if the host is set, else return the host value
	if(!host) {
		return this.header("Host");
	}

	// Fix the host, if needed
	var offset = (host[0] === "[") ? host.indexOf("]") + 1 : 0;
	var index = host.indexOf(':', offset);

	return index !== -1 ? host.substring(0, index) : host;
}

request.prototype.path = function() {
	return this._url.path;
}

request.prototype.origin = function() {
	return this._url.origin;
}

request.prototype.href = function() {
	return this._url.href;
}

request.prototype.port = function() {
	return this._url.port;
}

request.prototype.hash = function() {
	return this._url.hash;
}

request.prototype.auth = function() {
	// Create the auth object if it is undefined
	if(this._auth === undefined) {
		this._auth = new auth(this._url);
	}

	// Return the auth object
	return this._auth;
}

var auth = function(url) {
	// Set the local variables
	this._url = url;
}

auth.prototype.username = function() {
	return this._url.username;
}

auth.prototype.password = function() {
	return this._url.password;
}

request.prototype.accepts = function() {
	// Create the accepts object if it is undefined
	if(this._accepts === undefined) {
		this._accepts = new accepts(request);
	}

	// Return the accepts object
	return this._accepts;
}

request.prototype.connecting = function() {
	return this._request.socket.connecting;
}

request.prototype.alive = function(enable, delay) {
	this._request.socket.setKeepAlive(enable, delay);
}

request.prototype.timeout = function(timeout) {
	// Check if the arguments are correct
	if(typeof timeout !== "number") {
		throw new TypeError("argument timeout must be a number");
	}

	// Set the timeout using a promise, so the callback argument can be used
	return cerus.promise(function(event) {
		this._request.setTimeout(timeout, function() {
			event("timeout");
		});
	});
}

request.prototype.is = function(types) {
	var arr = types || [];

	// If types isn't array, add all the arguments to the array
	if(!Array.isArray(types)) {
		arr = new Array(arguments.length);

		for(var i = 0; i < arr.length; i++) {
			arr[i] = arguments[i];
		}
	}

	// Check if the request is the array of types
	return typeis(this._request, arr);
}

request.prototype.body = function() {
	return body;
}

request.prototype.connection = function() {
	// Return the connect header
	return this.header("connection");
}

request.prototype.destroy = function(error) {
	this._request.destroy(error);
}

request.prototype.destroyed = function() {
	this._request.socket.destroyed();
}

request.prototype.bytes = function() {
	// Create the bytes object if it is undefined
	if(this._bytes === undefined) {
		this._bytes = new bytes(request.socket);
	}

	// Return the bytes object
	return this._bytes;
}

var bytes = function(socket) {
	// Set the local variables
	this._socket = socket;
}

bytes.prototype.read = function() {
	return this._socket.bytesRead;
}

bytes.prototype.written = function() {
	return this._socket.bytesWritten;
}

request.prototype.get = function(key) {
	// Check if the arguments are correct
	if(typeof key !== "string") {
		throw new TypeError("argument key must be a string");
	}

	// If it is a POST request use json
	if(this.method() == "POST") {
		return json[key];
	}
	// Else use the query
	else {
		return url.query[key];
	}

	return undefined;
}

request.prototype.xhr = function() {
	// Test if the X-Requested-With is equal to xhr
	var xhr = this.header('X-Requested-With') || "";
	return xhr.toLowerCase() == 'xmlhttprequest';
}

request.prototype.proxy = function() {
	// Get the proxy and fix it if it needs it
	var proxy = this.header('X-Forwarded-Proto');
	var index = proxy.indexOf(",");

	return index !== -1 ? proxy(0, index).trim() : index.trim();
}

request.prototype.secure = function() {
	// Test if it is secure by checking if the protocal is equal to https
	return this.protocol() == 'https';
}

request.prototype.agent = function() {
	// Create the agent object if it is undefined
	if(this._agent === undefined) {
		this._agent = new agent(request);
	}

	// Return the agent object
	return this._agent;
}

/*
module.exports = function(request, cerus) {
	return cerus.promise(function(event) {
		var self = {};

		var accepts = require("accepts")(request);
		var typeis = require("type-is");
		var uaparser = require("ua-parser-js");

		var url = require("url").parse(request.url, true);
		var body = "";
		var json = {};
		var cookies = null;

		if(request.method == 'POST') {
			request.on('data', function(data) {
				body += data;
			});
			request.on('end', function() {
				try {
					json = JSON.parse(body);
				}
				catch(e) {}

				event("done", self);
			});
		}
		else {
			event("done", self);
		}

		function parse_cookies() {
			var cks = self.header("cookie");
			cookies = {};

			if(cks == null || cks == "") {
				return;
			}

			if(cks.indexOf(";") < 0) {
				cks = new Array(cks);
			}
			else {*/
//				cks = cks.split(/; */);
/*			}

			for(var i = 0; i < cks.length; i++) {
				var cookie = cks[i];
				var split = cookie.indexOf("=");

				if(split < 0) {
					continue;
				}

				var key = cookie.substring(0, split).trim();
				var val = cookie.substring(split + 1, cookie.length).trim();

				if(val.startsWith("\"")) {
					val = val.slice(1, -1);
				}

				if(cookies[key] == undefined) {
					cookies[key] = val;
				}
			}
		}

		self.events = function() {
			return cerus.promise(function(event) {
				request.on("close", function() {
					event("close");
				});

				request.on("aborted", function() {
					event("aborted");
				});

				request.connection.on("error", function() {
					event("error");
				});

				request.connection.on("timeout", function() {
					event("timeout");
				});
			});
		}

		self.remote = function() {
			var self_ = {};

			self_.address = function() {
				return request.socket.remoteAddress;
			}

			self_.port = function() {
				return request.socket.remotePort;
			}

			self_.family = function() {
				return request.socket.remoteFamily;
			}

			return self_;
		}

		self.local = function() {
			var self_ = {};

			self_.address = function() {
				return request.socket.localAddress;
			}

			self_.port = function() {
				return request.socket.localPort;
			}

			return self_;
		}

		self.readable = function() {
			return request.readable;
		}

		self.domain = function() {
			return request.domain;
		}

		self.url = function() {
			return request.url;
		}

		self.method = function() {
			return request.method;
		}

		self.version = function() {
			return request.httpVersion;
		}

		self.protocol = function() {
			return request.connection.encrypted ? "https" : "http";
		}

		self.headers = function() {
			var self_ = {};

			self_.get = function(key) {
				if(typeof key !== "string") {
					throw new TypeError("argument key must be a string");
				}

				return request.headers[key.toLowerCase()];
			}

			self_.has = function(key) {
				if(typeof key !== "string") {
					throw new TypeError("argument key must be a string");
				}

				return request.headers[key.toLowerCase()] !== undefined;
			}

			self_.list = function() {
				return request.headers;
			}

			return self_;
		}

		self.header = function(key) {
			return self.headers().get(key)
		}

		self.cookies = function() {
			var self_ = {};

			if(cookies == null) {
				parse_cookies();
			}

			self_.get = function(key) {
				if(typeof key !== "string") {
					throw new TypeError("argument key must be a string");
				}

				return cookies[key];
			}

			self_.has = function(key) {
				if(typeof key !== "string") {
					throw new TypeError("argument key must be a string");
				}

				return cookies[key] !== undefined;
			}

			self_.list = function() {
				return cookies;
			}

			return self_;
		}

		self.cookie = function(key) {
			return self.cookies().get(key);
		}

		self.host = self.hostname = function() {
			var host = self.header("X-Forwarded-Host");

			if(!host) {
				return self.header("Host");
			}

			var offset = (host[0] === "[") ? host.indexOf("]") + 1 : 0;
			var index = host.indexOf(':', offset);

			return index !== -1 ? host.substring(0, index) : host;
		}

		self.path = function() {
			return url.path;
		}

		self.origin = function() {
			return url.origin;
		}

		self.href = function() {
			return url.href;
		}

		self.port = function() {
			return url.port;
		}

		self.hash = function() {
			return url.hash;
		}

		self.auth = function() {
			var self_ = {};

			self_.username = function() {
				return url.username;
			}

			self_.password = function() {
				return url.password;
			}

			return self_;
		}

		self.accepts = function() {
			var self_ = {};

			self_.type = function(type) {
				if(type == null) {
					return accepts.types();
				}

				return accepts.type(type);
			}

			self_.encoding = function(encoding) {
				if(encoding == null) {
					return accepts.encodings();
				}

				return accepts.encoding(encoding);
			}

			self_.charset = function(charset) {
				if(charset == null) {
					return accepts.charsets();
				}

				return accepts.charset(charset);
			}

			self_.language = function(language) {
				if(language == null) {
					return accepts.languages();
				}

				return accepts.language(language);
			}

			return self_;
		}

		self.agent = function() {
			var self_ = {};

			self_.string = function() {
				return self.header("user-agent");
			}

			self_.browser = function() {
				var self__ = {};
				var browser = agent.getBrowser();

				self__.name = function() {
					if(typeof browser.name === "string") {
						return browser.name.toLowerCase();
					}

					return undefined;
				}

				self__.version = function() {
					return browser.version;
				}

				self__.is = function() {
					var self__ = {};

					self___.android = function() {
						return self__.name() === "android browser";
					}

					self___.chrome = function() {
						return self__.name() === "chrome" || 
							self__.name() === "chrome webview";
					}

					self___.opera = function() {
						return self__.name() === "opera " || 
							self__.name() === "opera mini" || 
							self__.name() === "opera mobi" ||
							self__.name() === "opera tablet";
					}

					self___.firefox = function() {
						return self__.name() === "firefox";
					}

					self___.safari = function() {
						return self__.name() === "safari" || 
							self__.name() === "mobile safari";
					}

					self___.ie = function() {
						return self__.name() === "ie" || 
							self__.name() === "iemobile";
					}

					self___.edge = function() {
						return self__.name() === "edge";
					}

					return self___;
				}

				return self__;
			}

			self_.device = function() {
				var self__ = {};
				var device = agent.getDevice();

				self__.type = function() {
					return device.type;
				}

				self__.vendor = function() {
					if(typeof device.vendor === "string") {
						return device.vendor.toLowerCase();
					}

					return undefined;
				}

				self__.model = function() {
					return device.model;
				}

				return self__;
			}

			self_.engine = function() {
				var self__ = {};
				var engine = agent.getEngine();

				self__.name = function() {
					if(typeof engine.name === "string") {
						return engine.name.toLowerCase();
					}

					return undefined;
				}

				self__.version = function() {
					return engine.version;
				}

				return self__;
			}


			self_.os = function() {
				var self__ = {};
				var os = agent.getOS();

				self__.name = function() {
					if(typeof os.name === "string") {
						return os.name.toLowerCase();
					}

					return undefined;
				}

				self__.version = function() {
					return os.version;
				}

				return self__;
			}

			self_.cpu = function() {
				var self__ = {};
				var cpu = agent.getCPU();

				self__.architecture = function() {
					return cpu.architecture;
				}

				return self__;
			}

			return self_;
		}

		self.connecting = function() {
			return request.socket.connecting;
		}

		self.alive = function(enable, delay) {
			request.socket.setKeepAlive(enable, delay);
		}

		self.timeout = function(timeout) {
			if(typeof timeout !== "number") {
				throw new TypeError("argument timeout must be a number");
			}

			return cerus.promise(function(event) {
				request.setTimeout(timeout, function() {
					event("timeout");
				});
			});
		}

		self.is = function(types) {
			var arr = types || [];

			if(!Array.isArray(types)) {
				arr = new Array(arguments.length);

				for(var i = 0; i < arr.length; i++) {
					arr[i] = arguments[i];
				}
			}

			return typeis(request, arr);
		}

		self.body = function() {
			return body;
		}

		self.connection = function() {
			return self.header("connection");
		}

		self.destroy = function(error) {
			request.destroy(error);
		}

		self.destroyed = function() {
			request.socket.destroyed();
		}

		self.bytes = function() {
			var self_ = {};

			self_.read = function() {
				return request.socket.bytesRead;
			}

			self_.written = function() {
				return request.socket.bytesWritten;
			}

			return self_;
		}

		self.get = function(key) {
			if(typeof key !== "string") {
				throw new TypeError("argument key must be a string");
			}

			if(self.method() == "POST") {
				return json[key];
			}
			else {
				return url.query[key];
			}

			return null;
		}

		self.xhr = function() {
			var xhr = self.get('X-Requested-With') || "";
			return xhr.toLowerCase() == 'xmlhttprequest';
		}

		self.proxy = function() {
			var proxy = self.get('X-Forwarded-Proto');
			var index = proxy.indexOf(",");

			return index !== -1 ? proxy(0, index).trim() : index.trim();
		}

		self.secure = function() {
			return self.protocol() == 'https';
		}

		var agent = new uaparser(self.header("user-agent"));

		return self;
	});
}
*/