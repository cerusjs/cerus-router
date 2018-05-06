var mime = require("mime");
var headers = require("./response/headers");
var cookies = require("./response/cookies");

/**
 * This is the response class. With this class you can manage the response that is send to the 
 * client. It is supplied as the second parameter in a router handler.
 * @example
 * // this is an example of how to get the response class
 * cerus.router().route("/")
 * .then(req, res, next) {
 *   // the res parameter is the response class
 * });
 * @class response
 * @nofunction
 */
class response {
	constructor(response, request, cerus) {
		this._response = response;
		this._request = request;
		this._headers = new headers(response);
		this._cookies = new cookies();
		this._compression = undefined;
		this._cerus = cerus;
	}

	/**
	 * This is the setter and getter for the status code that is send in the response. The status 
	 * code is the code that tells the client how the request went. All 2xx codes means it was 
	 * successful, 3xx is used for redirection and 4xx/5xx are used for errors. If no status code 
	 * has been set the default, 200, will be used.
	 * @alias code
	 * @summary The setter/getter for the status code.
	 * @param {Number} (code) The new status code.
	 * @return {Number} The status code
	 * @function status
	 */
	status(code) {
		if(typeof code === "number") {
			this._response.statusCode = code;
		}

		return this._response.statusCode;
	}

	code(code) {
		return this.status(code);
	}

	/**
	 * This function returns if the request has been finished.
	 * @alias ended
	 * @summary Returns if the request has been finished.
	 * @return {Boolean} If the request has been finished.
	 * @function finished
	 */
	finished() {
		return this._response.finished;
	}

	/**
	 * @function ended
	 */
	ended() {
		return this.finished();
	}

	/**
	 * This function returns the headers class. With this class you can change the headers that are
	 * send in the response.
	 * @summary Returns the response.headers class.
	 * @return {Class} The response.headers class.
	 * @function headers
	 */
	headers() {
		return this._headers;
	}

	/**
	 * This function returns the cookies class. With this class you can change the cookies that are
	 * send in the response.
	 * @summary Returns the response.cookies class.
	 * @return {Class} The response.cookies class.
	 * @function cookies
	 */
	cookies() {
		return this._cookies;
	}

	/**
	 * With this function you can set if compression is allowed to be used. If you allow 
	 * compression to be use it will first check if the client accepts the gzip or deflate 
	 * compression types. If it isn't accepted by the client no compression will be used.
	 * @summary Sets if the compression is allowed to be used.
	 * @param {Boolean} allowed If the compression is allowed to be used.
	 * @function compression
	 */
	compression(allowed) {
		var encoding = this._request.accepts().encoding(["gzip", "deflate"]);

		if(allowed && encoding) {
			this._compression = this._cerus.compression(encoding);
		}
		else {
			this._compression = undefined;
		}
	}

	/**
	 * This function is used to set the location of the url to go to. Meaning with this function 
	 * you can redirect the client to the supposed url. If the url is set to "back" the client will
	 * be redirected to url gotten from the "Referrer" header, or if that header doesn't exist to 
	 * '/'.
	 * @summary Sets the location of the url to go to.
	 * @param {String} url The location of the url to go to.
	 * @function location
	 */
	location(url) {
		var url_ = url;

		if(typeof url_ !== "string") {
			throw new TypeError("argument url must be a string");
		}

		// Go back when the url is set to "back", go to '/' when no referrer was specified
		if(url_ === "back") {
			url_ = this.headers().get("Referrer") || "/";
		}

		this.headers().set("Location", url_);
	}

	/**
	 * This function changes the location, but also changes the status to 302, meaning the 
	 * requested file was found on a other url. After that, this function ends the request.
	 * @summary Redirects the client to the inserted url.
	 * @param {String} url The location of the url to redirect to.
	 * @function redirect
	 */
	redirect(url) {
		this.location(url);

		this.status(302);
		this.end();
	}

	/**
	 * This is the setter and getter for the content type of the response. The content type 
	 * contains the type of content that is send with the response. This function will parse the 
	 * inserted type and transform it to a correct MIME version. Because of this you can insert 
	 * things like "javascript" and this will be parsed to "script/javascript".
	 * @summary The setter/getter for the content type.
	 * @param {String} (type) The new content type.
	 * @return {String} The content type.
	 * @function type
	 */
	type(type) {
		if(typeof type === "string") {
			this.headers().set("Content-Type", get_type(type));
		}

		return this.headers().get("Content-Type");
	}

	/**
	 * With this function you can easily end the response. By ending the response you stop sending 
	 * data to the client. It is not possible to not send things like the headers when using this 
	 * function since those are still send.
	 * @summary Ends the response.
	 * @function end
	 */
	end() {
		this._response.end();
	}

	/**
	 * Using this function you can send data to the client. By sending data you will end the 
	 * request. This function will stop if the request has already been finsihed. If the inserted 
	 * body is an object response.json will be used to send the data. This function will convert 
	 * non-buffers to buffers, to always use buffers. It will also apply all the cookies that have 
	 * been set. If the "ETAG" header isn't defined it will set the content length to the length of
	 * the body. If compression is allowed it will send the data to client compressed with the 
	 * content encoding set to the compression type. If the compression type is undefined it will 
	 * use "html" as type. You can also set the encoding of the response, by default this is 
	 * "utf-8".
	 * @example
	 * // this is an example of how to get the response class
	 * cerus.router().route("/")
	 * .then(req, res, next) {
	 *   res.send("data");
	 *   // -> this will send the data "data"
 	 * });
	 * @summary Sends data to the client.
	 * @param {String} body The body of the response.
	 * @param {String} (encoding = "utf-8") The encoding of the body.
	 * @function send
	 */
	send(body, encoding = "utf-8") {
		var body_ = body;
		var encoding_ = encoding;

		if(this._response.finished) {
			return;
		}

		if(typeof body_ === "object" && !Buffer.isBuffer(body_)) {
			return this.json(body_);
		}

		// TODO: Catching on purpose isn't good
		try {
			body_ = Buffer.isBuffer(body_) ? body_ : Buffer.from(body_);
		} 
		catch(e) {
			body_ = undefined;
		}

		apply_cookies(this._cookies, this);

		// Set the length of the response if the ETag header isn't defined
		if(body_ !== undefined && !this.headers().get("ETag")) {
			this.headers().set("Content-Length", body_.length);
		}
		
		if(body_ !== undefined && this._compression !== undefined) {
			this._compression.compress(body_)
			.then(function(compressed) {
				if(!this.headers().get("ETag")) {
					this.headers().set("Content-Length", compressed.length);
				}

				this.headers().set("Content-Encoding", this._compression.settings().type());

				this._response.end(compressed, encoding_);
			});
		}
		else {
			if(!this.headers().get("Content-Type")) {
				this.type("html");
			}

			this._response.end(body_, encoding_);
		}
	}

	/**
	 * This function is used to send json objects to the client. It works just like the send 
	 * function, but then for json objects. If the body parameter isn't an object it will throw an 
	 * error. It will also set the content type if that isn't set yet. It will stringify the object
	 * using JSON.stringify().
	 * @summary Sends json data to the client.
	 * @param {String} body The object body of the response.
	 * @function json
	 */
	json(body) {
		if(typeof body !== "object") {
			throw new TypeError("argument body must be an object");
		}

		if(!this.headers().get("Content-Type")) {
			this.type("json");
		}

		this.send(JSON.stringify(body));
	}

	/**
	 * With this function you can easily send a file object to the client. It also uses the .send()
	 * function. If the file parameter isn't a file it will throw an error.
	 * @summary Sends a file to the client.
	 * @param {File} file The file to send.
	 * @function file
	 */
	file(file) {
		if(typeof file !== "object" || typeof file.data !== "function") {
			throw new TypeError("the argument file must be a (cerus) file");
		}

		this.send(file.data());
	}

	/**
	 * Using this function you can send a file that will be downloaded by the client. It will thrown an error if the file parameter isn't a file or a string. If it is a file it will be transformed to a string and the file's name will be used as name if the name wasn't set yet. You can set the name of the file using the name parameter and the encoding using the encoding parameter. It will also throw an error when the name parameter is not a string. To send the file it wil use the .send() function.
	 * @summary Sends a file that will be doewnloaded by the client.
	 * @param {File|String} file The file to send to the client.
	 * @param {String} name The name of the file to send.
	 * @param {String} (encoding = "utf-8") The encoding of the file that will be send.
	 * @function download
	 */
	download(file, name, encoding) {
		var data = "";
		var name_ = name;

		// Check if the file argument is a file or a string, else error 
		if(typeof file === "object" && typeof file.data === "function") {
			name_ = name_ || file.name();
			data = file.data();
		}
		else if(typeof file === "string") {
			data = file;
		}
		else {
			throw new TypeError("the argument file must be a (cerus) file or string");
		}

		if(typeof name_ !== "string") {
			throw new TypeError("the argument name must be a string");
		}

		if(!this.headers().get("Content-Disposition")) {
			this.headers().set("Content-Disposition", "attachment; filename=" + name_);
		}

		this.send(data, encoding);
	}
}

module.exports = response;

var apply_cookies = function(cookies, response) {
	for(var i = 0; i < cookies._cookies.length; i++) {
		response.headers().append("Set-Cookie", cookies._cookies[i].build());
	}
};

var get_type = function(type) {
	var type_ = mime.getType(type);

	return type_ === null ? type : type_;
};
