"use strict";

module.exports = {
	"bs_firefox-esr": {
		base: "BrowserStack",
		browser: "firefox",
		browser_version: "91.0",
		os: "OS X",
		os_version: "Big Sur"
	},
	"bs_firefox-previous": {
		base: "BrowserStack",
		browser: "firefox",
		browser_version: "94.0",
		os: "OS X",
		os_version: "Monterey"
	},
	"bs_firefox-current": {
		base: "BrowserStack",
		browser: "firefox",
		browser_version: "95.0",
		os: "OS X",
		os_version: "Monterey"
	},

	"bs_chrome-previous": {
		base: "BrowserStack",
		browser: "chrome",
		browser_version: "95.0",
		os: "OS X",
		os_version: "Monterey"
	},
	"bs_chrome-current": {
		base: "BrowserStack",
		browser: "chrome",
		browser_version: "96.0",
		os: "OS X",
		os_version: "Monterey"
	},

	"bs_edge-18": {
		base: "BrowserStack",
		browser: "edge",
		browser_version: "18.0",
		os: "Windows",
		os_version: "10"
	},
	"bs_edge-previous": {
		base: "BrowserStack",
		browser: "edge",
		browser_version: "95",
		os: "Windows",
		os_version: "11"
	},
	"bs_edge-current": {
		base: "BrowserStack",
		browser: "edge",
		browser_version: "96",
		os: "Windows",
		os_version: "11"
	},

	"bs_ie-9": {
		base: "BrowserStack",
		browser: "ie",
		browser_version: "9.0",
		os: "Windows",
		os_version: "7"
	},
	"bs_ie-10": {
		base: "BrowserStack",
		browser: "ie",
		browser_version: "10.0",
		os: "Windows",
		os_version: "8"
	},
	"bs_ie-11": {
		base: "BrowserStack",
		browser: "ie",
		browser_version: "11.0",
		os: "Windows",
		os_version: "8.1"
	},

	"bs_opera": {
		base: "BrowserStack",
		browser: "opera",
		browser_version: "82.0",
		os: "OS X",
		os_version: "Monterey"
	},

	"bs_safari-previous": {
		base: "BrowserStack",
		browser: "safari",
		browser_version: "14",
		os: "OS X",
		os_version: "Big Sur"
	},
	"bs_safari-current": {
		base: "BrowserStack",
		browser: "safari",
		browser_version: "15",
		os: "OS X",
		os_version: "Monterey"
	},

	"bs_ios-two_versions_back": {
		base: "BrowserStack",
		device: "iPhone 11 Pro",
		os: "ios",
		os_version: "13",
		real_mobile: true
	},
	"bs_ios-previous": {
		base: "BrowserStack",
		device: "iPhone 12",
		os: "ios",
		os_version: "14",
		real_mobile: true
	},
	"bs_ios-current": {
		base: "BrowserStack",
		device: "iPhone 13",
		os: "ios",
		os_version: "15",
		real_mobile: true
	},

	"bs_android": {
		base: "BrowserStack",
		device: "Google Pixel 6",
		os: "android",
		os_version: "12.0",
		real_mobile: true
	}
};
