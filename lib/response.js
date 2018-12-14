const mime = require("mime");
const headers = require("./response/headers");
const cookies = require("./response/cookies");

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
		if(code === undefined) return this._response.statusCode;

		return this._response.statusCode = code;
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
		const encoding = this._request.accepts().encoding(["gzip", "deflate"]);

		if(allowed && encoding) {
			return this._compression = this._cerus.compression(encoding);
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
		let _url = url;

		if(_url === "back") _url = this.headers().get("Referrer") || "/";

		this.headers().set("Location", _url);
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
		if(type === undefined) return this.headers().get("Content-Type");

		this.headers().set("Content-Type", this._get_type(type));

		return type;
	}

	_get_type(type) {
		const _type = mime.getType(type);
	
		return _type === null ? type : _type;
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
	send(body, {encoding = "utf-8"} = {}) {
		let _body = body;

		if(this.finished()) return;

		if(typeof _body === "object" && !Buffer.isBuffer(_body)) {
			return this.json(_body);
		}

		_body = this._to_buffer(_body);
		this._apply_cookies();

		// Set the length of the response if the ETag header isn't defined
		if(_body !== undefined && !this.headers().get("ETag")) {
			this.headers().set("Content-Length", _body.length);
		}
		
		if(_body === undefined || this._compression === undefined) {
			if(!this.headers().get("Content-Type")) {
				this.type("html");
			}

			return this._response.end(_body, encoding);
		}
		
		this._compression.compress(_body)
		.then(compressed => {
			if(!this.headers().get("ETag")) {
				this.headers().set("Content-Length", compressed.length);
			}

			this.headers().set("Content-Encoding", this._compression.settings().type());

			this._response.end(compressed, encoding);
		});
	}

	_to_buffer(body) {
		try {
			return Buffer.isBuffer(body) ? body : Buffer.from(body);
		}
		catch(e) {
			return body;
		}
	}

	_apply_cookies() {
		this.headers().set("Set-Cookie", this._cookies.list().map(cookie => cookie.build()));
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
	json(body, {pretty} = {}) {
		if(!this.headers().get("Content-Type")) this.type("json");

		this.send(this._stringify(body, {pretty}));
	}

	_stringify(json, {pretty}) {
		return pretty ? JSON.stringify(json, null, "\t") : JSON.stringify(json);
	}

	/**
	 * With this function you can easily send a file to the client. It will send the file by 
	 * creating a read stream for the file and piping that to the response.
	 * @summary Sends a file to the client.
	 * @param {File} file The file to send.
	 * @function file
	 */
	file(file) {
		return file.pipe(this._response);
	}

	/**
	 * Using this function you can send a file that will be downloaded by the client. It will thrown an error if the file parameter isn't a file or a string. If it is a file it will be transformed to a string and the file's name will be used as name if the name wasn't set yet. You can set the name of the file using the name parameter and the encoding using the encoding parameter. It will also throw an error when the name parameter is not a string. To send the file it wil use the .send() function.
	 * @summary Sends a file that will be doewnloaded by the client.
	 * @param {File|String} file The file to send to the client.
	 * @param {String} name The name of the file to send.
	 * @param {String} (encoding = "utf-8") The encoding of the file that will be send.
	 * @function download
	 */
	download(file, {name} = {}) {
		if(!this.headers().get("Content-Disposition")) {
			this.headers().set("Content-Disposition", "attachment; filename=" + name);
		}

		return this.file(file);
	}
}

module.exports = response;
