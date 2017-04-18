const util = require("./util");

module.exports = (Bluebird) => {
	Bluebird.prototype.tapCatch = function tapCatch(...args) {
		return Bluebird.resolve((async () => {
			const handlerOrPredicate = args[0];
			const len = args.length;
			if(len === 1) {
				return this._passThrough(handlerOrPredicate,
					1,
					undefined,
					this.finally);
			} else {
				const catchInstances = new Array(len - 1);
				let j = 0, i;
				for (i = 0; i < len - 1; ++i) {
					const item = arguments[i];
					if (util.isObject(item)) {
						catchInstances[j++] = item;
					} else {
						return Promise.reject(new TypeError(
							"tapCatch statement predicate: expecting an object but got " + util.classString(item)
						));
					}
				}
				catchInstances.length = j;
				const handler = arguments[i];
				return this._passThrough(catchFilter(catchInstances, handler, this),
					1,
					undefined,
					this.finally);
			}
		})());
	};

	// Bluebird.tapCatch = function tapCatch(promise, onFullfiled) {
	// 	return Bluebird.resolve((async () => {
	// 		const value = await promise;
	// 		await onFullfiled(value);
	// 		return value;
	// 	})());
	// };
};

// Promise.prototype.tapCatch = function (...args) {
// 	const handlerOrPredicate = args[0];
// 	const len = args.length;
// 	if(len === 1) {
// 		return this._passThrough(handlerOrPredicate,
// 			1,
// 			undefined,
// 			this.finally);
// 	} else {
// 		const catchInstances = new Array(len - 1);
// 		let j = 0, i;
// 		for (i = 0; i < len - 1; ++i) {
// 			const item = arguments[i];
// 			if (util.isObject(item)) {
// 				catchInstances[j++] = item;
// 			} else {
// 				return Promise.reject(new TypeError(
// 					"tapCatch statement predicate: expecting an object but got " + util.classString(item)
// 				));
// 			}
// 		}
// 		catchInstances.length = j;
// 		const handler = arguments[i];
// 		return this._passThrough(catchFilter(catchInstances, handler, this),
// 			1,
// 			undefined,
// 			this.finally);
// 	}

// };