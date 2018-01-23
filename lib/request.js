var typeis = require("type-is");
var headers = require("./request/headers");
var cookies = require("./request/cookies");
var accepts = require("./request/accepts");
var agent = require("./request/agent");

class request {
	constructor(request, cerus) {
		this._request = request;
		this._body = "";
		this._url = require("url").parse(request.url, true);
		this._cerus = cerus;

		// Append all the incoming data to the body
		request.on("data", function(data) {
			this._body += data;
		}.bind(this));
	}

	body() {
		return this._body;
	}

	event() {
		return this._cerus.promise(function(event) {
			this._request.on("data", function(data) {
				event("data", data);
			});

			this._request.on("end", function() {
				if(this._json === undefined) {
					try {
						this._json = JSON.parse(this._body);
					} 
					catch(e) {
						this._json = [];
					}
				}

				event("end");
			}.bind(this));

			this._request.on("close", function() {
				event("close");
			});

			this._request.on("aborted", function() {
				event("aborted");
			});

			this._request.socket.on("error", function() {
				event("error");
			});

			this._request.socket.on("timeout", function() {
				event("timeout");
			});
		}.bind(this));
	}

	remote() {
		if(this._remote === undefined) {
			this._remote = new remote(this._request.socket);
		}

		return this._remote;
	}

	local() {
		if(this._local === undefined) {
			this._local = new local(this._request.socket);
		}

		return this._local;
	}

	readable() {
		// readable is a undocumented value, which is true when there is data available to read
		return this._request.readable;
	}

	url() {
		return this._request.url;
	}

	method() {
		return this._request.method;
	}

	version() {
		return this._request.httpVersion;
	}

	protocol() {
		return this._request.connection.encrypted ? "https" : "http";
	}

	headers() {
		if(this._headers === undefined) {
			this._headers = new headers(this._request);
		}

		return this._headers;
	}

	header(key) {
		return this.headers().get(key);
	}

	cookies() {
		if(this._cookies === undefined) {
			this._cookies = new cookies(this._request);
		}

		return this._cookies;
	}

	cookie(key) {
		return this.cookies().get(key);
	}

	hostname() {
		// Start with the proxy hostname, since it has more importance
		var host = this.header("X-Forwarded-Host");

		if(!host) {
			return this.header("Host");
		}

		// Fix the host, if needed
		var offset = (host[0] === "[") ? host.indexOf("]") + 1 : 0;
		var index = host.indexOf(":", offset);

		return index !== -1 ? host.substring(0, index) : host;
	}

	host() {
		return this.hostname();
	}

	path() {
		return this._url.path;
	}

	href() {
		return this._url.href;
	}

	hash() {
		return this._url.hash;
	}

	accepts() {
		if(this._accepts === undefined) {
			this._cookies = new accepts(this._request);
		}

		return this._accepts;
	}

	connecting() {
		return this._request.socket.connecting;
	}

	alive(enable, delay) {
		this._request.socket.setKeepAlive(enable, delay);
	}

	timeout(timeout) {
		if(typeof timeout !== "number") {
			throw new TypeError("argument timeout must be a number");
		}

		// Set the timeout using a promise, so the callback argument can be used
		return this._cerus.promise(function(event) {
			this._request.setTimeout(timeout, function() {
				event("timeout");
			});
		}.bind(this));
	}

	is(...types) {
		return typeis(this._request, types);
	}

	type(...types) {
		return this.is(...types);
	}

	connection() {
		return this.header("connection");
	}

	destroy(error) {
		this._request.destroy(error);
	}

	bytes() {
		if(this._bytes === undefined) {
			this._bytes = new bytes(this._request.socket);
		}

		return this._bytes;
	}

	get(key) {
		if(typeof key !== "string") {
			throw new TypeError("argument key must be a string");
		}

		// TODO: This needs to change to support more than json
		// If it is a POST request use the parsed json
		if(this.method() === "POST") {
			return this._json[key];
		}

		// Use the query for other methods
		return this._url.query[key];
	}

	xhr() {
		var xhr = this.header("X-Requested-With") || "";

		return xhr.toLowerCase() === "xmlhttprequest";
	}

	proxy() {
		return this.header("X-Forwarded-Proto") !== undefined;
	}

	secure() {
		return this.protocol() === "https";
	}

	agent() {
		// Create the agent object if it is undefined
		if(this._agent === undefined) {
			this._agent = new agent(this._request);
		}

		// Return the agent object
		return this._agent;
	}
}

module.exports = request;

class remote {
	constructor(socket) {
		this._socket = socket;
	}

	address() {
		return this._socket.remoteAddress;
	}

	port() {
		return this._socket.remotePort;
	}

	family() {
		return this._socket.remoteFamily;
	}
}

class local {
	constructor(socket) {
		this._socket = socket;
	}

	address() {
		return this._socket.localAddress;
	}

	port() {
		return this._socket.localPort;
	}
}

class bytes {
	constructor(socket) {
		this._socket = socket;
	}

	read() {
		return this._socket.bytesRead;
	}

	written() {
		return this._socket.bytesWritten;
	}
}
