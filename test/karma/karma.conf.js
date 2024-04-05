"use strict";

module.exports = config => {
	const isCi = process.env.GITHUB_ACTION;
	const hostName = "localhost";

	config.set( {

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
};
