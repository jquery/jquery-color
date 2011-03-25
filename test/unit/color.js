module("parse", { teardown: moduleTeardown });

function parseTest( str, results, descr ) {
	test(descr || "jQuery.Color( '"+str+"' )", function() {
		expect( results.expect );
		var color = descr ? str : jQuery.Color( str );
		$.each( results, function( key , value ) {
			if ( key == 'expect' ) return;
			equals(color[ key ](), value, "."+key+"() is "+value);
		});
	});
}

parseTest( jQuery.Color( 255, 255, 255 ), { expect: 4, red: 255, green: 255, blue: 255, alpha: 1 }, "jQuery.color( 255, 255, 255 )" );

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
	})
	
})
