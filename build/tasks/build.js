import fs from "node:fs/promises";
import util from "node:util";
import { exec as nodeExec } from "node:child_process";
import minify from "./minify.js";
import getTimestamp from "./lib/getTimestamp.js";

const exec = util.promisify( nodeExec );

async function readJSON( filename ) {
	return JSON.parse( await fs.readFile( filename, "utf8" ) );
}

async function isCleanWorkingDir() {
	const { stdout } = await exec( "git status --untracked-files=no --porcelain" );
	return !stdout.trim();
}

async function getLastModifiedDate() {
	const { stdout } = await exec( "git log -1 --format=\"%at\"" );
	return new Date( parseInt( stdout, 10 ) * 1000 );
}

export async function build( { version = process.env.VERSION } = {} ) {
	const dir = "dist";
	const pkg = await readJSON( "package.json" );

	// Add the short commit hash to the version string
	// when the version is not for a release.
	if ( !version ) {
		const { stdout } = await exec( "git rev-parse --short HEAD" );
		const isClean = await isCleanWorkingDir();

		// "+SHA" is semantically correct
		// Add ".dirty" as well if the working dir is not clean
		version = `${ pkg.version }+${ stdout.trim() }${
			isClean ? "" : ".dirty"
		}`;
	}

	// Use the last modified date so builds are reproducible
	const date = await getLastModifiedDate();

	const sourceFiles = [
		"jquery.color.js",
		"jquery.color.svg-names.js"
	];

	await fs.mkdir( dir, { recursive: true } );

	for ( const filename of sourceFiles ) {
		const source = await fs.readFile( filename, "utf8" );
		const compiledContents = source

			// Embed Version
			.replace( /@VERSION/g, version )

			// Embed Date
			// yyyy-mm-ddThh:mmZ
			.replace( /@DATE/g, date.toISOString().replace( /:\d+\.\d+Z$/, "Z" ) );

		await fs.writeFile( `${ dir }/${ filename }`, compiledContents );
		console.log( `[${ getTimestamp() }] ${ filename } v${ version } created.` );
	}

	const colorContents = await fs.readFile( `${ dir }/jquery.color.js`, "utf8" );
	const svgContents = await fs.readFile( `${ dir }/jquery.color.svg-names.js`, "utf8" );
	await fs.writeFile( `${ dir }/jquery.color.plus-names.js`, colorContents + svgContents );
	console.log(
		`[${ getTimestamp() }] ${ dir }/jquery.color.plus-names.js v${ version } created.`
	);

	await minify( {
		dir,
		filename: "jquery.color.js",
		banner: `/*! jQuery Color v${ version } https://github.com/jquery/jquery-color | jquery.org/license */\n`
	} );

	await minify( {
		dir,
		filename: "jquery.color.svg-names.js",
		banner: `/*! jQuery Color v${ version } SVG Color Names https://github.com/jquery/jquery-color | jquery.org/license */\n`
	} );

	await minify( {
		dir,
		filename: "jquery.color.plus-names.js",
		banner: `/*! jQuery Color v${ version } with SVG Color Names https://github.com/jquery/jquery-color | jquery.org/license */\n`
	} );

	console.log( `[${ getTimestamp() }] Build complete.` );
}
