var layer = require("./layer");

/**
 * This is the router class. It is used to "sort" incoming requests based on their url. For 
 * example, when requesting "/home" the router will look for a "/home" route. When that route is
 * found, the function that comes with the route is called. You can also create a child router
 * for this router. For example, when creating a router "/user" and then routing "/home" will 
 * create the "/user/home" router. Still don't understand routing, take a look at the tutorial
 * about it.
 * @example
 * cerus.router().route("/home");
 * // -> will route the /home route.
 * @class router
 */
class route {
	constructor(cerus, path) {
		this._path = path || "";
		this._stack = [];
		this._cerus = cerus;
		this._methods = ["GET", "POST", "PUT", "DELETE", "HEAD"];

		// Documentation for this can be found at the end of the class
		for(var i = 0; i < this._methods.length; i++) {
			const method = this._methods[i];

			this[method.toLowerCase()] = function(path, priority) {
				return this.route(path, method, priority);
			};
		}
	}

	/**
	 * This function will return a new child router. A child router inherits this router's path and
	 * adds the specified path to it. The path used must be a valid url path. These child routers 
	 * are used to easily prefix routes.
	 * @example
	 * var router = cerus.router().router("/user");
	 * // -> router is now a child router of the root router
	 *
	 * router.route("/home");
	 * // -> this will route "/user/home"
	 * @summary Creates a child router.
	 * @param {String} path The path of the child router.
	 * @return {Class} The child router.
	 * @function router
	 */
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

	/**
	 * This function is called by incoming requests. It is not recommended to use this function 
	 * unless you know what you're doing. This function goes through all the routes in this 
	 * router's stack and searches for a match with the url and method. If a match is found it'll
	 * call the funtion that comes with the route.
	 * @summary Handles an incoming request.
	 * @param {Class} req The request class.
	 * @param {Class} res The response class.
	 * @function handle
	 */
	handle(req, res) {
		var matches = 0;
		var i = 0;

		var next = function() {
			var match = false;
			var path = req.url();
			var method = req.method();

			if(matches > 0) {
				matches--;
			}

			// Go through the layer until a match is found, else send a 404 error
			while(match !== true && i < this._stack.length) {
				var layer = this._stack[i++];

				match = layer.match(path, method);

				if(match) {
					matches++;
					layer.callback("request", req, res, next);
				}
			}

			if(i === this._stack.length && matches === 0 && !res.ended()) {
				res.code(404);
				res.end();
			}
		};

		next = next.bind(this);

		next();
	}

	/**
	 * This function will check if the inserted path is valid.
	 * @example
	 * cerus.router().check("/example/ /path/");
	 * // -> will return false because the path is invalid
	 * @summary Checks if the path is valid.
	 * @param {String} path The path that will be checked.
	 * @function check
	 */
	check(path) {
		if(typeof path !== "string") {
			throw new TypeError("the argument path must be a string");
		}

		return /^[0-9a-zA-Z-._~:/?#[\]@!$&'()*+,;=`.]+$/.test(path);
	}

	/**
	 * With this function you can remove previously added routes. To remove the path you have to 
	 * specify it's path and if the route isn't universal, it's method. When no route was found 
	 * that matched your parameters an Error is thrown.
	 * @example
	 * // with the route "/home" added
	 * cerus.router().remove("/home");
	 * // -> will remove the "/home" path
	 * @summary Removes the specified route.
	 * @function remove
	 */
	remove(path, method) {
		if(typeof path !== "string") {
			throw new TypeError("the argument path must be a string");
		}

		var changed = false;

		for(var i = 0; i < this._stack.length; i++) {
			var layer_ = this._stack[i];

			if(layer_.path === path && (method === undefined || (layer_.method === method || layer_.method === "ALL"))) {
				this._stack.splice(i);

				changed = true;
			}
		}

		if(!changed) {
			throw new Error("the path " + path + " wasn't found, so couldn't be removed");
		}
	}

	/**
	 * This function will return a list of all the routes mapped by their path.
	 * @summary Returns all the routes.
	 * @return {String[]} The list of all the routes.
	 * @function routes
	 */
	routes() {
		return this._stack.map(x => x.path);
	}

	/**
	 * This function is for adding middleware. Middleware are routes with things that have to be 
	 * called before the other routes. The path for middleware is "*", meaning that it matches all
	 * possible requests. The priority for middleware is set to true so it's called before the 
	 * other routes. Middleware shouldn't use values that could be changed or is added by other
	 * middleware to prevent unpredictable behaviour. When working with middleware it is important
	 * to not forget to call next when your middleware is done. If your don't the request won't be
	 * finished. For more information about routing take a look at {@link router.route} or at the 
	 * tutorial about this subject.
	 * @example
	 * cerus.router().use()
	 * .then(function(req, res, next) {
	 * // your code here and don't forget to call next when your done.
	 * });
	 * @summary Routes a new middleware.
	 * @return {Promise} This function will return a promise.
	 * @function use
	 */
	use() {
		return this.route("*", true);
	}

	/**
	 * This function is used to route a new route. Using these routes we can "sort" a incoming 
	 * request based on it's url. For example, when adding the "/home" route, all requests with the
	 * "/home" url will cause the handler for the added route to be called. When the handler is 
	 * called three parameters are added. The first is the request class. This class contains all
	 * functions you need to get information about the request. The second parameter is the 
	 * response class. This class contains the functions you needed to create and send the 
	 * response. The last parameter is the next function. When you don't "want" to handle the 
	 * request you call this function and the router will search for another handler to handle the
	 * request. You can also change the method that is used with the route. By default the "ALL" 
	 * method is used, meaning that all methods are accepted. When you change this method the 
	 * handler will also check if the route's method matches with the request's method. Lastly you
	 * can change the priority. The priority defines where the route will be placed in the stack,
	 * the list of routes. You want routes like middleware to be in the front so they are called 
	 * before the other routes. For more information about routing look at the tutorial about it.
	 * @example
	 * cerus.router().route("/home")
	 * .then(function(req, res, next) {
	 * // this function is called when someone uses the "/home" route
	 * });
	 * // -> adds the new "/home" route.
	 * @summary Routes a new route.
	 * @param {String} path The path the route will use.
	 * @param {String} (method = "ALL") The method the route will use.
	 * @param {Boolean} (priority = false) The priority of the route.
	 * @return {Promise} This function will return a promise.
	 * @function route
	 */
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

	// These functions are added in the constructor
	/**
	 * This function will create a route with "GET" as method. For more information about routing 
	 * take a look at the {@link router.route} function.
	 * @summary Routes a new route with GET as method.
	 * @param {String} path The path the route will use.
	 * @param {Boolean} (priority = false) The priority of the route.
	 * @return {Promise} This function will return a promise.
	 * @function get
	 */
	/**
	 * This function will create a route with "POST" as method. For more information about routing 
	 * take a look at the {@link router.route} function.
	 * @summary Routes a new route with POST as method.
	 * @param {String} path The path the route will use.
	 * @param {Boolean} (priority = false) The priority of the route.
	 * @return {Promise} This function will return a promise.
	 * @function post
	 */
	/**
	 * This function will create a route with "DELETE" as method. For more information about routing 
	 * take a look at the {@link router.route} function.
	 * @summary Routes a new route with DELETE as method.
	 * @param {String} path The path the route will use.
	 * @param {Boolean} (priority = false) The priority of the route.
	 * @return {Promise} This function will return a promise.
	 * @function delete
	 */
	/**
	 * This function will create a route with "HEAD" as method. For more information about routing 
	 * take a look at the {@link router.route} function.
	 * @summary Routes a new route with HEAD as method.
	 * @param {String} path The path the route will use.
	 * @param {Boolean} (priority = false) The priority of the route.
	 * @return {Promise} This function will return a promise.
	 * @function head
	 */
	/**
	 * This function will create a route with "PUT" as method. For more information about routing 
	 * take a look at the {@link router.route} function.
	 * @summary Routes a new route with PUT as method.
	 * @param {String} path The path the route will use.
	 * @param {Boolean} (priority = false) The priority of the route.
	 * @return {Promise} This function will return a promise.
	 * @function put
	 */
}

module.exports = route;