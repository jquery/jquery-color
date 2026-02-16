import fs from "node:fs/promises";
import path from "node:path";
import swc from "@swc/core";
import processForDist from "./dist.js";
import getTimestamp from "./lib/getTimestamp.js";

const rjs = /\.js$/;
const rversion = /jQuery Color Animations v([^\n]+?)(?: - SVG Color Names)?\s*$/m;

export default async function minify( { dir, filename, banner } ) {
	const sourcePath = path.join( dir, filename );
	const minFilename = filename.replace( rjs, ".min.js" );
	const minPath = path.join( dir, minFilename );

	const contents = await fs.readFile( sourcePath, "utf8" );
	const version = rversion.exec( contents )[ 1 ];

	const { code } = await swc.minify(
		contents,
		{
			compress: {
				ecma: 5,
				hoist_funs: false,
				loops: false
			},
			format: {
				ecma: 5,
				asciiOnly: true,
				comments: false,
				preamble: banner
			},
			mangle: true,
			sourceMap: false
		}
	);

	processForDist( contents, filename );
	processForDist( code, minFilename );

	await fs.writeFile( minPath, code );
	console.log(
		`[${ getTimestamp() }] ${ minFilename } v${ version } created.`
	);
}
