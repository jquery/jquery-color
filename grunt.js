/*jshint node: true */
module.exports = function( grunt ) {

var max = "dist/jquery.color.js",
	min = "dist/jquery.color.min.js",
	minify = {};

minify[ min ] = [ "<banner>", max ];

grunt.loadNpmTasks( "grunt-compare-size" );

grunt.initConfig({
	pkg: "<json:package.json>",

	meta: {
		banner: "/*! jQuery Color v@<%= pkg.version %> http://github.com/jquery/jquery-color | jquery.org/license */"
	},

	lint: {
		src: "jquery.color.js",
		test: "test/unit/**"
	},

	jshint: (function() {
		function parserc( path ) {
			var rc = grunt.file.readJSON( (path || "") + ".jshintrc" ),
				settings = {
					options: rc,
					globals: {}
				};

			(rc.predef || []).forEach(function( prop ) {
				settings.globals[ prop ] = true;
			});
			delete rc.predef;

			return settings;
		}

		return {
			src: parserc(),
			test: parserc( "test/unit/" )
		};
	})(),

	qunit: {
		files: "test/index.html"
	},

	min: minify,

	compare_size: {
		files: [ max, min ]
	}
});

grunt.registerHelper( "git-date", function( fn ) {
	grunt.utils.spawn({
		cmd: "git",
		args: [ "log", "-1", "--pretty=format:%ad" ]
	}, function( error, result ) {
		if ( error ) {
			grunt.log.error( error );
			return fn( error );
		}

		fn( null, result );
	});
});

grunt.registerTask( "submodules", function() {
	var done = this.async();

	grunt.verbose.write( "Updating submodules..." );

	grunt.utils.spawn({
		cmd: "git",
		args: [ "submodule", "update", "--init" ]
	}, function( err, result ) {
		if ( err ) {
			grunt.verbose.error();
			done( err );
			return;
		}

		grunt.log.writeln( result );

		done();
	});
});

grunt.registerTask( "max", function() {
	var done = this.async();
	grunt.helper( "git-date", function( error, date ) {
		if ( error ) {
			return done( false );
		}

		grunt.file.copy( "jquery.color.js", max, {
			process: function( source ) {
				return source
					.replace( /@VERSION/g, grunt.config( "pkg.version" ) )
					.replace( /@DATE/g, date );
			}
		});

		done();
	});
});

grunt.registerTask( "testswarm", function( commit, configFile ) {
	var testswarm = require( "testswarm" ),
		config = grunt.file.readJSON( configFile ).jquerycolor;
	config.jobName = 'jQuery Color commit #<a href="https://github.com/jquery/jquery-color/commit/' + commit + '">' + commit.substr( 0, 10 ) + '</a>';
	config["runNames[]"] = "jQuery color";
	config["runUrls[]"] = config.testUrl + commit + "/test/index.html";
	config["browserSets[]"] = ["popular"];
	testswarm({
		url: config.swarmUrl,
		pollInterval: 10000,
		timeout: 1000 * 60 * 10,
		done: this.async()
	}, config);
});

grunt.registerTask( "default", "lint submodules qunit build compare_size" );
grunt.registerTask( "build", "max min" );

};
