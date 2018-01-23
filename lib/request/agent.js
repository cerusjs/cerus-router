var uaparser = require("ua-parser-js");

class agent {
	constructor(request) {
		this._agent = uaparser(request.headers["user-agent"]);
		this._browser = new browser(this._agent.browser);
		this._device = new device(this._agent.device);
		this._engine = new engine(this._agent.engine);
		this._os = new os(this._agent.os);
		this._cpu = new cpu(this._agent.cpu);
	}

	string() {
		return this._agent.ua;
	}

	browser() {
		return this._browser;
	}

	device() {
		return this._device;
	}

	engine() {
		return this._engine;
	}

	os() {
		return this._os;
	}

	cpu() {
		return this._cpu;
	}
}

module.exports = agent;

class browser {
	constructor(browser) {
		this._browser = browser;
		this._is = new is(this.name());
	}

	name() {
		if(typeof this._browser.name === "string") {
			return this._browser.name.toLowerCase();
		}

		return undefined;
	}

	version() {
		return this._browser.version;
	}

	is() {
		return this._is;
	}
}

class is {
	constructor(name) {
		this._name = name;
	}

	android() {
		return this._name === "android browser";
	}

	chrome() {
		return this._name === "chrome" || this._name === "chrome webview";
	}

	opera() {
		return this._name === "opera" ||  this._name === "opera mini" 
		|| this._name === "opera mobi" || this._name === "opera tablet";
	}

	firefox() {
		return this._name === "firefox";
	}

	safari() {
		return this._name === "safari" || this._name === "mobile safari";
	}

	ie() {
		return this._name === "ie" || this._name === "iemobile";
	}

	edge() {
		return this._name === "edge";
	}
}

class device {
	constructor(device) {
		this._device = device;
	}

	type() {
		return this._device.type;
	}

	vendor() {
		if(typeof this._device.vendor === "string") {
			return this._device.vendor.toLowerCase();
		}

		return undefined;
	}

	model() {
		return this._device.model;
	}
}

class engine {
	constructor(engine) {
		this._engine = engine;
	}

	name() {
		if(typeof this._engine.name === "string") {
			return this._engine.name.toLowerCase();
		}

		return undefined;
	}

	version() {
		return this._engine.version;
	}
}

class os {
	constructor(os) {
		this._os = os;
	}

	name() {
		if(typeof this._os.name === "string") {
			return this._os.name.toLowerCase();
		}

		return undefined;
	}

	version() {
		return this._os.version;
	}
}

class cpu {
	constructor(cpu) {
		this._cpu = cpu;
	}

	arch() {
		return this._cpu.architecture;
	}
}
