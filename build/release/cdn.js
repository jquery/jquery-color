import fs from "node:fs/promises";
import path from "node:path";
import { argv } from "node:process";

const version = argv[ 2 ];
if ( !version ) {
	throw new Error( "Version argument is required" );
}

// The cdn repo is cloned during release
const cdnRepoFolder = "tmp/release/cdn";
const cdnFolder = path.join( cdnRepoFolder, "cdn" );

const releaseFiles = {
	"jquery.color-@VERSION.js": "dist/jquery.color.js",
	"jquery.color-@VERSION.min.js": "dist/jquery.color.min.js",
	"jquery.color.plus-names-@VERSION.js": "dist/jquery.color.plus-names.js",
	"jquery.color.plus-names-@VERSION.min.js": "dist/jquery.color.plus-names.min.js",
	"jquery.color.svg-names-@VERSION.js": "dist/jquery.color.svg-names.js",
	"jquery.color.svg-names-@VERSION.min.js": "dist/jquery.color.svg-names.min.js"
};

await fs.mkdir( cdnFolder, { recursive: true } );

for ( const [ key, source ] of Object.entries( releaseFiles ) ) {
	const dest = path.join( cdnFolder, key.replace( /@VERSION/g, version ) );
	await fs.copyFile( source, dest );
	console.log( `${ source } → ${ dest }` );
}
