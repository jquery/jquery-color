"use strict";

module.exports = function( Release ) {
	var shell = require( "shelljs" ),
		cdnFolder = "dist/cdn",
		distFiles = [
			"dist/jquery.color.js",
			"dist/jquery.color.min.js",
			"dist/jquery.color.plus-names.js",
			"dist/jquery.color.plus-names.min.js",
			"dist/jquery.color.svg-names.js",
			"dist/jquery.color.svg-names.min.js"
		],
		releaseFiles = {
			"jquery.color-@VERSION.js": "dist/jquery.color.js",
			"jquery.color-@VERSION.min.js": "dist/jquery.color.min.js",
			"jquery.color.plus-names-@VERSION.js": "dist/jquery.color.plus-names.js",
			"jquery.color.plus-names-@VERSION.min.js": "dist/jquery.color.plus-names.min.js",
			"jquery.color.svg-names-@VERSION.js": "dist/jquery.color.svg-names.js",
			"jquery.color.svg-names-@VERSION.min.js": "dist/jquery.color.svg-names.min.js"
		};

	function makeReleaseCopies( Release ) {
		shell.mkdir( "-p", cdnFolder );

		Object.keys( releaseFiles ).forEach( function( key ) {
			var builtFile = releaseFiles[ key ],
				unpathedFile = key.replace( /@VERSION/g, Release.newVersion ),
				releaseFile = cdnFolder + "/" + unpathedFile;

			shell.cp( "-f", builtFile, releaseFile );
		} );
	}

	Release.define( {
		npmPublish: true,
		issueTracker: "github",
		cdnPublish: cdnFolder,

		changelogShell: function() {
			return "# Changelog for jQuery Color v" + Release.newVersion + "\n";
		},

		/**
		 * Generates any release artifacts that should be included in the release.
		 * The callback must be invoked with an array of files that should be
		 * committed before creating the tag.
		 * @param {Function} callback
		 */
		generateArtifacts: function( callback ) {
			Release.exec( "grunt", "Grunt command failed" );
			makeReleaseCopies( Release );
			callback( distFiles );
		}
	} );
};

module.exports.dependencies = [
	"shelljs@0.8.4"
];
