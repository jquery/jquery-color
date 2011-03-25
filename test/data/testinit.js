var jQuery = this.jQuery || "jQuery", // For testing .noConflict()
	$ = this.$ || "$",
	originaljQuery = jQuery,
	original$ = $;

/**
 * Returns an array of elements with the given IDs, eg.
 * @example q("main", "foo", "bar")
 * @result [<div id="main">, <span id="foo">, <input id="bar">]
 */
function q() {
	var r = [];

	for ( var i = 0; i < arguments.length; i++ ) {
		r.push( document.getElementById( arguments[i] ) );
	}

	return r;
}

/**
 * Asserts that a select matches the given IDs * @example t("Check for something", "//[a]", ["foo", "baar"]);
 * @result returns true if "//[a]" return two elements with the IDs 'foo' and 'baa
r'
 */
function t(a,b,c) {
	var f = jQuery(b).get(), s = "";

	for ( var i = 0; i < f.length; i++ ) {
		s += (s && ",") + '"' + f[i].id + '"';
	}

	same(f, q.apply(q,c), a + " (" + b + ")");
}

function moduleTeardown(){}
