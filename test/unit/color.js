module( "parse" );

function testParts( color, parts ) {
	var prefix = parts.prefix || "";

	if ( parts.expect ) {
		expect( parts.expect );
	}

	jQuery.each( parts, function( key , value ) {

		// these two properties are just helpers for the test function, ignore them
		if ( key === "expect" || key === "prefix" ) {
			return;
		}

		strictEqual( color[ key ](), value, prefix + "."+key+"() is "+value);
	});
}

function parseTest( str, results, descr ) {
	test( descr || "jQuery.Color( \""+str+"\" )", function() {
		var color = descr ? str : jQuery.Color( str );
		testParts( color, results );
	});
}

test( "jQuery.Color( 255, 255, 255 )", function() {
	expect( 4 );
	testParts( jQuery.Color( 255, 255, 255 ), {
		expect: 4,
		red: 255,
		green: 255,
		blue: 255,
		alpha: 1
	});
});

test( "jQuery.Color( element, \"color\" )", function() {
	var $div = jQuery( "<div>" ).appendTo( "body" ).css( "color", "#fff" );
	expect( 8 );
	testParts( jQuery.Color( $div, "color" ), {
		prefix: "jQuery(<div>): ",
		red: 255,
		green: 255,
		blue: 255,
		alpha: 1
	});
	testParts( jQuery.Color( $div[ 0 ], "color" ), {
		prefix: "<div>: ",
		red: 255,
		green: 255,
		blue: 255,
		alpha: 1
	});
	$div.remove();
});

parseTest( jQuery.Color({ red: 100 }), {
	expect: 4,
	red: 100,
	green: null,
	blue: null,
	alpha: null
}, "jQuery.Color({ red: 100 })" );


test( "jQuery.Color({ blue: 100 })", function() {
	var blue = jQuery.Color({ blue: 100 });
	testParts( blue, {
		red: null,
		green: null,
		blue: 100,
		alpha: null
	});
	ok( !blue._hsla, "No HSLA cache");
});

test( "jQuery.Color({ alpha: 1 })", function() {
	var blue = jQuery.Color({ alpha: 1 });
	testParts( blue, {
		red: null,
		green: null,
		blue: null,
		alpha: 1
	});
	ok( !blue._hsla, "No HSLA cache");
});

test( "jQuery.Color({ alpha: 1, hue: 100 })", function() {
	var blue = jQuery.Color({ alpha: 1, hue: 100 });
	testParts( blue, {
		red: null,
		green: null,
		blue: null,
		alpha: 1,
		hue: 100,
		saturation: null,
		lightness: null
	});
	deepEqual( blue._hsla, [ 100, null, null, 1 ], "HSLA cache has correct values");
});


parseTest( jQuery.Color( jQuery.Color( "red" ) ), {
	expect: 4,
	red: 255,
	green: 0,
	blue: 0,
	alpha: 1
}, "jQuery.Color( jQuery.Color(\"red\") )" );

parseTest( jQuery.Color([ 255, 255, 255 ]), {
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
});

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
parseTest( "rgba(127,127,127,0.5)", fiftypercentalpha );
parseTest( "rgba(50%,50%,50%,0.5)", fiftypercentalpha );
parseTest( "rgba(0, 0, 0, 0)", {
	expect: 4,
	red: null,
	green: null,
	blue: null,
	alpha: 0
});

parseTest("red", {
	expect: 4,
	red: 255,
	green: 0,
	blue: 0,
	alpha: 1
});

parseTest("transparent", {
	expect: 4,
	red: null,
	green: null,
	blue: null,
	alpha: 0
});

module( "color" );

test( "red green blue alpha Setters", function() {
	var props = "red green blue alpha".split(" "),
		color = jQuery.Color( [0,0,0,0] );

	expect( 4 * props.length );
	jQuery.each( props, function( i, fn ) {
		var tv = fn==="alpha" ? 0.5 : 255,
			set = color[ fn ]( tv ),
			clamp = fn==="alpha" ? 1 : 255,
			clamped = color[ fn ]( clamp + 1 ),
			plused = color[ fn ]( "+=1" );

		equals( set[ fn ](), tv, "color."+fn+"("+tv+")."+fn+"()" );
		equals( clamped[ fn ](), clamp, "color."+fn+"("+(clamp+1)+") clamped at "+clamp );
		equals( color[ fn ](), 0, "color."+fn+"() still 0" );
		equals( plused[ fn ](), 1, "color."+fn+"(\"+=1\")" );
	});
});

test( ".rgba()", function() {
	var color = jQuery.Color( "black" ),
		getter = color.rgba(),
		set1 = color.rgba( null, 100, null, 0 ),
		set2 = color.rgba([ null, null, 100, 0.5 ]),
		set3 = color.rgba({ red: 300, alpha: 2 });

	expect( 14 );

	deepEqual( getter, color._rgba, "Returned a array has same values" );
	notEqual( getter, color._rgba, "Returned a COPY of the rgba" );

	testParts( set1, {
		prefix: ".rgba( null, 100, null, 0 )",
		red: 0,
		green: 100,
		blue: 0,
		alpha: 0
	});

	testParts( set2, {
		prefix: ".rgba([ null, null, 100, 0 ])",
		red: 0,
		green: 0,
		blue: 100,
		alpha: 0.5
	});

	testParts( set3, {
		prefix: ".rgba({ red: 300, alpha: 2 })",
		red: 255,
		green: 0,
		blue: 0,
		alpha: 1
	});

});

test( ".blend()", function() {
	var halfwhite = jQuery.Color( "white" ).alpha( 0.5 ),
		red = jQuery.Color( "red" ),
		blend = halfwhite.blend( red );

	expect( 8 );

	testParts( blend, {
		prefix: "Blending with color object: ",
		red: 255,
		green: 127,
		blue: 127,
		alpha: 1
	});

	testParts( halfwhite.blend("red"), {
		prefix: "Using string as color: ",
		red: 255,
		green: 127,
		blue: 127,
		alpha: 1
	});

});

test( ".transition() works with $.Colors", function() {
	var black = jQuery.Color( "black" ),
		whiteAlpha = jQuery.Color( "white" ).alpha( 0.5 ),
		trans = jQuery.Color( "transparent" ),
		fifty = black.transition( whiteAlpha, 0.5 );

	expect( 12 );
	testParts( fifty, {
		prefix: "black -> whiteAlpha 0.5",
		red: 127,
		green: 127,
		blue: 127,
		alpha: 0.75
	});
	testParts( black.transition( trans, 0.5 ), {
		prefix: "black -> transparent 0.5 ",
		red: 0,
		green: 0,
		blue: 0,
		alpha: 0.5
	});
	testParts( whiteAlpha.transition( trans, 0.5 ), {
		prefix: "whiteAlpha -> transparent 0.5 ",
		red: 255,
		green: 255,
		blue: 255,
		alpha: 0.25
	});
});

test( ".transtion() works with strings and objects", function() {
	var black = jQuery.Color( "black" );

	testParts( black.transition( "white", 0.5 ), {
		prefix: "black -> 'white'",
		red: 127,
		green: 127,
		blue: 127
	});

	testParts( black.transition( "red", 0.5 ), {
		prefix: "black -> 'red'",
		red: 127,
		green: 0,
		blue: 0
	});
	testParts( black.transition({ blue: 255 }, 0.5 ), {
		prefix: "black -> { blue: 255 }",
		red: 0,
		green: 0,
		blue: 127
	});

	testParts( black.transition([ 200, 200, 200 ], 0.5 ), {
		prefix: "black -> [ 200, 200, 200 ]",
		red: 100,
		green: 100,
		blue: 100
	});
	
});

test( ".is()", function() {
	var red = jQuery.Color( "red" );
	ok( red.is( red ), "Red is itself");
	ok( red.is({ red: 255 }), "Red is equal to { red: 255 }");
	ok( red.is({ saturation: 1 }), "Red is equal to { saturation: 1 }");
	ok( red.is([255,0,0]), "Red is equal to [255,0,0]");
	ok( red.is("red"), "Red is equal to \"red\"");
	ok( !red.is("blue"), "Red is not blue");
	ok( !red.is({ alpha: 0 }), "Red is not { alpha: 0 }");

});

test( ".toRgbaString()", function() {
	var black = jQuery.Color( "black" ),
		trans = black.alpha( 0.5 );

	expect( 2 );
	equals( black.toRgbaString(), "rgb(0,0,0)" );
	equals( trans.toRgbaString(), "rgba(0,0,0,0.5)" );

});

test( ".toHexString()", function() {
	var almostBlack = jQuery.Color( "black" ).red( 2 ).blue( 16 ),
		trans = almostBlack.alpha( 0.5 );

	expect( 2 );
	equals( almostBlack.toHexString(), "#020010" , "to hex");
	equals( trans.toHexString( true ), "#0200107f", "to hex with alpha" );

});

test( "toString() methods keep alpha intact", function() {
	var trans = jQuery.Color( "transparent" ),
		opaque = jQuery.Color( "red" );

	expect( 4 );
	trans.toRgbaString();
	opaque.toRgbaString();
	equals( trans.alpha(), 0, "toRgbaString()" );
	equals( opaque.alpha(), 1, "toRgbaString()" );

	trans.toHexString();
	opaque.toHexString();
	equals( trans.alpha(), 0, "toHexString()" );
	equals( opaque.alpha(), 1, "toHexString()" );
});

module( "hsla" );
parseTest("hsla(180,50%,50%,0.5)", {
	expect: 7,
	hue: 180,
	saturation: 0.5,
	lightness: 0.5,
	red: 64,
	green: 191,
	blue: 191,
	alpha: 0.5
});

parseTest("hsl(72, 77%, 59%)", {
	expect: 7,
	hue: 72,
	saturation: 0.77,
	lightness: 0.59,
	red: 199,
	green: 231,
	blue: 70,
	alpha: 1
});

parseTest( jQuery.Color({ alpha: 0 }), {
	expect: 7,
	hue: null,
	saturation: null,
	lightness: null,
	alpha: 0,
	red: null,
	green: null,
	blue: null
}, "jQuery.Color({ alpha: 0 })" );

parseTest( jQuery.Color({ saturation: 0 }), {
	expect: 7,
	hue: null,
	saturation: 0,
	lightness: null,
	alpha: null,
	red: null,
	green: null,
	blue: null
}, "jQuery.Color({ saturation: 0 })" );

parseTest( jQuery.Color({ saturation: 0, alpha: 0 }), {
	expect: 7,
	hue: null,
	saturation: 0,
	lightness: null,
	alpha: 0,
	red: null,
	green: null,
	blue: null
}, "jQuery.Color({ saturation: 0, alpha: 0 })" );


test("HSLA Conversions", function() {
	expect(9);
	equals( jQuery.Color( "#f00" ).toHslaString(), "hsl(0,100%,50%)", "HSLA value from #f00");
	equals( jQuery.Color( "#ff0" ).toHslaString(), "hsl(60,100%,50%)", "HSLA value from #ff0");
	equals( jQuery.Color( "#0f0" ).toHslaString(), "hsl(120,100%,50%)", "HSLA value from #0f0");
	equals( jQuery.Color( "#0ff" ).toHslaString(), "hsl(180,100%,50%)", "HSLA value from #0ff");
	equals( jQuery.Color( "#00f" ).toHslaString(), "hsl(240,100%,50%)", "HSLA value from #00f");
	equals( jQuery.Color( "#f0f" ).toHslaString(), "hsl(300,100%,50%)", "HSLA value from #f0f");
	equals( jQuery.Color( "#7f007f" ).toHslaString(), "hsl(300,100%,25%)", "HSLA value from #7f007f");
	equals( jQuery.Color( "#ff7fff" ).toHslaString(), "hsl(300,100%,75%)", "HSLA value from #ff7fff");
	equals( jQuery.Color( "rgba(127,127,127,0.1)" ).toHslaString(), "hsla(0,0%,50%,0.1)", "HSLA value from rgba(127,127,127,0)");
});

test("HSLA Transitions", function() {
	var red = jQuery.Color("red"),
		desaturate = red.transition( jQuery.Color({ saturation: 0 }), 0.5 ),
		hue10 = red.transition( jQuery.Color({ hue: 10 }), 0.5),
		hue350 = red.transition( jQuery.Color({ hue: 350 }), 0.5),
		hueWrapPos = jQuery.Color({ hue: 350 }).transition( jQuery.Color({ hue: 10 }));
	
	testParts( desaturate, {
		prefix: "red -> desaturatue 0.5",
		hue: 0,
		saturation: 0.5,
		lightness: 0.5,
		alpha: 1
	});
	testParts( hue10, {
		prefix: "red -> hue 10 0.5",
		hue: 5,
		saturation: 1,
		lightness: 0.5,
		alpha: 1
	});
	testParts( hue350, {
		prefix: "red -> hue 350 0.5",
		hue: 355,
		saturation: 1,
		lightness: 0.5,
		alpha: 1
	});
	testParts( hueWrapPos, {
		prefix: " hue 350 -> hue 10 0.5",
		hue: 0,
		saturation: null,
		lightness: null,
		alpha: 1
	});
	
});


test( "hue saturation lightness alpha Setters", function() {
	var props = "hue saturation lightness alpha".split(" "),
		color = jQuery.Color( [0,0,0,0] );
	expect( 4 * props.length );
	jQuery.each( props, function( i, fn ) {
		var tv = fn === "hue" ? 359 : 0.5 ,
			set = color[ fn ]( tv ),
			clamp = fn === "hue" ? -360 : 1,
			clamped = color[ fn ]( clamp + 1 ),
			plused = color[ fn ]( "+=1" );

		equals( set[ fn ](), tv, "color."+fn+"("+tv+")."+fn+"()" );
		equals( clamped[ fn ](), 1, "color."+fn+"("+(clamp+1)+") clamped at 1" );
		equals( color[ fn ](), 0, "color."+fn+"() still 0" );
		equals( plused[ fn ](), 1, "color."+fn+"(\"+=1\")" );
	});
});

test( "alpha setter leaves space as hsla", function() {
	var test = jQuery.Color({hue: 0, saturation: 0, lightness: 0, alpha: 0}).alpha( 1 );
	ok( test._hsla, "HSLA cache still exists after calling alpha setter" );
});


module( "animate" );
test( "animated", function() {
	var el = jQuery( "<div></div>" ).appendTo( "body" ).css({ color: "#000000" });

	expect( 10 );
	stop();
	el.animate({ color: "#ffffff" }, 200, function() {
		testParts( jQuery.Color( el, "color" ), {
			prefix: "Post Animated Color finished properly",
			red: 255,
			green: 255,
			blue: 255,
			alpha: 1
		});

		el.animate({ color: "#00FF00" }, 1000);
		setTimeout(function() {
			var color = jQuery.Color( el, "color" );

			el.stop();
			notEqual( color.red() , 255, "Stopped midway, not either endpoint" );
			notEqual( color.red() , 0, "Stopped midway, not either endpoint" );

			el.css('color', 'white').animate({ color: "#000000" }, 200).stop( true );
			testParts( jQuery.Color( el, "color" ), {
				prefix: "Immediately Stopped.. Animated Color didn't change",
				red: 255,
				green: 255,
				blue: 255,
				alpha: 1
			});

			el.remove();
			start();
		}, 500);
	});
});

asyncTest( "animated documentFragment", function() {
	var el = jQuery( "<div></div>" );
	expect(1);

	el.animate({ color: "red" }, 200, function() {
		ok( true, "Animation of color on documentFragment did not fail" );
		start();
	});
});

test( "Setting CSS to empty string / inherit", function() {
	var el = jQuery( "<div></div>" ).appendTo( "body" ).css({ color: "#fff" });
	expect( 2 );

	el.css( "color", "" );
	equal( el[0].style.color, "", "CSS was set to empty string" );

	el.css( "color", "inherit" );
	equal( el[0].style.color, "inherit", "CSS was set to inherit" );

});