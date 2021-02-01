const _ = require("lodash");

class Lodash {
	static indexBy(collection, iteratee, thisArg) {
		return _.keyBy(collection, iteratee, thisArg);
	}

	static keys(object) {
		return _.keys(object);
	}

	static mapValues(collection, iteratee, thisArg) {
		return _.mapValues(collection, iteratee, thisArg);
	}

	static values(object) {
		return _.values(object);
	}

	static sortByOrder(collection, iteratee, orders) {
		return _.orderBy(collection, iteratee, orders);
	}

	static combine(keys, values) {
		const new_array = {};
		const keyCount = keys && keys.length;
		let i = 0;

		if (typeof keys !== "object" || typeof values !== "object" || typeof keyCount !== "number" || typeof values.length !== "number" || !keyCount) {
			return false;
		}

		if (keyCount !== values.length) {
			return false;
		}

		for (i = 0; i < keyCount; i++) {
			new_array[keys[i]] = values[i];
		}

		return new_array;
	}
}

module.exports = Lodash;