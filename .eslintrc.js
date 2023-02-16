module.exports = {
	"env": {
		"browser": true,
		"es2021": true
	},
	"extends": "eslint:recommended",
	"overrides": [
	],
	"parserOptions": {
		"ecmaVersion": "latest"
	},
	"rules": {
		"indent": [
			'warn',
			'tab'
		],
		"no-unused-vars": ["warn", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }],

		"linebreak-style": [
			'error',
			'windows'
		],
		"quotes": [
			"error",
			"single"
		],
		"semi": [
			"error",
			"always"
		]
	}
}
