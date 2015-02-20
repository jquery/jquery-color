/*jshint node: true */
module.exports = function( grunt ) {

"use strict";

var max = [ "dist/jquery.color.js", "dist/jquery.color.svg-names.js" ],
	min = [ "dist/jquery.color.min.js", "dist/jquery.color.svg-names.min.js", "dist/jquery.color.plus-names.min.js"],
	combined = "dist/jquery.color.plus-names.js",
	minify = {
		main: {
			options: {
				banner: "/*! jQuery Color v@<%= pkg.version %> http://github.com/jquery/jquery-color | jquery.org/license */\n"
			},
			files: {}
		},
		svg: {
			options: {
				banner: "/*! jQuery Color v@<%= pkg.version %> SVG Color Names http://github.com/jquery/jquery-color | jquery.org/license */\n"
			},
			files: {}
		},
		combined: {
			options: {
				banner: "/*! jQuery Color v@<%= pkg.version %> with SVG Color Names http://github.com/jquery/jquery-color | jquery.org/license */\n"
			},
			files: {}
		}
	},
	concat = {};

minify.main.files[ min[ 0 ] ] = [ max[ 0 ] ];
minify.svg.files[ min[ 1 ] ] = [ max[ 1 ] ];
minify.combined.files[ min[ 2 ] ] = [ combined ];
concat[ combined ] = [ max[ 0 ], max[ 1 ] ];

grunt.loadNpmTasks( "grunt-bowercopy" );
grunt.loadNpmTasks( "grunt-compare-size" );
grunt.loadNpmTasks( "grunt-contrib-concat" );
grunt.loadNpmTasks( "grunt-contrib-jshint" );
grunt.loadNpmTasks( "grunt-contrib-qunit" );
grunt.loadNpmTasks( "grunt-contrib-uglify" );
grunt.loadNpmTasks( "grunt-git-authors" );

grunt.initConfig({
	pkg: grunt.file.readJSON( "package.json" ),

	bowercopy: {
		all: {
			options: {
				destPrefix: "external"
			},
			files: {
				"qunit/qunit.js": "qunit/qunit/qunit.js",
				"qunit/qunit.css": "qunit/qunit/qunit.css",
				"qunit/MIT-LICENSE.txt": "qunit/MIT-LICENSE.txt",

				"jquery-1.5.0/jquery.js": "jquery-1.5.0/jquery.js",
				"jquery-1.5.0/MIT-LICENSE.txt": "jquery-1.5.0/MIT-LICENSE.txt",

				"jquery-1.5.1/jquery.js": "jquery-1.5.1/jquery.js",
				"jquery-1.5.1/MIT-LICENSE.txt": "jquery-1.5.1/MIT-LICENSE.txt",

				"jquery-1.5.2/jquery.js": "jquery-1.5.2/jquery.js",
				"jquery-1.5.2/MIT-LICENSE.txt": "jquery-1.5.2/MIT-LICENSE.txt",

				"jquery-1.6.0/jquery.js": "jquery-1.6.0/jquery.js",
				"jquery-1.6.0/MIT-LICENSE.txt": "jquery-1.6.0/MIT-LICENSE.txt",

				"jquery-1.6.1/jquery.js": "jquery-1.6.1/jquery.js",
				"jquery-1.6.1/MIT-LICENSE.txt": "jquery-1.6.1/MIT-LICENSE.txt",

				"jquery-1.6.2/jquery.js": "jquery-1.6.2/jquery.js",
				"jquery-1.6.2/MIT-LICENSE.txt": "jquery-1.6.2/MIT-LICENSE.txt",

				"jquery-1.6.3/jquery.js": "jquery-1.6.3/jquery.js",
				"jquery-1.6.3/MIT-LICENSE.txt": "jquery-1.6.3/MIT-LICENSE.txt",

				"jquery-1.6.4/jquery.js": "jquery-1.6.4/jquery.js",
				"jquery-1.6.4/MIT-LICENSE.txt": "jquery-1.6.4/MIT-LICENSE.txt",

				"jquery-1.7.0/jquery.js": "jquery-1.7.0/jquery.js",
				"jquery-1.7.0/MIT-LICENSE.txt": "jquery-1.7.0/MIT-LICENSE.txt",

				"jquery-1.7.1/jquery.js": "jquery-1.7.1/jquery.js",
				"jquery-1.7.1/MIT-LICENSE.txt": "jquery-1.7.1/MIT-LICENSE.txt",

				"jquery-1.7.2/jquery.js": "jquery-1.7.2/jquery.js",
				"jquery-1.7.2/MIT-LICENSE.txt": "jquery-1.7.2/MIT-LICENSE.txt",

				"jquery-1.8.0/jquery.js": "jquery-1.8.0/jquery.js",
				"jquery-1.8.0/MIT-LICENSE.txt": "jquery-1.8.0/MIT-LICENSE.txt",

				"jquery-1.8.1/jquery.js": "jquery-1.8.1/jquery.js",
				"jquery-1.8.1/MIT-LICENSE.txt": "jquery-1.8.1/MIT-LICENSE.txt",

				"jquery-1.8.2/jquery.js": "jquery-1.8.2/jquery.js",
				"jquery-1.8.2/MIT-LICENSE.txt": "jquery-1.8.2/MIT-LICENSE.txt",

				"jquery-1.8.3/jquery.js": "jquery-1.8.3/jquery.js",
				"jquery-1.8.3/MIT-LICENSE.txt": "jquery-1.8.3/MIT-LICENSE.txt",

				"jquery-1.9.0/jquery.js": "jquery-1.9.0/jquery.js",
				"jquery-1.9.0/MIT-LICENSE.txt": "jquery-1.9.0/MIT-LICENSE.txt",

				"jquery-1.9.1/jquery.js": "jquery-1.9.1/jquery.js",
				"jquery-1.9.1/MIT-LICENSE.txt": "jquery-1.9.1/MIT-LICENSE.txt",

				"jquery-1.10.0/jquery.js": "jquery-1.10.0/jquery.js",
				"jquery-1.10.0/MIT-LICENSE.txt": "jquery-1.10.0/MIT-LICENSE.txt",

				"jquery-1.10.1/jquery.js": "jquery-1.10.1/jquery.js",
				"jquery-1.10.1/MIT-LICENSE.txt": "jquery-1.10.1/MIT-LICENSE.txt",

				"jquery-1.10.2/jquery.js": "jquery-1.10.2/jquery.js",
				"jquery-1.10.2/MIT-LICENSE.txt": "jquery-1.10.2/MIT-LICENSE.txt",

				"jquery-1.11.0/jquery.js": "jquery-1.11.0/dist/jquery.js",
				"jquery-1.11.0/MIT-LICENSE.txt": "jquery-1.11.0/MIT-LICENSE.txt",

				"jquery-1.11.1/jquery.js": "jquery-1.11.1/dist/jquery.js",
				"jquery-1.11.1/MIT-LICENSE.txt": "jquery-1.11.1/MIT-LICENSE.txt",

				"jquery-2.0.0/jquery.js": "jquery-2.0.0/jquery.js",
				"jquery-2.0.0/MIT-LICENSE.txt": "jquery-2.0.0/MIT-LICENSE.txt",

				"jquery-2.0.1/jquery.js": "jquery-2.0.1/jquery.js",
				"jquery-2.0.1/MIT-LICENSE.txt": "jquery-2.0.1/MIT-LICENSE.txt",

				"jquery-2.0.2/jquery.js": "jquery-2.0.2/jquery.js",
				"jquery-2.0.2/MIT-LICENSE.txt": "jquery-2.0.2/MIT-LICENSE.txt",

				"jquery-2.0.3/jquery.js": "jquery-2.0.3/jquery.js",
				"jquery-2.0.3/MIT-LICENSE.txt": "jquery-2.0.3/MIT-LICENSE.txt",

				"jquery-2.1.0/jquery.js": "jquery-2.1.0/dist/jquery.js",
				"jquery-2.1.0/MIT-LICENSE.txt": "jquery-2.1.0/MIT-LICENSE.txt",

				"jquery-2.1.1/jquery.js": "jquery-2.1.1/dist/jquery.js",
				"jquery-2.1.1/MIT-LICENSE.txt": "jquery-2.1.1/MIT-LICENSE.txt",
			}
		}
	},

	jshint: {
		options: {
			jshintrc: true
		},
		src: [ "jquery.color.js", "jquery.color.svg-names.js" ],
		grunt: "Gruntfile.js",
		test: "test/unit/**"
	},

	qunit: {
		files: "test/index.html"
	},

	concat: concat,

	uglify: minify,

	compare_size: {
		"color": [ max[ 0 ], min[ 0 ] ],
		"svg-names": [ max[ 1 ], min[ 1 ] ],
		"combined": [ combined, min[ 2 ] ]
	}
});



function gitDate( fn ) {
	grunt.util.spawn({
		cmd: "git",
		args: [ "log", "-1", "--pretty=format:%ad" ]
	}, function( error, result ) {
		if ( error ) {
			grunt.log.error( error );
			return fn( error );
		}

		fn( null, result );
	});
}

grunt.registerTask( "max", function() {
	var done = this.async(),
		version = grunt.config( "pkg.version" );

	if ( process.env.COMMIT ) {
		version += " " + process.env.COMMIT;
	}
	gitDate(function( error, date ) {
		if ( error ) {
			return done( false );
		}

		max.forEach( function( dist ) {
			grunt.file.copy( dist.replace( "dist/", "" ), dist, {
				process: function( source ) {
					return source
						.replace( /@VERSION/g, version )
						.replace( /@DATE/g, date );
				}
			});
		});


		done();
	});
});

grunt.registerTask( "testswarm", function( commit, configFile ) {
	var testswarm = require( "testswarm" ),
		config = grunt.file.readJSON( configFile ).jquerycolor,
		done = this.async();
	testswarm.createClient( {
		url: config.swarmUrl
	} )
	.addReporter( testswarm.reporters.cli )
	.auth( {
		id: config.authUsername,
		token: config.authToken
	})
	.addjob(
		{
			name: "Commit <a href='https://github.com/jquery/jquery-color/commit/" + commit + "'>" + commit.substr( 0, 10 ) + "</a>",
			runs: {
				"jQuery color": config.testUrl + commit + "/test/index.html"
			},
			runMax: config.runMax,
			browserSets: config.browserSets
		}, function( err, passed ) {
			if ( err ) {
				grunt.log.error( err );
			}
			done( passed );
		}
	);
});

grunt.registerTask( "manifest", function() {
	var pkg = grunt.config( "pkg" );
	grunt.file.write( "color.jquery.json", JSON.stringify({
		name: "color",
		title: pkg.title,
		description: pkg.description,
		keywords: pkg.keywords,
		version: pkg.version,
		author: {
			name: pkg.author.name,
			url: pkg.author.url.replace( "master", pkg.version )
		},
		maintainers: pkg.maintainers,
		licenses: pkg.licenses.map(function( license ) {
			license.url = license.url.replace( "master", pkg.version );
			return license;
		}),
		bugs: pkg.bugs,
		homepage: pkg.homepage,
		docs: pkg.homepage,
		download: "http://code.jquery.com/#color",
		dependencies: {
			jquery: ">=1.5"
		}
	}, null, "\t" ) );
});

grunt.registerTask( "default", [ "jshint", "qunit", "build", "compare_size" ] );
grunt.registerTask( "build", [ "max", "concat", "uglify" ] );

};
