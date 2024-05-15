"use strict";

QUnit.config.urlConfig.push( {
	id: "jquery",
	label: "jQuery version",

	// Keep in sync with test/runner/flags/jquery.js
	value: [
		"1.12.4",
		"2.2.4",
		"3.0.0", "3.1.1", "3.2.1", "3.3.1", "3.4.1", "3.5.1", "3.6.4", "3.7.1",
		"3.x-git", "git"
	],
	tooltip: "Which jQuery Core version to test against"
} );
