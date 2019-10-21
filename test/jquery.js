( function() {

var parts = document.location.search.slice( 1 ).split( "&" ),
	length = parts.length,
	i = 0,
	current,
	version,
	url;

for ( ; i < length; i++ ) {
	current = parts[ i ].split( "=" );
	if ( current[ 0 ] === "jquery" ) {
		version = current[ 1 ];
		break;
	}
}

if ( version === "git" || version === "3.x-git" ) {
	url = "https://code.jquery.com/jquery-" + version + ".js";
} else {
	url = "../external/jquery-" + ( version || "3.4.1" ) + "/jquery.js";
}

document.write( "<script src='" + url + "'></script>" );

} )();
