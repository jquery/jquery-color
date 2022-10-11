module.exports = grunt => {

"use strict";

const isBrowserStack = !!( process.env.BROWSER_STACK_USERNAME &&
	process.env.BROWSER_STACK_ACCESS_KEY );
const max = [
	"dist/jquery.color.js",
	"dist/jquery.color.svg-names.js"
];
const min = [
	"dist/jquery.color.min.js",
	"dist/jquery.color.svg-names.min.js",
	"dist/jquery.color.plus-names.min.js"
];
const combined = "dist/jquery.color.plus-names.js";
const minify = {
	main: {
		options: {
			banner: "/*! jQuery Color v<%= pkg.version %> http://github.com/jquery/jquery-color | jquery.org/license */\n"
		},
		files: {}
	},
	svg: {
		options: {
			banner: "/*! jQuery Color v<%= pkg.version %> SVG Color Names http://github.com/jquery/jquery-color | jquery.org/license */\n"
		},
		files: {}
	},
	combined: {
		options: {
			banner: "/*! jQuery Color v<%= pkg.version %> with SVG Color Names http://github.com/jquery/jquery-color | jquery.org/license */\n"
		},
		files: {}
	}
};
const concat = {};

minify.main.files[ min[ 0 ] ] = [ max[ 0 ] ];
minify.svg.files[ min[ 1 ] ] = [ max[ 1 ] ];
minify.combined.files[ min[ 2 ] ] = [ combined ];
concat[ combined ] = [ max[ 0 ], max[ 1 ] ];

const oldNode = /^v10\./.test( process.version );

// Support: Node.js <12
// Skip running tasks that dropped support for Node.js 10
// in this Node version.
function runIfNewNode( task ) {
	return oldNode ? "print_old_node_message:" + task : task;
}

require( "load-grunt-tasks" )( grunt, {
	pattern: oldNode ? [ "grunt-*", "!grunt-eslint" ] : [ "grunt-*" ]
} );

grunt.initConfig( {
	pkg: grunt.file.readJSON( "package.json" ),

	tests: {
		jquery: [
			"git",
			"git.min"
		],
		"jquery-color": [
			"3.x-git",
			"3.x-git.min",
			"3.6.1",
			"3.5.1",
			"3.4.1",
			"3.3.1",
			"3.2.1",
			"3.1.1",
			"3.0.0",
			"2.2.4",
			"2.1.4",
			"2.0.3",
			"1.12.4",
			"1.11.3",
			"1.10.2",
			"1.9.1",
			"1.8.3"
		]
	},

	npmcopy: {
		options: {
			destPrefix: "external"
		},
		legacy: {
			options: {

				// jQuery `<1.11` and `>=2 <2.1` wasn't published on npm, so
				// we maintain their copies directly in the repository.
				srcPrefix: "external-legacy-source"
			},
			files: {
				"jquery-1.8.3/jquery.js": "jquery-1.8.3/jquery.js",
				"jquery-1.8.3/MIT-LICENSE.txt": "jquery-1.8.3/MIT-LICENSE.txt",

				"jquery-1.9.1/jquery.js": "jquery-1.9.1/jquery.js",
				"jquery-1.9.1/MIT-LICENSE.txt": "jquery-1.9.1/MIT-LICENSE.txt",

				"jquery-1.10.2/jquery.js": "jquery-1.10.2/jquery.js",
				"jquery-1.10.2/MIT-LICENSE.txt": "jquery-1.10.2/MIT-LICENSE.txt",

				"jquery-2.0.3/jquery.js": "jquery-2.0.3/jquery.js",
				"jquery-2.0.3/MIT-LICENSE.txt": "jquery-2.0.3/MIT-LICENSE.txt"
			}
		},
		modern: {
			files: {
				"qunit/qunit.js": "qunit/qunit/qunit.js",
				"qunit/qunit.css": "qunit/qunit/qunit.css",
				"qunit/LICENSE.txt": "qunit/LICENSE.txt",

				"jquery-1.11.3/jquery.js": "jquery-1.11.3/dist/jquery.js",
				"jquery-1.11.3/MIT-LICENSE.txt": "jquery-1.11.3/MIT-LICENSE.txt",

				"jquery-1.12.4/jquery.js": "jquery-1.12.4/dist/jquery.js",
				"jquery-1.12.4/LICENSE.txt": "jquery-1.12.4/LICENSE.txt",

				"jquery-2.1.4/jquery.js": "jquery-2.1.4/dist/jquery.js",
				"jquery-2.1.4/MIT-LICENSE.txt": "jquery-2.1.4/MIT-LICENSE.txt",

				"jquery-2.2.4/jquery.js": "jquery-2.2.4/dist/jquery.js",
				"jquery-2.2.4/LICENSE.txt": "jquery-2.2.4/LICENSE.txt",

				"jquery-3.0.0/jquery.js": "jquery-3.0.0/dist/jquery.js",
				"jquery-3.0.0/LICENSE.txt": "jquery-3.0.0/LICENSE.txt",

				"jquery-3.1.1/jquery.js": "jquery-3.1.1/dist/jquery.js",
				"jquery-3.1.1/LICENSE.txt": "jquery-3.1.1/LICENSE.txt",

				"jquery-3.2.1/jquery.js": "jquery-3.2.1/dist/jquery.js",
				"jquery-3.2.1/LICENSE.txt": "jquery-3.2.1/LICENSE.txt",

				"jquery-3.3.1/jquery.js": "jquery-3.3.1/dist/jquery.js",
				"jquery-3.3.1/LICENSE.txt": "jquery-3.3.1/LICENSE.txt",

				"jquery-3.4.1/jquery.js": "jquery-3.4.1/dist/jquery.js",
				"jquery-3.4.1/LICENSE.txt": "jquery-3.4.1/LICENSE.txt",

				"jquery-3.5.1/jquery.js": "jquery-3.5.1/dist/jquery.js",
				"jquery-3.5.1/LICENSE.txt": "jquery-3.5.1/LICENSE.txt",

				"jquery-3.6.1/jquery.js": "jquery-3.6.1/dist/jquery.js",
				"jquery-3.6.1/LICENSE.txt": "jquery-3.6.1/LICENSE.txt",

				"jquery/jquery.js": "jquery/dist/jquery.js",
				"jquery/LICENSE.txt": "jquery/LICENSE.txt"
			}
		}
	},

	eslint: {
		options: {

			// See https://github.com/sindresorhus/grunt-eslint/issues/119
			quiet: true
		},

		source: {
			src: [ "jquery.color.js", "jquery.color.svg-names.js" ]
		},
		grunt: {
			src: "Gruntfile.js"
		},
		test: {
			src: "test/unit/**"
		}
	},

	karma: {
		options: {
			configFile: "test/karma/karma.conf.js",
			singleRun: true
		},
		local: {
			browsers: [ "ChromeHeadless", "FirefoxHeadless" ]
		},
		"browserstack-current": {
			browsers: [
				"bs_chrome-current",
				"bs_firefox-current",
				"bs_edge-current",
				"bs_ie-11",
				"bs_opera",
				"bs_safari-current",
				"bs_ios-current",
				"bs_android"
			]
		},
		"browserstack-legacy": {
			browsers: [
				"bs_chrome-previous",
				"bs_firefox-esr",
				"bs_firefox-previous",
				"bs_edge-18",
				"bs_edge-previous",
				"bs_ie-9",
				"bs_ie-10",
				"bs_safari-previous",
				"bs_ios-two_versions_back",
				"bs_ios-previous"
			]
		}
	},

	qunit: {
		files: "test/index.html",
		options: {
			puppeteer: {
				args: process.env.JENKINS_HOME ?
					[ "--no-sandbox", "--disable-setuid-sandbox" ] :
					[]
			}
		}
	},

	concat: concat,

	uglify: minify,

	compare_size: {
		"color": [ max[ 0 ], min[ 0 ] ],
		"svg-names": [ max[ 1 ], min[ 1 ] ],
		"combined": [ combined, min[ 2 ] ]
	}
} );


function gitDate( fn ) {
	grunt.util.spawn( {
		cmd: "git",
		args: [ "log", "-1", "--pretty=format:%ad" ]
	}, function( error, result ) {
		if ( error ) {
			grunt.log.error( error );
			return fn( error );
		}

		fn( null, result );
	} );
}

grunt.registerTask( "max", function() {
	const done = this.async();
	let version = grunt.config( "pkg.version" );

	if ( process.env.COMMIT ) {
		version += " " + process.env.COMMIT;
	}
	gitDate( function( error, date ) {
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
			} );
		} );


		done();
	} );
} );

grunt.registerTask( "testswarm", function( commit, configFile, projectName, browserSets,
	timeout ) {
	let config, tests;
	const testswarm = require( "testswarm" );
	const runs = {};
	const done = this.async();

	projectName = projectName || "jquerycolor";
	config = grunt.file.readJSON( configFile )[ projectName ];
	browserSets = browserSets || config.browserSets;
	if ( browserSets[ 0 ] === "[" ) {

		// We got an array, parse it
		browserSets = JSON.parse( browserSets );
	}
	timeout = timeout || 1000 * 60 * 15;

	tests = grunt.config( "tests" )[
		Array.isArray( browserSets ) ? browserSets[ 0 ] : browserSets ||
			"jquery" ];

	tests.forEach( jQueryVersion => {
		runs[ jQueryVersion ] = config.testUrl + commit +
			"/test/index.html?jquery=" + jQueryVersion;
	} );

	testswarm.createClient( {
		url: config.swarmUrl
	} )
	.addReporter( testswarm.reporters.cli )
	.auth( {
		id: config.authUsername,
		token: config.authToken
	} )
	.addjob(
		{
			name: "Commit <a href='https://github.com/jquery/jquery-color/commit/" + commit + "'>" + commit.substr( 0, 10 ) + "</a>",
			runs: runs,
			runMax: config.runMax,
			browserSets: browserSets,
			timeout: timeout
		}, ( err, passed ) => {
			if ( err ) {
				grunt.log.error( err );
			}
			done( passed );
		}
	);
} );

grunt.registerTask( "print_no_browserstack_legacy_message", () => {
	grunt.log.writeln( "No BrowserStack credentials detected, running " +
		"tests on legacy browsers skipped..." );
} );

grunt.registerTask( "print_old_node_message", ( ...args ) => {
	const task = args.join( ":" );
	grunt.log.writeln( "Old Node.js detected, running the task \"" + task + "\" skipped..." );
} );

grunt.registerTask( "default", [
	runIfNewNode( "eslint" ),
	"npmcopy",
	"qunit",
	"build",
	"compare_size"
] );
grunt.registerTask( "jenkins", [
	"npmcopy",
	"build",
	"compare_size"
] );
grunt.registerTask( "build", [ "max", "concat", "uglify" ] );
grunt.registerTask( "ci", [ "default" ] );
grunt.registerTask( "karma-browserstack-current", [
	"build",
	isBrowserStack ? "karma:browserstack-current" : "karma:local"
] );
grunt.registerTask( "karma-browserstack-legacy", isBrowserStack ? [
	"build",
	"karma:browserstack-legacy"
] : [ "print_no_browserstack_legacy_message" ] );

};
