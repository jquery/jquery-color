"use strict";

const grunt = require( "grunt" );

module.exports = config => {
	const isCi = process.env.GITHUB_ACTION;
	const dateString = grunt.config( "dateString" );
	const isBrowserStack = !!( process.env.BROWSER_STACK_USERNAME &&
		process.env.BROWSER_STACK_ACCESS_KEY );
	const hostName = isBrowserStack ? "bs-local.com" : "localhost";

	config.set( {
		browserStack: {
			project: "jQuery Color",
			build: "local run" + ( dateString ? ", " + dateString : "" ),
			timeout: 600, // 10 min
			// BrowserStack has a limit of 120 requests per minute. The default
			// "request per second" strategy doesn't scale to so many browsers.
			pollingTimeout: 10000
		},

		// Can't specify path as "../../test" which would be intuitive
		// because if we do, karma will make paths outside "test" folder absolute
		basePath: "../../",

		frameworks: [ "qunit" ],
		plugins: [ "karma-*" ],

		files: [
			"external/jquery/jquery.js",
			"dist/jquery.color.js",
			"test/data/testinit.js",
			"test/unit/color.js"
		],

		// Add BrowserStack launchers
		customLaunchers: require( "./launchers" ),

		// Make GitHub Actions output less verbose
		reporters: isCi ? "dots" : "progress",

		colors: !isCi,

		hostname: hostName,
		port: 9876,

		// Possible values:
		// config.LOG_DISABLE
		// config.LOG_ERROR
		// config.LOG_WARN
		// config.LOG_INFO
		// config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// If browser does not capture in given timeout [ms], kill it
		captureTimeout: 3e5,
		browserNoActivityTimeout: 3e5,
		browserDisconnectTimeout: 3e5,
		browserDisconnectTolerance: 3
	} );

	// Deal with the GitHub Actions environment
	if ( isCi ) {
		config.browserStack.build = "jQuery Color GitHub #" + process.env.GITHUB_RUN_NUMBER;

		// You can't get access to secure environment variables from pull requests
		// so we don't have browserstack from them, but GitHub Actions have headless
		// Firefox so use that.
		// The `GITHUB_BASE_REF` env variable is only available on PRs, see:
		// https://docs.github.com/en/actions/learn-github-actions/environment-variables#default-environment-variables
		if ( !isBrowserStack && process.env.GITHUB_BASE_REF ) {
			config.browsers.push( "FirefoxHeadless" );
		}
	}
};
