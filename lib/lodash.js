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
}

module.exports = Lodash;