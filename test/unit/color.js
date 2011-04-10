module("parse", { teardown: moduleTeardown });

function testParts( color, parts ) {
	var prefix = parts.prefix || '';
	$.each( parts, function( key , value ) {
		if ( key == 'expect' || key == 'prefix' ) return;
		equals(color[ key ](), value, prefix + "."+key+"() is "+value);
	});	
}

function parseTest( str, results, descr ) {
	test(descr || "jQuery.Color( '"+str+"' )", function() {
		expect( results.expect );
		var color = descr ? str : jQuery.Color( str );
		testParts( color, results );
	});
}

test("jQuery.color( 255, 255, 255 )", function() {
	expect(4);
	testParts( jQuery.Color(255, 255, 255), { expect: 4, red: 255, green: 255, blue: 255, alpha: 1 });
});

test("jQuery.color( element, 'color' )", function() {
	expect(8);
	var $div = $("<div>").appendTo("body").css('color', '#fff');
	testParts( jQuery.Color($div, 'color'), { expect: 4, prefix: 'jQuery(<div>): ', red: 255, green: 255, blue: 255, alpha: 1 });
	testParts( jQuery.Color($div[0], 'color'), { expect: 4, prefix: '<div>: ', red: 255, green: 255, blue: 255, alpha: 1 });
	$div.remove();
})

parseTest( jQuery.Color({ red: 100 }), { expect: 4, red: 100, green: null, blue: null, alpha: 1 },"jQuery.Color({ red: 100 })");

parseTest( jQuery.Color(jQuery.Color('red')), { expect: 4, red: 255, green: 0, blue: 0, alpha: 1 },"jQuery.Color(jQuery.Color('red'))");

parseTest( jQuery.Color([255,255,255]), { expect: 4, red: 255, green: 255, blue: 255, alpha: 1 },
"jQuery.color([ 255, 255, 255 ])");

parseTest( '', {
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
parseTest( '#777', sevens );
parseTest( '#777777', sevens );

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
parseTest('rgb(127,127,127)', fiftypercent);
parseTest('rgb(50%,50%,50%)', fiftypercent);
parseTest('rgba(127,127,127,0.5)', fiftypercentalpha);
parseTest('rgba(50%,50%,50%,0.5)', fiftypercentalpha);
parseTest( 'rgba(0, 0, 0, 0)', {
	expect: 4,
	red: 0,
	green: 0,
	blue: 0,
	alpha: 0
});

parseTest('red', {
	expect: 4,
	red: 255,
	green: 0,
	blue: 0,
	alpha: 1
});

parseTest('transparent', {
	expect: 4,
	red: undefined,
	green: undefined,
	blue: undefined,
	alpha: 0
});

module("color", { teardown: moduleTeardown });
test("red green blue alpha Setters", function() {
	var props = 'red green blue alpha'.split(' ');
	expect( 4 * props.length );
	var color = $.Color( [0,0,0,0] );
	$.each( props, function( i, fn ) {
		var tv = fn=='alpha' ? 0.5 : 255,
			set = color[ fn ]( tv ),
			clamp = fn=='alpha' ? 1 : 255,
			clamped = color[ fn ]( clamp + 1 ),
			plused = color[ fn ]('+=1');

		equals( set[ fn ](), tv, "color."+fn+"("+tv+")."+fn+"()");
		equals( clamped[ fn ](), clamp, "color."+fn+"("+(clamp+1)+") clamped at "+clamp);
		equals( color[ fn ](), 0, "color."+fn+"() still 0");
		equals( plused[ fn ](), 1, "color."+fn+"('+=1')");
	});
	
});

test(".rgba()", function() {
	var color = $.Color('black'),
		getter = color.rgba(),
		set1 = color.rgba( null, 100, null, 0 ),
		set2 = color.rgba([ null, null, 100, 0.5 ]);
		set3 = color.rgba({ red: 300, alpha: 2 });
	
	expect(14);
	
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

test(".blend()", function() {
	var halfwhite = $.Color('white').alpha(0.5),
		red = $.Color('red'),
		blend = halfwhite.blend(red);
	
	expect(4);
	testParts( blend, {
		red: 255,
		green: 127,
		blue: 127,
		alpha: 1
	});
});

test(".transition()", function() {
	var black = $.Color('black'),
		whiteAlpha = $.Color('white').alpha(0.5),
		trans = $.Color('transparent');
		fifty = black.transition(whiteAlpha, 0.5);
	
	expect( 12 );
	testParts( fifty, {
		prefix: 'black -> whiteAlpha 0.5',
		red: 127,
		green: 127,
		blue: 127,
		alpha: 0.75
	});
	testParts( black.transition(trans, 0.5), { 
		prefix: 'black -> transparent 0.5 ',
		red: 0, green: 0, blue: 0, alpha: 0.5
	});
	testParts( whiteAlpha.transition(trans, 0.5), { 
		prefix: 'whiteAlpha -> transparent 0.5 ',
		red: 255, green: 255, blue: 255, alpha: 0.25
	});
	
});

test(".toRgbaString()", function() {
	var black = $.Color('black'),
		trans = black.alpha(0.5);
	
	expect( 2 );
	equals( black.toRgbaString(), "rgb(0,0,0)" );
	equals( trans.toRgbaString(), "rgba(0,0,0,0.5)" );
	
});

test(".toHexString()", function() {
	var almostBlack = $.Color('black').red(2).blue(16),
		trans = almostBlack.alpha(0.5);
	
	expect( 2 );
	equals( almostBlack.toHexString(), "#020010" , "to hex");
	equals( trans.toHexString(true), "#0200107f", "to hex with alpha" );
	
});

test("toString() methods keep alpha intact", function() {
	expect( 4 );
	var color = $.Color("transparent"),
		red = $.Color("red");
	color.toRgbaString(); red.toRgbaString();
	equals( color.alpha(), 0, "toRgbaString()");
	equals( red.alpha(), 1, "toRgbaString()");
	color.toHexString(); red.toHexString();
	equals( color.alpha(), 0, "toHexString()");
	equals( red.alpha(), 1, "toHexString()");
});

module("animate", { teardown: moduleTeardown })
test("animated", function() {
	expect( 8 );
	var el = $("<div>").appendTo('body').css({ color: '#000000' });
	stop();
	el.animate({ color: '#ffffff' }, 200, function() {
		testParts( $.Color( $( this ).css('color') ) , {
			prefix: 'Post Animated Color',
			red: 255, green: 255, blue: 255, alpha: 1
		});
		$( this ).animate({ color: '#000000' }, 200).stop()
		testParts( $.Color( el.css('color') ) , {
			prefix: 'Immediately Stopped.. Animated Color',
			red: 255, green: 255, blue: 255, alpha: 1
		});
		el.remove();
		start();
	});
})
