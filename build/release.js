"use strict";

module.exports = function( Release ) {
	var
		files = [
			"dist/jquery.color.js",
			"dist/jquery.color.min.js",
			"dist/jquery.color.plus-names.js",
			"dist/jquery.color.plus-names.min.js",
			"dist/jquery.color.svg-names.js",
			"dist/jquery.color.svg-names.min.js"
		];

	Release.define( {
		npmPublish: true,
		issueTracker: "github",
		cdnPublish: "dist",

		/**
		 * Generates any release artifacts that should be included in the release.
		 * The callback must be invoked with an array of files that should be
		 * committed before creating the tag.
		 * @param {Function} callback
		 */
		generateArtifacts: function( callback ) {
			Release.exec( "grunt", "Grunt command failed" );
			callback( files );
		}
	} );
};
