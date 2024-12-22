module.exports = {
	env: {
		es6: true,
		node: true,
	},
	parserOptions: {
		ecmaVersion: 2018,
	},
	extends: ["eslint:recommended", "google"],
	rules: {
		"no-restricted-globals": ["error", "name", "length"],
		"prefer-arrow-callback": "error",
		"quotes": ["error", "double", {"allowTemplateLiterals": true}],
		"indent": ["error", "tab"], // Allow tabs for indentation
		"no-tabs": "off", // Disable the "no-tabs" rule
	},
	overrides: [
		{
			files: ["**/*.spec.*"],
			env: {
				mocha: true,
			},
			rules: {},
		},
	],
	globals: {},
};
