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
	 * This function will return the full User-Agent string the client send.
	 * @function string
	 */
	string() {
		return this._agent.ua;
	}

	/**
	 * @function browser
	 */
	browser() {
		return this._browser;
	}

	/**
	 * @function device
	 */
	device() {
		return this._device;
	}

	/**
	 * @function engine
	 */
	engine() {
		return this._engine;
	}

	/**
	 * @function os
	 */
	os() {
		return this._os;
	}

	/**
	 * @function cpu
	 */
	cpu() {
		return this._cpu;
	}
}

module.exports = agent;

/**
 * @class request.agent.browser
 * @nofunction
 */
class browser {
	constructor(browser) {
		this._browser = browser;
		this._is = new is(this.name());
	}

	/**
	 * @function name
	 */
	name() {
		if(typeof this._browser.name === "string") {
			return this._browser.name.toLowerCase();
		}

		return undefined;
	}

	/**
	 * @function version
	 */
	version() {
		return this._browser.version;
	}

	/**
	 * @function is
	 */
	is() {
		return this._is;
	}
}

/**
 * @class request.agent.browser.is
 * @nofunction
 */
class is {
	constructor(name) {
		this._name = name;
	}

	/**
	 * @function android
	 */
	android() {
		return this._name === "android browser";
	}

	/**
	 * @function chrome
	 */
	chrome() {
		return this._name === "chrome" || this._name === "chrome webview";
	}

	/**
	 * @function opera
	 */
	opera() {
		return this._name === "opera" ||  this._name === "opera mini" 
		|| this._name === "opera mobi" || this._name === "opera tablet";
	}

	/**
	 * @function firefox
	 */
	firefox() {
		return this._name === "firefox";
	}

	/**
	 * @function safari
	 */
	safari() {
		return this._name === "safari" || this._name === "mobile safari";
	}

	/**
	 * @function ie
	 */
	ie() {
		return this._name === "ie" || this._name === "iemobile";
	}

	/**
	 * @function edge
	 */
	edge() {
		return this._name === "edge";
	}
}

/**
 * @class request.agent.device
 * @nofunction
 */
class device {
	constructor(device) {
		this._device = device;
	}

	/**
	 * @function type
	 */
	type() {
		return this._device.type;
	}

	/**
	 * @function vendor
	 */
	vendor() {
		if(typeof this._device.vendor === "string") {
			return this._device.vendor.toLowerCase();
		}

		return undefined;
	}

	/**
	 * @function model
	 */
	model() {
		return this._device.model;
	}
}

/**
 * @class request.agent.engine
 * @nofunction
 */
class engine {
	constructor(engine) {
		this._engine = engine;
	}

	/**
	 * @function name
	 */
	name() {
		if(typeof this._engine.name === "string") {
			return this._engine.name.toLowerCase();
		}

		return undefined;
	}

	/**
	 * @function version
	 */
	version() {
		return this._engine.version;
	}
}

/**
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
