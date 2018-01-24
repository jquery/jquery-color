QUnit.module( "parse" );

function testParts( color, parts, assert ) {
	var prefix = parts.prefix || "";

	if ( parts.expect ) {
		assert.expect( parts.expect );
	}

	jQuery.each( parts, function( key, value ) {

		// these two properties are just helpers for the test function, ignore them
		if ( key === "expect" || key === "prefix" ) {
			return;
		}

		assert.strictEqual( color[ key ](), value, prefix + "." + key + "() is " + value );
	} );
}

function parseTest( str, results, descr ) {
	QUnit.test( descr || "jQuery.Color( \"" + str + "\" )", function( assert ) {
		var color = descr ? str : jQuery.Color( str );
		testParts( color, results, assert );
	} );
}

QUnit.test( "jQuery.Color( 255, 255, 255 )", function( assert ) {
	assert.expect( 4 );
	testParts( jQuery.Color( 255, 255, 255 ), {
		expect: 4,
		red: 255,
		green: 255,
		blue: 255,
		alpha: 1
	}, assert );
} );


QUnit.test( "jQuery.Color({ red: 10, green: 20, blue: 30, alpha: 0.4 })", function( assert ) {
	var blue = jQuery.Color( { red: 10, green: 20, blue: 30, alpha: 0.4 } );
	testParts( blue, {
		red: 10,
		green: 20,
		blue: 30,
		alpha: 0.4
	}, assert );
	assert.ok( !blue._hsla, "No HSLA cache" );
} );

QUnit.test( "jQuery.Color( element, \"color\" )", function( assert ) {
	var $div = jQuery( "<div>" ).css( "color", "#fff" );
	assert.expect( 8 );
	testParts( jQuery.Color( $div, "color" ), {
		prefix: "jQuery(<div>): ",
		red: 255,
		green: 255,
		blue: 255,
		alpha: 1
	}, assert );
	testParts( jQuery.Color( $div[ 0 ], "color" ), {
		prefix: "<div>: ",
		red: 255,
		green: 255,
		blue: 255,
		alpha: 1
	}, assert );
} );

parseTest( jQuery.Color( { red: 100 } ), {
	expect: 4,
	red: 100,
	green: null,
	blue: null,
	alpha: null
}, "jQuery.Color({ red: 100 })" );

QUnit.test( "jQuery.Color({ blue: 100 })", function( assert ) {
	var blue = jQuery.Color( { blue: 100 } );
	testParts( blue, {
		red: null,
		green: null,
		blue: 100,
		alpha: null
	}, assert );
	assert.ok( !blue._hsla, "No HSLA cache" );
} );

QUnit.test( "jQuery.Color({ alpha: 1 })", function( assert ) {
	var blue = jQuery.Color( { alpha: 1 } );
	testParts( blue, {
		red: null,
		green: null,
		blue: null,
		alpha: 1
	}, assert );
	assert.ok( !blue._hsla, "No HSLA cache" );
} );

QUnit.test( "jQuery.Color({ alpha: 0.4 })", function( assert ) {
	var blue = jQuery.Color( { alpha: 0.4 } );
	testParts( blue, {
		red: null,
		green: null,
		blue: null,
		alpha: 0.4
	}, assert );
	assert.ok( !blue._hsla, "No HSLA cache" );
} );

QUnit.test( "jQuery.Color({ alpha: 1, hue: 100 })", function( assert ) {
	var blue = jQuery.Color( { alpha: 1, hue: 100 } );
	testParts( blue, {
		red: null,
		green: null,
		blue: null,
		alpha: 1,
		hue: 100,
		saturation: null,
		lightness: null
	}, assert );
	assert.deepEqual( blue._hsla, [ 100, null, null, 1 ], "HSLA cache has correct values" );
} );

QUnit.test( "jQuery.Color({ hue: 100, saturation: 1, lightness: 0.5 })", function( assert ) {
	var blue = jQuery.Color( { hue: 100, saturation: 1, lightness: 0.5 } );
	testParts( blue, {
		red: 85,
		green: 255,
		blue: 0,
		alpha: 1,
		hue: 100,
		saturation: 1,
		lightness: 0.5
	}, assert );
	assert.deepEqual( blue._rgba, [ 85, 255, 0, 1 ], "RGBA cache has correct values" );
	assert.deepEqual( blue._hsla, [ 100, 1, 0.5, 1 ], "HSLA cache has correct values" );
} );

parseTest( jQuery.Color( jQuery.Color( "red" ) ), {
	expect: 4,
	red: 255,
	green: 0,
	blue: 0,
	alpha: 1
}, "jQuery.Color( jQuery.Color(\"red\") )" );

parseTest( jQuery.Color( [ 255, 255, 255 ] ), {
	expect: 4,
	red: 255,
	green: 255,
	blue: 255,
	alpha: 1
}, "jQuery.Color([ 255, 255, 255 ])" );

parseTest( "", {
	expect: 4,
	red: 255,
	green: 255,
	blue: 255,
	alpha: 1
} );

var sevens = {
	expect: 4,
	red: 119,
	green: 119,
	blue: 119,
	alpha: 1
};
parseTest( "#777", sevens );
parseTest( "#777777", sevens );

var fiftypercent = {
	expect: 4,
	red: 127,
	green: 127,
	blue: 127,
	alpha: 1
}, fiftypercentalpha = {
	expect: 4,
	red: 127,
	green: 127,
	blue: 127,
	alpha: 0.5
};
parseTest( "rgb(127,127,127)", fiftypercent );
parseTest( "rgb(50%,50%,50%)", fiftypercent );
parseTest( "rgba(127,127,127,1)", fiftypercent );
parseTest( "rgba(50%,50%,50%,1)", fiftypercent );
parseTest( "rgba(127,127,127,0.5)", fiftypercentalpha );
parseTest( "rgba(50%,50%,50%,0.5)", fiftypercentalpha );
parseTest( "rgba(127, 127, 127, .5)", fiftypercentalpha );
parseTest( "rgba(50%, 50%, 50%, .5)", fiftypercentalpha );
parseTest( "rgba(0, 0, 0, 0)", {
	expect: 4,
	red: null,
	green: null,
	blue: null,
	alpha: 0
} );

parseTest( "red", {
	expect: 4,
	red: 255,
	green: 0,
	blue: 0,
	alpha: 1
} );

parseTest( "transparent", {
	expect: 4,
	red: null,
	green: null,
	blue: null,
	alpha: 0
} );

QUnit.module( "color" );

QUnit.test( "red green blue alpha Setters", function( assert ) {
	var props = "red green blue alpha".split( " " ),
		color = jQuery.Color( [ 0, 0, 0, 0 ] );

	assert.expect( 4 * props.length );
	jQuery.each( props, function( i, fn ) {
		var tv = fn === "alpha" ? 0.5 : 255,
			set = color[ fn ]( tv ),
			clamp = fn === "alpha" ? 1 : 255,
			clamped = color[ fn ]( clamp + 1 ),
			plused = color[ fn ]( "+=1" );

		assert.equal( set[ fn ](), tv, "color." + fn + "(" + tv + ")." + fn + "()" );
		assert.equal( clamped[ fn ](), clamp, "color." + fn + "(" + ( clamp + 1 ) + ") clamped at " + clamp );
		assert.equal( color[ fn ](), 0, "color." + fn + "() still 0" );
		assert.equal( plused[ fn ](), 1, "color." + fn + "(\"+=1\")" );
	} );
} );

QUnit.test( ".rgba()", function( assert ) {
	var color = jQuery.Color( "black" ),
		getter = color.rgba(),
		set1 = color.rgba( null, 100, null, 0 ),
		set2 = color.rgba( [ null, null, 100, 0.5 ] ),
		set3 = color.rgba( { red: 300, alpha: 2 } );

	assert.expect( 14 );

	assert.deepEqual( getter, color._rgba, "Returned a array has same values" );
	assert.notEqual( getter, color._rgba, "Returned a COPY of the rgba" );

	testParts( set1, {
		prefix: ".rgba( null, 100, null, 0 )",
		red: 0,
		green: 100,
		blue: 0,
		alpha: 0
	}, assert );

	testParts( set2, {
		prefix: ".rgba([ null, null, 100, 0 ])",
		red: 0,
		green: 0,
		blue: 100,
		alpha: 0.5
	}, assert );

	testParts( set3, {
		prefix: ".rgba({ red: 300, alpha: 2 })",
		red: 255,
		green: 0,
		blue: 0,
		alpha: 1
	}, assert );
} );

QUnit.test( ".blend()", function( assert ) {
	var halfwhite = jQuery.Color( "white" ).alpha( 0.5 ),
		red = jQuery.Color( "red" ),
		blend = halfwhite.blend( red );

	assert.expect( 8 );

	testParts( blend, {
		prefix: "Blending with color object: ",
		red: 255,
		green: 127,
		blue: 127,
		alpha: 1
	}, assert );

	testParts( halfwhite.blend( "red" ), {
		prefix: "Using string as color: ",
		red: 255,
		green: 127,
		blue: 127,
		alpha: 1
	}, assert );
} );

QUnit.test( ".transition() works with $.Colors", function( assert ) {
	var black = jQuery.Color( "black" ),
		whiteAlpha = jQuery.Color( "white" ).alpha( 0.5 ),
		trans = jQuery.Color( "transparent" ),
		fifty = black.transition( whiteAlpha, 0.5 );

	assert.expect( 16 );
	testParts( fifty, {
		prefix: "black -> whiteAlpha 0.5",
		red: 127,
		green: 127,
		blue: 127,
		alpha: 0.75
	}, assert );
	testParts( black.transition( trans, 0.5 ), {
		prefix: "black -> transparent 0.5 ",
		red: 0,
		green: 0,
		blue: 0,
		alpha: 0.5
	}, assert );
	testParts( whiteAlpha.transition( trans, 0.5 ), {
		prefix: "whiteAlpha -> transparent 0.5 ",
		red: 255,
		green: 255,
		blue: 255,
		alpha: 0.25
	}, assert );

	// fixes issue #32
	testParts( jQuery.Color( 255, 0, 0, 0 ).transition( black, 0.5 ), {
		prefix: "transparent red -> black 0.5",
		red: 0,
		green: 0,
		blue: 0,
		alpha: 0.5
	}, assert );
} );

QUnit.test( ".transtion() works with strings and objects", function( assert ) {
	var black = jQuery.Color( "black" );

	testParts( black.transition( "white", 0.5 ), {
		prefix: "black -> 'white'",
		red: 127,
		green: 127,
		blue: 127
	}, assert );

	testParts( black.transition( "red", 0.5 ), {
		prefix: "black -> 'red'",
		red: 127,
		green: 0,
		blue: 0
	}, assert );
	testParts( black.transition( { blue: 255 }, 0.5 ), {
		prefix: "black -> { blue: 255 }",
		red: 0,
		green: 0,
		blue: 127
	}, assert );

	testParts( black.transition( [ 200, 200, 200 ], 0.5 ), {
		prefix: "black -> [ 200, 200, 200 ]",
		red: 100,
		green: 100,
		blue: 100
	}, assert );
} );

QUnit.test( ".is()", function( assert ) {
	var red = jQuery.Color( "red" );
	assert.ok( red.is( red ), "Red is itself" );
	assert.ok( red.is( { red: 255 } ), "Red is equal to { red: 255 }" );
	assert.ok( red.is( { saturation: 1 } ), "Red is equal to { saturation: 1 }" );
	assert.ok( red.is( [ 255, 0, 0 ] ), "Red is equal to [255,0,0]" );
	assert.ok( red.is( "red" ), "Red is equal to \"red\"" );
	assert.ok( !red.is( "blue" ), "Red is not blue" );
	assert.ok( !red.is( { alpha: 0 } ), "Red is not { alpha: 0 }" );
} );

QUnit.test( ".toRgbaString()", function( assert ) {
	var black = jQuery.Color( "black" ),
		trans = black.alpha( 0.5 );

	assert.expect( 2 );
	assert.equal( black.toRgbaString(), "rgb(0,0,0)" );
	assert.equal( trans.toRgbaString(), "rgba(0,0,0,0.5)" );
} );

QUnit.test( ".toHexString()", function( assert ) {
	var almostBlack = jQuery.Color( "black" ).red( 2 ).blue( 16 ),
		trans = almostBlack.alpha( 0.5 );

	assert.expect( 2 );
	assert.equal( almostBlack.toHexString(), "#020010", "to hex" );
	assert.equal( trans.toHexString( true ), "#0200107f", "to hex with alpha" );
} );

QUnit.test( "toString() methods keep alpha intact", function( assert ) {
	var trans = jQuery.Color( "transparent" ),
		opaque = jQuery.Color( "red" );

	assert.expect( 4 );
	trans.toRgbaString();
	opaque.toRgbaString();
	assert.equal( trans.alpha(), 0, "toRgbaString()" );
	assert.equal( opaque.alpha(), 1, "toRgbaString()" );

	trans.toHexString();
	opaque.toHexString();
	assert.equal( trans.alpha(), 0, "toHexString()" );
	assert.equal( opaque.alpha(), 1, "toHexString()" );
} );

QUnit.module( "hsla" );

parseTest( "hsla(180,50%,50%,0.5)", {
	expect: 7,
	hue: 180,
	saturation: 0.5,
	lightness: 0.5,
	red: 64,
	green: 191,
	blue: 191,
	alpha: 0.5
} );

parseTest( "hsla( 180, 50%, 50%, 1 )", {
	expect: 7,
	hue: 180,
	saturation: 0.5,
	lightness: 0.5,
	red: 64,
	green: 191,
	blue: 191,
	alpha: 1
} );

parseTest( "hsla( 180, 50%, 50%, .5 )", {
	expect: 7,
	hue: 180,
	saturation: 0.5,
	lightness: 0.5,
	red: 64,
	green: 191,
	blue: 191,
	alpha: 0.5
} );

parseTest( "hsl(72, 77%, 59%)", {
	expect: 7,
	hue: 72,
	saturation: 0.77,
	lightness: 0.59,
	red: 199,
	green: 231,
	blue: 70,
	alpha: 1
} );

parseTest( jQuery.Color( { alpha: 0 } ), {
	expect: 7,
	hue: null,
	saturation: null,
	lightness: null,
	alpha: 0,
	red: null,
	green: null,
	blue: null
}, "jQuery.Color({ alpha: 0 })" );

parseTest( jQuery.Color( { saturation: 0 } ), {
	expect: 7,
	hue: null,
	saturation: 0,
	lightness: null,
	alpha: null,
	red: null,
	green: null,
	blue: null
}, "jQuery.Color({ saturation: 0 })" );

parseTest( jQuery.Color( { saturation: 0, alpha: 0 } ), {
	expect: 7,
	hue: null,
	saturation: 0,
	lightness: null,
	alpha: 0,
	red: null,
	green: null,
	blue: null
}, "jQuery.Color({ saturation: 0, alpha: 0 })" );


QUnit.test( "HSLA Conversions", function( assert ) {
	assert.expect( 11 );
	assert.equal( jQuery.Color( "#000" ).toHslaString(), "hsl(0,0%,0%)", "HSLA value from #000" );
	assert.equal( jQuery.Color( "#fff" ).toHslaString(), "hsl(0,0%,100%)", "HSLA value from #fff" );
	assert.equal( jQuery.Color( "#f00" ).toHslaString(), "hsl(0,100%,50%)", "HSLA value from #f00" );
	assert.equal( jQuery.Color( "#ff0" ).toHslaString(), "hsl(60,100%,50%)", "HSLA value from #ff0" );
	assert.equal( jQuery.Color( "#0f0" ).toHslaString(), "hsl(120,100%,50%)", "HSLA value from #0f0" );
	assert.equal( jQuery.Color( "#0ff" ).toHslaString(), "hsl(180,100%,50%)", "HSLA value from #0ff" );
	assert.equal( jQuery.Color( "#00f" ).toHslaString(), "hsl(240,100%,50%)", "HSLA value from #00f" );
	assert.equal( jQuery.Color( "#f0f" ).toHslaString(), "hsl(300,100%,50%)", "HSLA value from #f0f" );
	assert.equal( jQuery.Color( "#7f007f" ).toHslaString(), "hsl(300,100%,25%)", "HSLA value from #7f007f" );
	assert.equal( jQuery.Color( "#ff7fff" ).toHslaString(), "hsl(300,100%,75%)", "HSLA value from #ff7fff" );
	assert.equal( jQuery.Color( "rgba(127,127,127,0.1)" ).toHslaString(), "hsla(0,0%,50%,0.1)", "HSLA value from rgba(127,127,127,0.1)" );
} );

QUnit.test( "HSLA Transitions", function( assert ) {
	var red = jQuery.Color( "red" ),
		desaturate = red.transition( jQuery.Color( { saturation: 0 } ), 0.5 ),
		hue10 = red.transition( jQuery.Color( { hue: 10 } ), 0.5 ),
		hue350 = red.transition( jQuery.Color( { hue: 350 } ), 0.5 ),
		hueWrapPos = jQuery.Color( { hue: 350 } ).transition( jQuery.Color( { hue: 10 } ) );

	testParts( desaturate, {
		prefix: "red -> desaturatue 0.5",
		hue: 0,
		saturation: 0.5,
		lightness: 0.5,
		alpha: 1
	}, assert );
	testParts( hue10, {
		prefix: "red -> hue 10 0.5",
		hue: 5,
		saturation: 1,
		lightness: 0.5,
		alpha: 1
	}, assert );
	testParts( hue350, {
		prefix: "red -> hue 350 0.5",
		hue: 355,
		saturation: 1,
		lightness: 0.5,
		alpha: 1
	}, assert );
	testParts( hueWrapPos, {
		prefix: " hue 350 -> hue 10 0.5",
		hue: 0,
		saturation: null,
		lightness: null,
		alpha: 1
	}, assert );
} );

QUnit.test( "hue saturation lightness alpha Setters", function( assert ) {
	var props = "hue saturation lightness alpha".split( " " ),
		color = jQuery.Color( [ 0, 0, 0, 0 ] );
	assert.expect( 4 * props.length );
	jQuery.each( props, function( i, fn ) {
		var tv = fn === "hue" ? 359 : 0.5,
			set = color[ fn ]( tv ),
			clamp = fn === "hue" ? -360 : 1,
			clamped = color[ fn ]( clamp + 1 ),
			plused = color[ fn ]( "+=1" );

		assert.equal( set[ fn ](), tv, "color." + fn + "(" + tv + ")." + fn + "()" );
		assert.equal( clamped[ fn ](), 1, "color." + fn + "(" + ( clamp + 1 ) + ") clamped at 1" );
		assert.equal( color[ fn ](), 0, "color." + fn + "() still 0" );
		assert.equal( plused[ fn ](), 1, "color." + fn + "(\"+=1\")" );
	} );
} );

QUnit.test( "alpha setter leaves space as hsla", function( assert ) {
	var test = jQuery.Color( { hue: 0, saturation: 0, lightness: 0, alpha: 0 } ).alpha( 1 );
	assert.ok( test._hsla, "HSLA cache still exists after calling alpha setter" );
} );

QUnit.module( "animate" );
QUnit.test( "animated", function( assert ) {
	assert.expect( 8 );

	var done = assert.async(),
		el = jQuery( "<div></div>" ).css( { color: "#000000" } );

	el.animate( { color: "#ffffff" }, 1, function() {
		testParts( jQuery.Color( el, "color" ), {
			prefix: "Post Animated Color finished properly",
			red: 255,
			green: 255,
			blue: 255,
			alpha: 1
		}, assert );

		el.css( "color", "white" ).animate( { color: "#000000" }, 200 ).stop( true );
		testParts( jQuery.Color( el, "color" ), {
			prefix: "Immediately Stopped.. Animated Color didn't change",
			red: 255,
			green: 255,
			blue: 255,
			alpha: 1
		}, assert );

		done();
	} );
} );

QUnit.test( "animated documentFragment", function( assert ) {
	assert.expect( 1 );

	var done = assert.async(),
		el = jQuery( "<div></div>" );

	el.animate( { color: "red" }, 200, function() {
		assert.ok( true, "Animation of color on documentFragment did not fail" );
		done();
	} );
} );

QUnit.test( "Setting CSS to empty string / inherit", function( assert ) {
	var el = jQuery( "<div></div>" ).css( { color: "#fff" } );
	assert.expect( 2 );

	el.css( "color", "" );
	assert.equal( el[ 0 ].style.color, "", "CSS was set to empty string" );

	el.css( "color", "inherit" );
	assert.ok( el[ 0 ].style.color === "inherit", "Setting CSS to inherit didn't throw error" );
} );

QUnit.test( "Setting CSS to transparent", function( assert ) {
	assert.expect( 1 );

	var parentEl = jQuery( "<div></div>" ).css( { backgroundColor: "blue" } ),
		el = jQuery( "<div></div>" ).appendTo( parentEl );

	el.css( "backgroundColor", "transparent" );
	assert.equal( jQuery.Color( el[ 0 ].style.backgroundColor ).alpha(), 0, "CSS was set to transparent" );
} );

QUnit.test( "jQuery.Color.hook() - Create new hooks for color properties", function( assert ) {
	assert.expect( 2 );

	// these shouldn't be there, but just in case....
	delete jQuery.cssHooks.testy;
	delete jQuery.fx.step.testy;
	jQuery.Color.hook( "testy" );
	assert.ok( jQuery.cssHooks.testy, "testy cssHook created" );
	assert.ok( jQuery.fx.step.testy, "fx.step testy hook created" );
	delete jQuery.cssHooks.testy;
	delete jQuery.fx.step.testy;
} );
