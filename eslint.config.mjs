import jqueryConfig from "eslint-config-jquery";
import globals from "globals";

export default [
	{

		// Only global ignores will bypass the parser
		// and avoid JS parsing errors
		// See https://github.com/eslint/eslint/discussions/17412
		ignores: [
			"dist",
			"external"
		]
	},

	{
		files: [
			"*.js",
			"*.cjs"
		],
		languageOptions: {
			ecmaVersion: 6,
			sourceType: "script",
			globals: {
				...globals.node
			}
		},
		rules: {
			...jqueryConfig.rules,
			strict: [ "error", "global" ],

			// Increase max-len to 150 for now, there are too many violations and the rule
			// is not auto-fixable.
			// "max-len": [
			// 	"error",
			// 	{
			// 		"code": 150,
			// 		"ignoreComments": true
			// 	}
			// ]
		}
	},

	{
		files: [
			"build",
			"test/runner/**/*"
		],
		ignores: [
			"test/runner/listeners.js"
		],
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: "module",
			globals: {
				...globals.node
			}
		},
		rules: {
			...jqueryConfig.rules,
			strict: [ "error", "global" ],

			// Increase max-len to 150 for now, there are too many violations and the rule
			// is not auto-fixable.
			// "max-len": [
			// 	"error",
			// 	{
			// 		"code": 150,
			// 		"ignoreComments": true
			// 	}
			// ]
		}
	},

	{
		files: [
			"test/runner/listeners.js"
		],
		languageOptions: {
			ecmaVersion: 5,
			sourceType: "script",
			globals: {
				...globals.browser,
				QUnit: false,
				Symbol: false
			}
		},
		rules: {
			...jqueryConfig.rules,
			strict: [ "error", "function" ],

		}
	},

	{
		files: [
			"jquery.color.*",
			"test/**/*"
		],
		ignores: [
			"test/runner/**/*"
		],
		languageOptions: {
			ecmaVersion: 5,
			sourceType: "script",
			globals: {
				...globals.browser,
				"jQuery": true,
				"define": true,
				"require": true,
				"module": true
			}
		},
		rules: {
			...jqueryConfig.rules,
			strict: [ "error", "function" ]
		}
	},

	{
		files: [
			"test/**/*"
		],
		ignores: [
			"test/runner/**/*"
		],
		languageOptions: {
			globals: {
				"QUnit": true
			}
		},
		rules: {
			strict: [ "error", "global" ],

			// Increase max-len to 150 for now, there are too many violations
			// and the rule is not auto-fixable.
			"max-len": [
				"error",
				{
					"code": 150,
					"ignoreComments": true
				}
			]
		}
	}
];
