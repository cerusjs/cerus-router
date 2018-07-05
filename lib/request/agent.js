var uaparser = require("ua-parser-js");

/**
 * This is the request.agent class. It contains information about the client by parsing the 
 * user-agent. This is class is a wrapper of faisalman's ua-parser-js package.
 * @class request.agent
 * @nofunction
 */
class agent {
	constructor(request) {
		this._agent = uaparser(request.headers["user-agent"]);
		this._browser = new browser(this._agent.browser);
		this._device = new device(this._agent.device);
		this._engine = new engine(this._agent.engine);
		this._os = new os(this._agent.os);
		this._cpu = new cpu(this._agent.cpu);
	}

	/**
	 * This function will return the full User-Agent header the client send. The User-Agent header 
	 * contains information about the system the client is using and can therefore be used to get 
	 * some information about the client. Please note that the client is able to fake his/her 
	 * User-Agent, so this information shouldn't be depended on.
     * @summary Returns the full User-Agent string.
     * @return {String} The full User-Agent string.
     * @function string
	 */
	string() {
		return this._agent.ua;
	}

	/**
	 * This function returns the browser class. This class contains information about the browser 
	 * the client was using when sending the request.
	 * @summary Returns the browser class.
	 * @return {Class} The browser class.
	 * @function browser
	 */
	browser() {
		return this._browser;
	}

	/**
	 * This function returns the device class. This class contains information about the device the
	 * client was using when sending the request.
	 * @summary Returns the device class.
	 * @return {Class} The device class.
	 * @function device
	 */
	device() {
		return this._device;
	}

	/**
	 * This function returns the engine class. This class contains information about the engine the
	 * client was using when sending the request.
	 * @summary Returns the engine class.
	 * @return {Class} The engine class.
	 * @function engine
	 */
	engine() {
		return this._engine;
	}

	/**
	 * This function returns the os class. This class contains information about the os the client
	 * was using when sending the request.
	 * @summary Returns the os class.
	 * @return {Class} The os class.
	 * @function os
	 */
	os() {
		return this._os;
	}

	/**
	 * This function returns the cpu class. This class contains information about the cpu the
	 * client was using when sending the request.
	 * @summary Returns the cpu class.
	 * @return {Class} The cpu class.
	 * @function cpu
	 */
	cpu() {
		return this._cpu;
	}
}

module.exports = agent;

/**
 * This is the browser class. This class contains information about the browser. It is parsed from
 * the User-Agent header that was send by the client.
 * @class request.agent.browser
 * @nofunction
 */
class browser {
	constructor(browser) {
		this._browser = browser;
		this._is = new is(this.name());
	}

	/**
	 * This function returns the name of the browser. When the name cannot be parsed from the 
	 * User-Agent it will return undefined. The returned name will always be lowercased.
	 * @summary Returns the name of the browser.
	 * @return {String} The name of the browser.
	 * @function name
	 */
	name() {
		if(typeof this._browser.name === "string") {
			return this._browser.name.toLowerCase();
		}

		return undefined;
	}

	/**
	 * This function returns the version of the browser. 
	 * @summary Returns the version of the browser.
	 * @return {String} The version of the browser.
	 * @function version
	 */
	version() {
		return this._browser.version;
	}

	/**
	 * This function returns the is class. With this class you can check if the client is using a 
	 * certain browser.
	 * @summary Returns the is class.
	 * @return {Class} The is class.
	 * @function is
	 */
	is() {
		return this._is;
	}
}

/**
 * This is the is class. With this class you can check if the client is using the specified 
 * browser.
 * @class request.agent.browser.is
 * @nofunction
 */
class is {
	constructor(name) {
		this._name = name;
	}

	/**
	 * With this function you can check if the user is using android browser as browser. It matches
	 * against "Android Browser".
	 * @summary Returns if the user is using android browser.
	 * @return {Boolean} If the user is using android browser.
	 * @function android
	 */
	android() {
		return this._name === "android browser";
	}

	/**
	 * With this function you can check if the user is using chrome as browser. It matches against
	 * "Chrome" and "Chrome Webview".
	 * @summary Returns if the user is using chome.
	 * @return {Boolean} If the user is using chrome.
	 * @function chrome
	 */
	chrome() {
		return this._name === "chrome" || this._name === "chrome webview";
	}

	/**
	 * With this function you can check if the user is using opera as browser. It matches against
	 * "Opera", "Opera Mini", "Opera Mobi" and "Opera Tablet".
	 * @summary Returns if the user is using opera.
	 * @return {Boolean} If the user is using opera.
	 * @function opera
	 */
	opera() {
		return this._name === "opera" ||  this._name === "opera mini" 
		|| this._name === "opera mobi" || this._name === "opera tablet";
	}

	/**
	 * With this function you can check if the user is using firefox as browser. It matches against 
	 * "Firefox".
	 * @summary Returns if the user is using firefox.
	 * @return {Boolean} If the user is using firefox.
	 * @function firefox
	 */
	firefox() {
		return this._name === "firefox";
	}

	/**
	 * With this function you can check if the user is using safari as browser. It matches against 
	 * "Safari" and "Mobile Safari".
	 * @summary Returns if the user is using safari.
	 * @return {Boolean} If the user is using safari.
	 * @function safari
	 */
	safari() {
		return this._name === "safari" || this._name === "mobile safari";
	}

	/**
	 * With this function you can check if the user is using ie as browser. It matches against
	 * "IE" and "IEMobile".
	 * @summary Returns if the user is using ie.
	 * @return {Boolean} If the user is using ie.
	 * @function ie
	 */
	ie() {
		return this._name === "ie" || this._name === "iemobile";
	}

	/**
	 * With this function you can check if the user is using edge as browser. It matches against 
	 * "Edge".
	 * @summary Returns if the user is using edge.
	 * @return {Boolean} If the user is using edge.
	 * @function edge
	 */
	edge() {
		return this._name === "edge";
	}
}

/**
 * This is the device class. This class contains information about the device. It is parsed from
 * the User-Agent header that was send by the client.
 * @class request.agent.device
 * @nofunction
 */
class device {
	constructor(device) {
		this._device = device;
	}

	/**
	 * This function returns the type of the device. Often the type cannot be parsed and it will 
	 * return undefined.
	 * @summary Returns the type of the device.
	 * @return {String} The type of the device.
	 * @function type
	 */
	type() {
		return this._device.type;
	}

	/**
	 * This function returns the vendor of the device. The vendor is the company that last sold the
	 * device. If the vendor cannot be parsed it will return undefined. The vendor is returned in 
	 * lowercase.
	 * @summary Returns the vendor of the device.
	 * @return {String} The vendor of the device.
	 * @function vendor
	 */
	vendor() {
		if(typeof this._device.vendor === "string") {
			return this._device.vendor.toLowerCase();
		}

		return undefined;
	}

	/**
	 * This function returns the model of the device. Often the model cannot be parsed and it will 
	 * return undefined.
	 * @summary Returns the model of the device.
	 * @return {String} The model of the device.
	 * @function model
	 */
	model() {
		return this._device.model;
	}
}

/**
 * This is the engine class. This class contains information about the engine. It is parsed from
 * the User-Agent header that was send by the client.
 * @class request.agent.engine
 * @nofunction
 */
class engine {
	constructor(engine) {
		this._engine = engine;
	}

	/**
	 * This function returns the name of the engine. If the name cannot be parsed it will return 
	 * undefined. The name is returned in lowercase.
	 * @summary Returns the name of the engine.
	 * @return {String} The name of the engine.
	 * @function name
	 */
	name() {
		if(typeof this._engine.name === "string") {
			return this._engine.name.toLowerCase();
		}

		return undefined;
	}

	/**
	 * This function returns the version of the engine. Often the version cannot be parsed and it will 
	 * return undefined.
	 * @summary Returns the version of the engine.
	 * @return {String} The version of the engine.
	 * @function version
	 */
	version() {
		return this._engine.version;
	}
}

/**
 * This is the engine class. This class contains information about the engine. It is parsed from
 * the User-Agent header that was send by the client.
 * @class request.agent.os
 * @nofunction
 */
class os {
	constructor(os) {
		this._os = os;
	}

	/**
	 * @function name
	 */
	name() {
		if(typeof this._os.name === "string") {
			return this._os.name.toLowerCase();
		}

		return undefined;
	}

	/**
	 * @function version
	 */
	version() {
		return this._os.version;
	}
}

/**
 * @class request.agent.cpu
 * @nofunction
 */
class cpu {
	constructor(cpu) {
		this._cpu = cpu;
	}

	/**
	 * @function arch
	 */
	arch() {
		return this._cpu.architecture;
	}
}
