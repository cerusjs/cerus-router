module.exports = class layer {
	constructor(path, full, callback, options = {}) {
		this.path = path;
		this.full = full;
		this.sensitive = options["sensitive"] || false;
		this.method = options["method"] || "ALL";
		this.route = options["route"] || undefined;
		this.priority = options["priority"] || false;
		this.callback = callback;

		// TODO: Future feature?
		// this.regexp = regexp
	}

	match(path, method) {
		var fullpath = this.full + this.path;

		if(typeof path === "string" && typeof method === "string") {
			// Check if the method doesn't match
			if(this.method !== "ALL" && this.method !== method) {
				return false;
			}

			// Always return true when the path is "*"
			if(this.path === "*") {
				return true;
			}

			// Check if the full path matches the path
			if(path === fullpath) {
				return true;
			}

			// Check if the full path ends with "*" and then check if that path matches
			if(fullpath.endsWith("*") && path.startsWith(fullpath.substring(0, fullpath.length - 1))) {
				return true;
			}
		}
	}
}
