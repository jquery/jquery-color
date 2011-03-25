/*
 * jQuery Color Animations
 * Copyright 2007 John Resig
 * Released under the MIT and GPL licenses.
 */

(function(jQuery){
	var stepHooks = 'backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color outlineColor'.split(' '),

		// plusequals test for += 100 -= 100
		rplusequals = /^([-+])=\s*(\d+\.?\d*)/,
		// a set of RE's that can match strings and generate color tuples.
		stringParsers = [{
				re: /rgba?\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*(?:,\s*([0-9]+(?:\.[0-9]+))\s*)?\)/, 
				parse: function( execResult ) { 
					return [
						execResult[ 1 ], 
						execResult[ 2 ], 
						execResult[ 3 ],
						execResult[ 4 ]
					];
				}
			}, {
				re: /rgba?\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*(?:,\s*([0-9]+(?:\.[0-9]+)?)\s*)?\)/,
				parse: function( execResult ) { 
					return [
						2.55 * execResult[1],
						2.55 * execResult[2],
						2.55 * execResult[3],
						execResult[ 4 ]
					];
				}
			}, {
				re: /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/,
				parse: function( execResult ) { 
					return [ 
						parseInt( execResult[ 1 ], 16 ),
						parseInt( execResult[ 2 ], 16 ),
						parseInt( execResult[ 3 ], 16 )
					];
				}
			}, {
				re: /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/,
				parse: function( execResult ) { 
					return [ 
						parseInt( execResult[ 1 ] + execResult[ 1 ], 16 ),
						parseInt( execResult[ 2 ] + execResult[ 2 ], 16 ),
						parseInt( execResult[ 3 ] + execResult[ 3 ], 16 )
					];
				}
			}],

		// jQuery.Color( )
		color = $.Color = function( color, green, blue, alpha ) {
			return new $.Color.fn.parse( color, green, blue, alpha );
		},
		rgbaspace = {
			red: {
				idx: 0,
				min: 0,
				max: 255,
				type: 'int',
				empty: true
			},
			green: {
				idx: 1,
				min: 0,
				max: 255,
				type: 'int',
				empty: true
			},
			blue: {
				idx: 2,
				min: 0,
				max: 255,
				type: 'int',
				empty: true
			},
			alpha: {
				idx: 3,
				min: 0,
				max: 1,
				type: 'float',
				def: 1
			}
		},

		// colors = $.Color.names
		colors;

		function clamp( value, prop ) {
			if ( prop.empty && value === undefined ) {
				return value;
			}
			if (prop.def && value === undefined || value === null) {
				value = prop.def;
			}
			if ( prop.type == 'int' ) {
				value = ~~value;
			}
			if ( prop.type == 'float' ) {
				value = parseFloat( value );
			}
			return prop.min > value ? prop.min : prop.max < value ? prop.max : value;
		}

		color.fn = color.prototype = {
			constructor: color,
			parse: function( color, green, blue, alpha ) {

				var type = $.type( color ),
					rgba = this._rgba = [],
					source;

				// more than 1 argument specified - assume ( red, green, blue, alpha )
				if ( green ) {
					color = [ color, green, blue, alpha ];
					type = 'array';
				}

				if ( type == "string" ) {
					color = color.toLowerCase();
					$.each( stringParsers, function( i, parser ) {
						var match = parser.re.exec( color ),
							values = match && parser.parse( match );

						if ( values ) {
							$.each( rgbaspace, function( key, prop ) {
								rgba[ prop.idx ] = clamp( values[ prop.idx ], prop );
							});

							// exit $.each( stringParsers ) here because we found ours
							return false;
						}
					});

					// Found a stringParser that handled it
					if ( rgba.length != 0 ) {
						return this;
					}
					
					// named colors / default
					color = colors[ color ] || colors._default;
					type = 'array';
				}

				if ( type == 'array' ) {
					$.each( rgbaspace, function( key, prop ) {
						rgba[ prop.idx ] = clamp( color[ prop.idx ], prop );
					});
					return this;
				}
			},
			transition: function( other, distance ) {
				var start = this._rgba,
					end = other._rgba,
					rgba = start.slice();
				$.each( rgbaspace, function( key, prop ) {
					var s = start[ prop.idx ],
						e = end[ prop.idx ];
					console.log( key, s, e );
					rgba[ prop.idx ] = clamp( ( e - s ) * distance + s, prop );
				});
				return color( rgba );
			},
			toRgbaString: function() {
				var rgba = this._rgba;

				if ( rgba[ 3 ] == 1 ) {
					rgba.length = 3;
				}
				
				return ( rgba.length == 3 ? "rgb(" : "rgba(" ) + rgba.join(",") + ")";
			}
		};
		color.fn.parse.prototype = color.fn;

		// Create .red() .green() .blue() .alpha()
		$.each( rgbaspace, function( key, prop ) {
			color.fn[ key ] = function( value ) {
				var vtype = $.type( value ),
					cur = this._rgba[ prop.idx ],
					copy, match;

				// called as a setter
				if ( arguments.length ) {
					if ( $.isFunction( value ) ) {
						value = value.call( this, cur );
					}
					if ( value === undefined && prop.empty ) {
						return this;
					}

					if ( $.type( value ) == 'string') {
						match = rplusequals.exec( value );
						if ( match ) {
							value = cur + parseFloat( match[ 2 ] ) * ( match[ 1 ] == '+' ? 1 : -1 );
						}
					}
					// chain
					copy = this._rgba.slice();
					copy[ prop.idx ] = clamp(value, prop);
					return color(copy);
				} else {
					return cur;
				}
			};
		});


		// Some named colors to work with
		// From Interface by Stefan Petre
		// http://interface.eyecon.ro/

		colors = $.Color.names = {
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
			transparent: [ undefined, undefined, undefined, 0 ],
			_default: [ 255, 255, 255 ]
		};


	// OLD 1.0 stuff still around
	// REMOVE EVENTUALLY

    // We override the animation for all of these color styles
    jQuery.each(['backgroundColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor', 'borderTopColor', 'color', 'outlineColor'], function(i,attr){
        jQuery.fx.step[attr] = function(fx){
            if ( !fx.colorInit ) {
                fx.start = color( getColor( fx.elem, attr ) );
                fx.end = color( fx.end );
                fx.colorInit = true;
            }

            fx.elem.style[attr] = fx.start.transition( fx.end, fx.pos ).toRgbaString();
        }
    });

    // Color Conversion functions from highlightFade
    // By Blair Mitchelmore
    // http://jquery.offput.ca/highlightFade/

    // Parse strings looking for color tuples [ 255, 255, 255 ]
    function getRGB(color) {
        var result;

        // Check if we're already dealing with an array of colors
        if ( color && color.constructor == Array && color.length == 3 )
            return color;

        // Look for rgb(num,num,num)
        if (result = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color))
            return [parseInt(result[1]), parseInt(result[2]), parseInt(result[3])];

        // Look for rgb(num%,num%,num%)
        if (result = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(color))
            return [parseFloat(result[1])*2.55, parseFloat(result[2])*2.55, parseFloat(result[3])*2.55];

        // Look for #a0b1c2
        if (result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color))
            return [parseInt(result[1],16), parseInt(result[2],16), parseInt(result[3],16)];

        // Look for #fff
        if (result = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color))
            return [parseInt(result[1]+result[1],16), parseInt(result[2]+result[2],16), parseInt(result[3]+result[3],16)];

        // Look for rgba(0, 0, 0, 0) == transparent in Safari 3
        if (result = /rgba\(0, 0, 0, 0\)/.exec(color))
            return colors['transparent'];

        // Otherwise, we're most likely dealing with a named color
        return colors[jQuery.trim(color).toLowerCase()];
    }

    function getColor(elem, attr) {
        var color;

        do {
            color = jQuery.curCSS(elem, attr);

            // Keep going until we find an element that has color, or we hit the body
            if ( color != '' && color != 'transparent' || jQuery.nodeName(elem, "body") )
                break;

            attr = "backgroundColor";
        } while ( elem = elem.parentNode );

        return getRGB(color);
    };

	

})(jQuery);
