/*
 * jQuery Color Animations
 * Copyright 2011 John Resig
 * Released under the MIT and GPL licenses.
 */

(function($){

	var stepHooks = 'backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color outlineColor'.split(' '),
		rrgb = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/,
		rrgbpercent = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/,
		rlonghex = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/,
		rshorthex = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/,

		// colors = jQuery.color.names
		colors;

	// We override the animation for all of these color styles
	$.each( stepHooks, function( i, attr ) {

		$.fx.step[ attr ] = function ( fx ) {

			// parse start and end values the on first step
			if ( !fx.colorInit ) {
				fx.start = $.color.getColor( fx.elem, attr );
				fx.end = $.color.parse( fx.end );
				fx.colorInit = true;
			}

			var vals = [],
				i = 0,
				start = fx.start,
				end = fx.end,
				l = end.length;
			
			for ( ; i < l ; i++ ) {
				// clamp values between 0 and 255, use ~~ to floor value
				vals[ i ] = Math.min( ~~ Math.max( 
					fx.pos * ( end[ i ] - start[ i ] ) + start[ i ] 
				, 0 ), 255);
			}

			fx.elem.style[ attr ] = "rgb(" + vals.join(",") + ")";

		};
	});

	// Color Conversion functions originally from highlightFade
	// By Blair Mitchelmore
	// http://jquery.offput.ca/highlightFade/
	$.color = {
		parse: function( color ) {
			var result;
			
			// if the color is an array like [ 255, 255, 255 ]
			if ( $.type( color ) == "array" && color.length == 3 ) {
				return color;
			}

			// Look for rgb(num,num,num)
			if ( result = rrgb.exec( color ) ) {
				return [
					parseInt( result[ 1 ], 10 ),
					parseInt( result[ 2 ], 10 ),
					parseInt( result[ 3 ], 10 )
				];
			}

			// Look for rgb(num%,num%,num%)
			if ( result = rrgbpercent.exec( color ) ) {
				return [ 
					~~( result[ 1 ] / 100 ) * 255,
					~~( result[ 2 ] / 100 ) * 255,
					~~( result[ 3 ] / 100 ) * 255
				];
			}

			// Look for #a0b1c2
			if ( result = rlonghex.exec( color ) ) {
				return [
					parseInt( result[ 1 ], 16 ),
					parseInt( result[ 2 ], 16 ),
					parseInt( result[ 3 ], 16 )
				];
			}

			// Look for #fff
			if ( result = rshorthex.exec( color ) ) {
				return [
					parseInt( result[ 1 ] + result[ 1 ], 16 ),
					parseInt( result[ 2 ] + result[ 2 ], 16 ),
					parseInt( result[ 3 ] + result[ 3 ], 16 )
				];
			}

			// return the named color, or default if we can't parse.
			return colors[ $.trim( color ).toLowerCase() ] || colors[ '_default' ];
		},
		names: {
			aqua: [ 0, 255, 255 ],
			azure: [ 240, 255, 255 ],
			beige: [ 245, 245, 220 ],
			black: [ 0, 0, 0 ],
			blue: [ 0, 0, 255 ],
			brown: [ 165, 42, 42 ],
			cyan: [ 0, 255, 255 ],
			darkblue: [ 0, 0, 139 ],
			darkcyan: [ 0, 139, 139 ],
			darkgrey: [ 169, 169, 169 ],
			darkgreen: [ 0, 100, 0 ],
			darkkhaki: [ 189, 183, 107 ],
			darkmagenta: [ 139, 0, 139 ],
			darkolivegreen: [ 85, 107, 47 ],
			darkorange: [ 255, 140, 0 ],
			darkorchid: [ 153, 50, 204 ],
			darkred: [ 139, 0, 0 ],
			darksalmon: [ 233, 150, 122 ],
			darkviolet: [ 148, 0, 211 ],
			fuchsia: [ 255, 0, 255 ],
			gold: [ 255, 215, 0 ],
			green: [ 0, 128, 0 ],
			indigo: [ 75, 0, 130 ],
			khaki: [ 240, 230, 140 ],
			lightblue: [ 173, 216, 230 ],
			lightcyan: [ 224, 255, 255 ],
			lightgreen: [ 144, 238, 144 ],
			lightgrey: [ 211, 211, 211 ],
			lightpink: [ 255, 182, 193 ],
			lightyellow: [ 255, 255, 224 ],
			lime: [ 0, 255, 0 ],
			magenta: [ 255, 0, 255 ],
			maroon: [ 128, 0, 0 ],
			navy: [ 0, 0, 128 ],
			olive: [ 128, 128, 0 ],
			orange: [ 255, 165, 0 ],
			pink: [ 255, 192, 203 ],
			purple: [ 128, 0, 128 ],
			violet: [ 128, 0, 128 ],
			red: [ 255, 0, 0 ],
			silver: [ 192, 192, 192 ],
			white: [ 255, 255, 255 ],
			yellow: [ 255, 255, 0 ],
			transparent: [ 255, 255, 255 ],
			'_default': [ 255, 255, 255 ]
		},
		getColor: function ( elem, attr ) {
			var color;

			do {
				color = $.curCSS( elem, attr );

				// Keep going until we find an element that has color, or we hit the body
				if ( color != '' && color != 'transparent' || $.nodeName( elem, "body" ) ) {
					break;
				}

				attr = "backgroundColor";
			} while ( elem = elem.parentNode );

			return getRGB(color);
		}
	};

	colors = $.color.names;
})(jQuery);
