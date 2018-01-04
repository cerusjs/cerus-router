var layer = module.exports = function(path, full, callback, options = {}) {
	this.path = path;
	this.full = full;
	this.sensitive = options["sensitive"] || false;
	this.method = options["method"] || "ALL";
	this.route = options["route"] || undefined;
	this.callback = callback;
	// Future feature?
	//this.regexp = regexp
}

layer.prototype.match = function(path, method) {
	if(typeof path === "string" && typeof method === "string") {
		if(this.method !== "ALL" && this.method !== method) {
			return false;
		}

		if(this.path === "/" || this.path === "*") {
			return true;
		}

		if((this.full + this.path) === path) {
			return true;
		}

		if((this.full + this.path).endsWith("*") 
			&& path.startsWith((this.full + this.path).substring(0, (this.full + this.path).length - 1))) {
			return true;
		}
	}

	return false;
}