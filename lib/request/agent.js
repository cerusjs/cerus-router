var uaparser = require("ua-parser-js");

var agent = module.exports = function(request) {
	// Set the local variables
	this._agent = uaparser(request.headers["user-agent"]);
	this._browser = new browser(this._agent.browser);
	this._device = new device(this._agent.device);
	this._engine = new engine(this._agent.engine);
	this._os = new os(this._agent.os);
	this._cpu = new cpu(this._agent.cpu);
}

agent.prototype.string = function() {
	return this._agent.ua;
}

agent.prototype.browser = function() {
	return this._browser;
}

var browser = function(browser) {
	this._browser = browser;
	this._is = new is(this.name());
}

browser.prototype.name = function() {
	if(typeof this._browser.name === "string") {
		return this._browser.name.toLowerCase();
	}

	return undefined;
}

browser.prototype.version = function() {
	return this._browser.version;
}

browser.prototype.is = function() {
	return this._is;
}

var is = function(name) {
	this._name = name;
}

is.prototype.android = function() {
	return this._name === "android browser";
}

is.prototype.chrome = function() {
	return this._name === "chrome" || this._name === "chrome webview";
}

is.prototype.opera = function() {
	return this._name === "opera " ||  this._name === "opera mini" 
		|| this._name === "opera mobi" || this._name === "opera tablet";
}

is.prototype.firefox = function() {
	return this._name === "firefox";
}

is.prototype.safari = function() {
	return this._name === "safari" || this._name === "mobile safari";
}

is.prototype.ie = function() {
	return this._name === "ie" || this._name === "iemobile";
}

is.prototype.edge = function() {
	return this._name === "edge";
}

agent.prototype.device = function() {
	return this._device;
}

var device = function(device) {
	this._device = device;
}

device.prototype.type = function() {
	return this._device.type;
}

device.prototype.vendor = function() {
	if(typeof this._device.vendor === "string") {
		return this._device.vendor.toLowerCase();
	}

	return undefined;
}

device.prototype.model = function() {
	return this._device.model;
}

agent.prototype.engine = function() {
	return this._engine;
}

var engine = function(engine) {
	this._engine = engine;
}

engine.prototype.name = function() {
	if(typeof this._engine.name === "string") {
		return this._engine.name.toLowerCase();
	}

	return undefined;
}

engine.prototype.version = function() {
	return this._engine.version;
}

agent.prototype.os = function() {
	return this._os;
}

var os = function(os) {
	this._os = os;
}

os.prototype.name = function() {
	if(typeof this._os.name === "string") {
		return this._os.name.toLowerCase();
	}

	return undefined;
}

os.prototype.version = function() {
	return this._os.version;
}

agent.prototype.cpu = function() {
	return this._cpu;
}

var cpu = function(cpu) {
	this._cpu = cpu;
}

cpu.prototype.architecture = function() {
	return this._cpu.architecture;
}