var typeis = require("type-is");
var headers = require("./request/headers");
var cookies = require("./request/cookies");
var accepts = require("./request/accepts");
const agent = require("./request/agent");

/**
 * This is the request class. It is supplied as first parameter in a route handler and contains 
 * information about the request that was send by the client.
 * @example
 * // this is an example of how to get the request class
 * cerus.router().route("/")
 * .then(req, res, next) {
 *   // the req parameter is the request class
 * });
 * @class request
 * @nofunction
 */
class request {
	constructor(request, cerus) {
		this._request = request;
		this._cerus = cerus;
		this._body = "";
		this._url = require("url").parse(request.url, true);

		// Append all the incoming data to the body
		request.on("data", function(data) {
			this._body += data;
		}.bind(this));
	}

	/**
	 * This function returns the body of the request. This means it contains the data the client
	 * send with the request. Currently the only accepted body types are JSON and plain text.
	 * This function should only be called after the "end" event was fired. Otherwise it might be
	 * empty since the request wasn't finished yet.
	 * @example
	 * // inside a route handling function
	 * req.event()
	 * .on("end", function() {
	 * // use req.body() here
	 * });
	 * @summary Returns the body of the request.
	 * @function body
	 */
	body() {
		return this._body;
	}

	/**
	 * With this function you can listen for all the request events. It'll return a promise that
	 * will be called on a number of events. 
	 * @emits data This event will be called when there was data received from the client. It will 
	 * have the data as first parameter.
	 * @emits end This event will be called when all data was received and there is no data left. 
	 * You should for this event until working with the request data.
	 * @emits close This event will be called when the response was closed.
	 * @emits aborted This event will be called when it was aborted by the socket.
	 * @emits error This event is thrown when there was an error.
	 * @emits timeout This event will be called when the client timed out.
	 * @summary Returns a promise that is called on every event.
	 * @return {Promise} This function will return a promise.
	 * @function event
	 */
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

	/**
	 * This function will return the request.remote class for this request. This class contains 
	 * information about the address of the user.
	 * @summary Returns the {@link request.remote.constructor} class for this request.
	 * @return {Class} The {@link request.remote.constructor} class for this request.
	 * @function remote
	 */
	remote() {
		return new remote(this._request.socket);
	}

	/**
	 * This function will return the request.local class for this request. This class contains 
	 * information about the local address that was used to connect to the server.
	 * @summary Returns the {@link request.local.constructor} class for this request.
	 * @return {Class} The {@link request.local.constructor} class for this request.
	 * @function local
	 */
	local() {
		return new local(this._request.socket);
	}

	/**
	 * This function returns if there is data readable from the request, meaning if there is data
	 * available to read.
	 * @summary Returns if there is data available to read.
	 * @return {Boolean} If there is data available to read.
	 * @function readable
	 */
	readable() {
		return this._request.readable;
	}

	/**
	 * This function will return the url that was used for this request. This will be the full url 
	 * the client used. Meaning that things like the hash are included.
	 * @example
	 * // inside a route handling function and with "/home" as url
	 * req.url()
	 * // -> will return "/home"
	 * @summary Returns the url used for the request.
	 * @alias href
	 * @return {String} The url used for the request.
	 * @function url
	 */
	url() {
		return this._request.url;
	}

	href() {
		return this.url();
	}

	/**
	 * This function returns the method that was used for the request.
	 * @example
	 * // inside a route handling function and with "GET" as method
	 * req.method()
	 * // -> will return "GET"
	 * @summary Returns the method used for the request.
	 * @return {String} The method used for the request.
	 * @function method
	 */
	method() {
		return this._request.method;
	}

	/**
	 * This function will return the HTTP version sent by the client. This is often the same as the
	 * version the server is running on.
	 * @summary Returns the http version sent by the client.
	 * @return {String} The http version sent by the client.
	 * @function version
	 */
	version() {
		return this._request.httpVersion;
	}

	/**
	 * This functions returns the protocol that is used for the request. This can be one of two 
	 * values: "http" or "https". "https" means that the request was secure.
	 * @summary Returns the protocol used for the request.
	 * @return {String} The protocol used for the request.
	 * @function protocol
	 */
	protocol() {
		return this._request.connection.encrypted ? "https" : "http";
	}

	/**
	 * This function will return the request.headers class. With this class you can get the headers
	 * that were sent in the request.
	 * @summary Returns the {@link request.headers.constructor} class.
	 * @return {Class} The {@link request.headers.constructor} class.
	 * @function headers
	 */
	headers() {
		return new headers(this._request);
	}

	/**
	 * With this function you can easily get a header. It is basically a shortcut for 
	 * .headers().get(). You specify the header you want to get with the key parameter.
	 * @example
	 * // inside a route handling function and with the header "Host: example.com"
	 * req.header("host");
	 * // -> will return "example.com"
	 * @summary Returns the specified header.
	 * @param {String} key The name of the header you want to get.
	 * @return {String} The specified header.
	 * @function header
	 */
	header(key) {
		return this.headers().get(key);
	}

	/**
	 * This function will return the request.cookies class. With this class you can get the cookies
	 * that were sent in the request.
	 * @summary Returns the {@link request.cookies.constructor} class.
	 * @return {Class} The {@link request.cookies.constructor} class.
	 * @function cookies
	 */
	cookies() {
		if(this._cookies !== undefined) return this._cookies;

		return this._cookies = new cookies(this);
	}

	/**
	 * With this function you can easily get a cookie. It is basically a shortcut for 
	 * .cookies().get(). You specify the cookie you want to get with the key parameter.
	 * @example
	 * // inside a route handling function and with the cookie "example=cookie"
	 * req.header("example");
	 * // -> will return "cookie"
	 * @summary Returns the specified cookie.
	 * @param {String} key The name of the cookie you want to get.
	 * @return {String} The specified cookie.
	 * @function cookie
	 */
	cookie(key) {
		return this.cookies().get(key);
	}

	/**
	 * This function is used to get the hostname of the request. Before just returns the Host 
	 * header the proxy hostname is checked since it has more importance. If there is a proxy
	 * hostname it is first fixed before being returned. The fixes include removing brackets, etc.
	 * @summary Returns the hostname of the request.
	 * @alias host
	 * @return {String} The hostname of the request.
	 * @function hostname
	 */
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

	/**
	 * This function will return the path for this request. The path is different from the href and 
	 * url since it doesn't contain things like the hash and domain. For example, from the url 
	 * "/home#test" the path is "/home". Please make sure that when you're not using the possible 
	 * arguments in the url to use pathname instead.
	 * @summary Returns the path of the request.
	 * @return {String} The path of the request.
	 * @function path
	 */
	path() {
		return this._url.path;
	}

	/**
	 * This function will return the pathname for this request. The pathname is completely 
	 * different from the path, since it doesn't contain the arguments that the path might also 
	 * contain. For example pathname for the url "/home?test" is "/home", where .path() will return
	 * it fully.
	 * @summary Returns the pathname of the request.
	 * @return {String} The pathname of the request.
	 * @function pathname
	 */
	pathname() {
		return this._url.pathname;
	}

	/**
	 * This function will return the hash part of the url used in this request. The hash is the 
	 * last bit of the url after the "#" (hashtag). For example, the hash of the url 
	 * "/home#example" would be "example".
	 * @summary Returns the hash part of the requested url.
	 * @return {String} The hash part of the requested url.
	 * @function hash
	 */
	hash() {
		return this._url.hash;
	}

	/**
	 * With the class this function returns (request.accepts) you can check what the client 
	 * accepts. This class is basically a wrapper for dougwilson's accepts module.
	 * @summary Returns the {@link request.accepts.constructor} class.
	 * @return {Class} The {@link request.accepts.constructor} class. 
	 * @function accepts
	 */
	accepts() {
		if(this._accepts !== undefined) return this._accepts;

		return this._cookies = new accepts(this._request);
	}

	/**
	 * This function returns true if the client is currently connecting to the server. It is set to
	 * false when the client has succesfully connected.
	 * @summary Returns if the client is currently connecting.
	 * @return {Boolean} If the client is currently connecting.
	 * @function connecting
	 */
	connecting() {
		return this._request.socket.connecting;
	}

	/**
	 * With this function you can set for how long the socket can be kept alive. With the first 
	 * parameter you can also set if keep alive is enabled. This needs to be set to true if you 
	 * want the delay to work.
	 * @summary Sets for how long the socket can be kept alive.
	 * @param {Boolean} enable If keep alive may be enabled.
	 * @param {Number} delay How long to keep the socket alive.
	 * @function alive
	 */
	alive(enable, delay) {
		this._request.socket.setKeepAlive(enable, delay);
	}

	/**
	 * Using this function you can timeout the request for a certain amount of time. By timing the 
	 * connection out the request will have to wait for the specified amount of time. Since this 
	 * happens asynchronous this function will return promise.
	 * @summary Timeouts the request for the specified amount of time.
	 * @param {Number} timeout How long to timeout the connection for.
	 * @returns {Promise} This function returns a promise.
	 * @function timeout
	 */
	timeout(timeout) {
		if(typeof timeout !== "number") {
			throw new TypeError("argument timeout must be a number");
		}

		return this._cerus.promise(function(event) {
			this._request.setTimeout(timeout, function() {
				event("timeout");
			});
		}.bind(this));
	}

	/**
	 * With function you can check the content-type of the request. The content-type is the header 
	 * that is sent to inform what type of data the request data is. You can insert as many 
	 * parameters as you want and the content-type will be returned from those parameters. If none
	 * of the paramters match the content-type false is returned. This also a wrapper for one of 
	 * dougwilson's modules.
	 * @example
	 * // inside a route handling function and with "application/json" as content-type
	 * req.is("html", "json");
	 * // -> will return "json"
	 * @summary Returns the matched content-type.
	 * @alias type
	 * @param {...String} types The types to match.
	 * @return {String|Boolean} Returns the matched content-type or false.
	 * @function is
	 */
	is(...types) {
		return typeis(this._request, types);
	}

	type(...types) {
		return this.is(...types);
	}

	/**
	 * This function will return the connection header. This header contains the type of connection
	 * the client requested. For example, "close" means the client would like to close the 
	 * connection.
	 * @summary Returns the connection header.
	 * @return {String} The connection header sent by the client.
	 * @function connection
	 */
	connection() {
		return this.header("connection");
	}

	/**
	 * With this function you can destroy the socket that received the request. This makes the 
	 * server unusable and should therefor only be used when there is an important error. You 
	 * can also add an error. This error will be used as parameter in the error event.
	 * @summary Destroys the socket that received the request.
	 * @param {String} (error) The error you want to add.
	 * @function destroy
	 */
	destroy(error) {
		this._request.destroy(error);
	}

	/**
	 * This function will return the request.bytes class for this request. This class contains 
	 * stats about the bytes that were read and written by the request.
	 * @summary Returns the {@link request.bytes.constructor} class.
	 * @return {Class} The {@link request.bytes.constructor} class.
	 * @function bytes
	 */
	bytes() {
		return new bytes(this._request.socket);
	}

	/**
	 * With this function you can get the specified data that was send by the request. If it was a
	 * POST request the data is currently just the parsed JSON. In the future this class will also
	 * accept different types of data. For the other methods the data is fetched from the query 
	 * that is parsed from the url.
	 * @example
	 * // inside a route handling function and with "/home?data=example" as url
	 * req.get("data");
	 * // -> will return "example"
	 * @summary Fetches the specified data from the request.
	 * @param {String} key The key to specify which data to get.
	 * @return {String} The specified data from the request.
	 * @function get
	 */
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

	/**
	 * This function is used to determine if the request was send using XHR, a.k.a. XMLHTTPRequest.
	 * It does this by checking if the X-Requested-With header matches "xmlhttprequest".
	 * @summary Checks if the request was send using XHR.
	 * @return {Boolean} If the request was send using XHR.
	 * @function xhr
	 */
	xhr() {
		var xhr = this.header("X-Requested-With") || "";

		return xhr.toLowerCase() === "xmlhttprequest";
	}

	/**
	 * This function will check if the request was send using a proxy. It does this by checking if 
	 * the X-Forwarded-Proto header was set.
	 * @summary Checks if the request was send using a proxy.
	 * @return {Boolean} If the request was send using a proxy.
	 * @function proxy
	 */
	proxy() {
		return this.header("X-Forwarded-Proto") !== undefined;
	}

	/**
	 * With this function you can check if the connection is secure, meaning it is over "https".
	 * @summary Checks if the connnection is secure.
	 * @return {Boolean} If the connection is secure.
	 * @function secure
	 */
	secure() {
		return this.protocol() === "https";
	}

	/**
	 * This function returns the request.agent class. This class contains more information about 
	 * the client by parsing the user-agent header. This is class is a wrapper of faisalman's 
	 * ua-parser-js package.
	 * @summary Returns the {@link request.agent.constructor} class.
	 * @return {Class} The {@link request.agent.constructor} class.
	 * @function agent
	 */
	agent() {
		if(this._agent !== undefined) return this._agent;

		return this._agent = new agent(this);
	}
}

module.exports = request;

/**
 * This is the remote address class. It contains information about the remote address. The remote 
 * address that was used by the client.
 * @class request.remote
 * @nofunction
 */
class remote {
	constructor(socket) {
		this._socket = socket;
	}

	/**
	 * This function will return the IP address used by the client.
	 * @example
	 * req.remote().address();
	 * // -> will return the client IP
	 * @summary Returns the IP used by the client.
	 * @return {String} The IP used by the client.
	 * @function address
	 */
	address() {
		return this._socket.remoteAddress;
	}

	/**
	 * This function will return the port used by the client.
	 * @example
	 * req.remote().port();
	 * // -> will return the client port
	 * @summary Returns the port used by the client.
	 * @return {String} The port used by the client.
	 * @function port
	 */
	port() {
		return this._socket.remotePort;
	}

	/**
	 * This function will return the family of the IP that was returned by the client.
	 * @example
	 * req.remote().family();
	 * // -> will return the family of the client IP
	 * @summary Returns the family of the IP used by the client.
	 * @return {String} The family of the IP used by the client.
	 * @function family
	 */
	family() {
		return this._socket.remoteFamily;
	}
}

/**
 * This is the local address class. It contains information about the local address. The local 
 * address is the address on the server the client connected to.
 * @class request.local
 * @nofunction
 */
class local {
	constructor(socket) {
		this._socket = socket;
	}

	/**
	 * This function will return the IP address connected to by the client.
	 * @example
	 * req.local().address();
	 * // -> will return the IP connected to by the client.
	 * @summary Returns the IP connected to by the client.
	 * @return {String} The IP connected to by the client.
	 * @function address
	 */
	address() {
		return this._socket.localAddress;
	}

	/**
	 * This function will return the port connected to by the client.
	 * @example
	 * req.local().port();
	 * // -> will return the port connected to by the client.
	 * @summary Returns the port connected to by the client.
	 * @return {String} The port connected to by the client.
	 * @function port
	 */
	port() {
		return this._socket.localPort;
	}
}

/**
 * This is the bytes class. It contains information about the amount bytes written and read during 
 * this request.
 * @class request.bytes
 * @nofunction
 */
class bytes {
	constructor(socket) {
		this._socket = socket;
	}

	/**
	 * This function will return the amount of bytes that have been read from the request.
	 * @summary Returns the amount of bytes read.
	 * @return {Number} The amount of bytes read.
	 * @function read
	 */
	read() {
		return this._socket.bytesRead;
	}

	/**
	 * This function returns the amount of bytes that have been written to the response.
	 * @summary Returns the amount of bytes written.
	 * @return {Number} The amount of bytes written.
	 * @function written
	 */
	written() {
		return this._socket.bytesWritten;
	}
}
