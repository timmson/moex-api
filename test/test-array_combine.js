const array_comnine = require("../lib/array_combine");

test("array_combine", () => {
	expect(array_comnine([1, 2], [3, 4])).toEqual({"1": 3, "2": 4});
});