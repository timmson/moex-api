const _ = require("../lib/lodash");

describe("Lodash", () => {

	/**
     * @see https://lodash.com/docs/3.10.1#values
     */
	test("values", () => {
		function Foo() {
			this.a = 1;
			this.b = 2;
		}

		expect(_.values(new Foo)).toEqual([1, 2]);
		expect(_.values("hi")).toEqual(["h", "i"]);

	});

	/**
     * @see https://lodash.com/docs/3.10.1#sortByOrder
     */
	test("sortByOrder", () => {
		const users = [
			{user: "fred", age: 48},
			{user: "barney", age: 34},
			{user: "fred", age: 42},
			{user: "barney", age: 36}
		];

		const result = _.sortByOrder(users, ["user", "age"], ["asc", "desc"]);

		expect(result[0]).toEqual({user: "barney", age: 36});
		expect(result[1]).toEqual({user: "barney", age: 34});
		expect(result[2]).toEqual({user: "fred", age: 48});
		expect(result[3]).toEqual({user: "fred", age: 42});

	});

	/**
     * @see https://lodash.com/docs/3.10.1#indexBy
     */
	test("indexBy", () => {
		const keyData = [
			{dir: "left", code: 97},
			{dir: "right", code: 100}
		];

		expect(_.indexBy(keyData, "dir")).toEqual({"left": {dir: "left", code: 97}, "right": {dir: "right", code: 100}});

		expect(_.indexBy(keyData, (object) => String.fromCharCode(object.code))).toEqual({
			"a": {dir: "left", code: 97},
			"d": {dir: "right", code: 100}
		});

	});

	/**
     *@see https://lodash.com/docs/3.10.1#keys
     */
	test("keys", () => {
		function Foo() {
			this.a = 1;
			this.b = 2;
		}

		Foo.prototype.c = 3;

		expect(_.keys(new Foo)).toEqual(["a", "b"]);
		expect(_.keys("hi")).toEqual(["0", "1"]);
	});

	/**
     * @see https://lodash.com/docs/3.10.1#mapValues
     */

	test("mapValues", () => {
		expect(_.mapValues({a: 1, b: 2}, (n) => n * 3)).toEqual({a: 3, b: 6});

		const users = {
			fred: {user: "fred", age: 40},
			pebbles: {user: "pebbles", age: 1}
		};

		expect(_.mapValues(users, "age")).toEqual({fred: 40, pebbles: 1});
	});

	/**
	 * Array combine
	 */

	test("combine", () => {
		expect(_.combine([1, 2])).toBeFalsy();

		expect(_.combine([1, 2], [3])).toBeFalsy();

		expect(_.combine([1, 2], [3, 4])).toEqual({"1": 3, "2": 4});
	});
});