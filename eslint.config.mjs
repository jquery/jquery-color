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
			".release-it.cjs",
			"build/**"
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
			strict: "off"
		}
	},

	{
		files: [
			"jquery.color.*"
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
		languageOptions: {
			ecmaVersion: 5,
			sourceType: "script",
			globals: {
				...globals.browser,
				"jQuery": true,
				"define": true,
				"require": true,
				"module": true,
				"QUnit": true
			}
		},
		rules: {
			...jqueryConfig.rules,
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
