module.exports = [
    {
        languageOptions: {
            globals: {
                Atomics: "readonly",
                SharedArrayBuffer: "readonly",
                node: "readonly",
                commonjs: "readonly",
                es6: "readonly",
                jest: "readonly",
            },
            ecmaVersion: 2018,
            sourceType: "commonjs",
        },
        rules: {
            indent: ["error", "tab"],
            "linebreak-style": ["error", "unix"],
            quotes: ["error", "double"],
            semi: ["error", "always"],
            "no-async-promise-executor": "off",
        },
    },
];