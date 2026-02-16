import fs from "node:fs/promises";
import path from "node:path";

const projectDir = path.resolve( "." );

const files = {
	"qunit/qunit.js": "qunit/qunit/qunit.js",
	"qunit/qunit.css": "qunit/qunit/qunit.css",
	"qunit/LICENSE.txt": "qunit/LICENSE.txt",

	"jquery-1.12.4/jquery.js": "jquery-1.12.4/dist/jquery.js",
	"jquery-1.12.4/LICENSE.txt": "jquery-1.12.4/LICENSE.txt",

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

	"jquery-3.6.4/jquery.js": "jquery-3.6.4/dist/jquery.js",
	"jquery-3.6.4/LICENSE.txt": "jquery-3.6.4/LICENSE.txt",

	"jquery-3.7.1/jquery.js": "jquery-3.7.1/dist/jquery.js",
	"jquery-3.7.1/LICENSE.txt": "jquery-3.7.1/LICENSE.txt",

	"jquery-4.0.0/jquery.js": "jquery-4.0.0/dist/jquery.js",
	"jquery-4.0.0/LICENSE.txt": "jquery-4.0.0/LICENSE.txt",

	"jquery/jquery.js": "jquery/dist/jquery.js",
	"jquery/LICENSE.txt": "jquery/LICENSE.txt"
};

async function npmcopy() {
	await fs.mkdir( path.resolve( projectDir, "external" ), {
		recursive: true
	} );
	for ( const [ dest, source ] of Object.entries( files ) ) {
		const from = path.resolve( projectDir, "node_modules", source );
		const to = path.resolve( projectDir, "external", dest );
		const toDir = path.dirname( to );
		await fs.mkdir( toDir, { recursive: true } );
		await fs.copyFile( from, to );
		console.log( `${ source } → ${ dest }` );
	}
}

npmcopy();
