"use strict";

QUnit.config.urlConfig.push( {
	id: "jquery",
	label: "jQuery version",
	value: [
		"1.7.2", "1.8.3", "1.9.1", "1.10.2", "1.11.3", "1.12.4",
		"2.0.3", "2.1.4", "2.2.4",
		"3.0.0", "3.1.1", "3.2.1", "3.3.1", "3.4.1", "3.5.1",
		"3.x-git", "git"
	],
	tooltip: "Which jQuery Core version to test against"
} );
