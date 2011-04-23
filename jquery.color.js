/*
 * jQuery Color Animations v@VERSION
 * http://jquery.org/
 *
 * Copyright 2011 John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jqery.org/license
 *
 * Date: @DATE
 */

(function( jQuery, undefined ){
	var stepHooks = "backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color outlineColor".split(" "),

		// plusequals test for += 100 -= 100
		rplusequals = /^([\-+])=\s*(\d+\.?\d*)/,
		// a set of RE's that can match strings and generate color tuples.
		stringParsers = [{
				re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
				parse: function( execResult ) {
					return [
						execResult[ 1 ],
						execResult[ 2 ],
						execResult[ 3 ],
						execResult[ 4 ]
					];
				}
			}, {
				re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
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
			}, {
				re: /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
				fn: "hsla",
				parse: function( execResult ) {
					return [
						execResult[1],
						execResult[2] / 100,
						execResult[3] / 100,
						execResult[4]
					];
				}
			}],

		// jQuery.Color( )
		color = jQuery.Color = function( color, green, blue, alpha ) {
			return new jQuery.Color.fn.parse( color, green, blue, alpha );
		},
		rgbaspace = {
			red: {
				idx: 0,
				min: 0,
				max: 255,
				type: "int",
				empty: true
			},
			green: {
				idx: 1,
				min: 0,
				max: 255,
				type: "int",
				empty: true
			},
			blue: {
				idx: 2,
				min: 0,
				max: 255,
				type: "int",
				empty: true
			},
			alpha: {
				idx: 3,
				min: 0,
				max: 1,
				type: "float",
				def: 1
			}
		},
		hslaspace = {
			hue: {
				idx: 0,
				mod: 360,
				type: "int",
				empty: true
			},
			saturation: {
				idx: 1,
				min: 0,
				max: 1,
				type: "float",
				empty: true
			},
			lightness: {
				idx: 2,
				min: 0,
				max: 1,
				type: "float",
				empty: true
			}
		},
		support = color.support = {},

		// colors = jQuery.Color.names
		colors;

	hslaspace.alpha = rgbaspace.alpha;

	function clamp( value, prop ) {
		if ( prop.empty && value == null ) {
			return null;
		}
		if ( prop.def && value == null ) {
			return prop.def;
		}
		if ( prop.type === "int" ) {
			value = ~~value;
		}
		if ( prop.mod ) {
			value = ( value < 0 ? value + 360 * ( 1 + ~~( -value / 360 ) ) : value ) % prop.mod;
		}
		if ( prop.type === "float" ) {
			value = parseFloat( value );
		}
		if ( jQuery.isNaN( value ) ) {
			value = prop.def;
		}
		return prop.min > value ? prop.min : prop.max < value ? prop.max : value;
	}

	color.fn = color.prototype = {
		constructor: color,
		parse: function( red, green, blue, alpha ) {
			if ( red instanceof jQuery || red.nodeType ) {
				red = red instanceof jQuery ? red.css( green ) : jQuery( red ).css( green );
				green = undefined;
			}

			var inst = this,
				type = jQuery.type( red ),
				rgba = this._rgba = [],
				source;

			// more than 1 argument specified - assume ( red, green, blue, alpha )
			if ( green !== undefined ) {
				red = [ red, green, blue, alpha ];
				type = "array";
			}

			if ( type === "string" ) {
				red = red.toLowerCase();
				jQuery.each( stringParsers, function( i, parser ) {
					var match = parser.re.exec( red ),
						values = match && parser.parse( match ),
						parsed;


					if ( values ) {
						if ( parser.fn ) {
							parsed = inst[ parser.fn ]( values );
							rgba = inst._rgba = parsed._rgba;
							inst._hsla = parsed._hsla;
						} else {
							jQuery.each( rgbaspace, function( key, prop ) {
								rgba[ prop.idx ] = clamp( values[ prop.idx ], prop );
							});
						}

						// exit jQuery.each( stringParsers ) here because we found ours
						return false;
					}
				});

				// Found a stringParser that handled it
				if ( rgba.length !== 0 ) {

					// if this came from a parsed string, force "transparent" when alpha is 0
					// chrome, (and maybe others) return "transparent" as rgba(0,0,0,0)
					if ( rgba[ 3 ] === 0 && rgba[ 0 ] != null ) {
						$.extend( rgba, colors.transparent );
					}
					return this;
				}

				// named colorss / default
				red = colors[ red ] || colors._default;
				type = "array";
			}

			if ( type === "array" ) {
				jQuery.each( rgbaspace, function( key, prop ) {
					rgba[ prop.idx ] = clamp( red[ prop.idx ], prop );
				});
				return this;
			}

			if ( type === "object" ) {
				if ( red instanceof color ) {
					this._rgba = red._rgba.slice();
				} else {
					jQuery.each( rgbaspace, function( key, prop ) {
						rgba[ prop.idx ] = clamp( red[ key ], prop );
					});
				}
				return this;
			}
		},
		rgba: function( red, green, blue, alpha ) {

			// no arguments - return our values
			if ( red === undefined ) {
				return this._rgba.slice();
			}

			var type = jQuery.type( red ),
				obj = type === "array" ? { red: red[0], green: red[1], blue: red[2], alpha: red[3] } :
					type === "object" ? red :
					{ red: red, green: green, blue: blue, alpha: alpha },
				ret = this._rgba.slice();

			jQuery.each( rgbaspace, function( key, prop ) {
				var val = obj[ key ];

				// unless its null or undefined
				if ( val != null ) {

					// will automaticaly clamp when passed to color()
					ret[ prop.idx ] = val;
				}
			});
			return color( ret );
		},
		hsla: function( hue, saturation, lightness, alpha ) {
			if ( !this._hsla ) {
				this._hsla = toHsla( this._rgba );
			}
			if ( hue === undefined ) {
				return this._hsla.slice();
			}

			var type = jQuery.type( hue ),
				obj = type === "array" ? { hue: hue[0], saturation: hue[1], lightness: hue[2], alpha: hue[3] } :
					type === "object" ? hue :
					{ hue: hue, saturation: saturation, lightness: lightness, alpha: alpha },
				ret = this._hsla.slice(), rgb;

			jQuery.each( hslaspace, function( key, prop ) {
				var val = obj[ key ];

				// unless its null or undefined
				if ( val != null || ret[ prop.idx ] == null ) {

					ret[ prop.idx ] = clamp( val, prop );
				}
			});
			rgb = color( fromHsla( ret ) );
			rgb._hsla = ret;
			return rgb;
		},
		transition: function( other, distance ) {
			var start = this._rgba,
				end = other._rgba,
				rgba = start.slice();
			jQuery.each( rgbaspace, function( key, prop ) {
				var s = start[ prop.idx ],
					e = end[ prop.idx ];

				// if null, don't override start value
				if ( e === null ) {
					return;
				}
				// if null - use end
				if ( s === null ) {
					rgba[ prop.idx ] = e;
				} else {
					rgba[ prop.idx ] = clamp( ( e - s ) * distance + s, prop );
				}
			});
			return color( rgba );
		},
		blend: function( opaque ) {
			// if we are already opaque - return ourself
			if ( this._rgba[ 3 ] === 1 ) {
				return this;
			}

			var rgb = this._rgba.slice(),
				a = rgb.pop(),
				blend = opaque._rgba;

			return color( jQuery.map( rgb, function( v, i ) {
				return ( 1 - a ) * blend[ i ] + a * v;
			}));
		},
		toRgbaString: function() {
			var rgba = jQuery.map( this._rgba, function( v ) {
				return v === null ? 0 : v;
			});

			if ( rgba[ 3 ] === 1 ) {
				rgba.length = 3;
			}

			return ( rgba.length === 3 ? "rgb(" : "rgba(" ) + rgba.join(",") + ")";
		},
		toHslaString: function() {
			var hsla = jQuery.map( this.hsla(), function( v, i ) {
				v = v === null ? 0 : v;
				if ( i === 1 || i === 2 ) {
					v = Math.round( v * 100 ) + "%";
				}
				return v;
			});
			if ( hsla[ 3 ] === 1 ) {
				hsla.length = 3;
			}
			return ( hsla.length === 3 ? "hsl(" : "hsla(" ) + hsla.join(",") + ")";
		},
		toHexString: function( includeAlpha ) {
			var rgba = this._rgba.slice();
			if ( !includeAlpha ) {
				rgba.length = 3;
			}

			return "#" + jQuery.map( rgba, function( v, i ) {
				var fac = ( i === 3 ) ? 255 : 1,
					hex = ( v * fac ).toString( 16 );

				return hex.length === 1 ? "0" + hex : hex.substr(0, 2);
			}).join("");
		},
		toString: function() {
			if ( this._rgba[ 3 ] === 0 ) {
				return "transparent";
			}
			return this.toRgbaString();
		}
	};
	color.fn.parse.prototype = color.fn;

	// Creates Setter/Getter for
	function makeSetterGetter( space, key, prop ) {

		// alpha is included in more than one space
		if ( color.fn[ key ] ) {
			return;
		}
		color.fn[ key ] = function( value ) {
			var vtype = jQuery.type( value ),
				fn = ( key === 'alpha' ? ( this._hsla ? 'hsla' : 'rgba' ) : space ),
				local = this[ fn ](),
				cur = local[ prop.idx ],
				match;

			if ( vtype === "undefined" ) {
				return cur;
			}

			if ( vtype === "function" ) {
				value = value.call( this, cur );
				vtype = jQuery.type( value );
			}
			if ( value == null && prop.empty ) {
				return this;
			}
			if ( vtype === "string" ) {
				match = rplusequals.exec( value );
				if ( match ) {
					value = cur + parseFloat( match[ 2 ] ) * ( match[ 1 ] === "+" ? 1 : -1 );
				}
			}
			local[ prop.idx ] = value;
			return this[ fn ]( local );
		};
	}

	// Create .red() .green() .blue() .alpha()
	jQuery.each( rgbaspace, function( key, prop ) {
		makeSetterGetter( "rgba", key, prop );
	});

	// create .hue() .saturation() .lightness()
	jQuery.each( hslaspace, function( key, prop ) {
		makeSetterGetter( "hsla", key, prop );
	});

	// hsla conversions adapted from:
	// http://www.google.com/codesearch/p#OAMlx_jo-ck/src/third_party/WebKit/Source/WebCore/inspector/front-end/Color.js&d=7&l=193
	function toHsla( rgba ) {
		var r = rgba[ 0 ] / 255,
			g = rgba[ 1 ] / 255,
			b = rgba[ 2 ] / 255,
			a = rgba[ 3 ],
			max = Math.max( r, g, b ),
			min = Math.min( r, g, b ),
			diff = max - min,
			add = max + min,
			l = add * 0.5,
			h, s;

		if ( min === max ) {
			h = 0;
		} else if ( r === max ) {
			h = ( ( 60 * ( g - b ) / diff ) + 360 ) % 360;
		} else if ( g === max ) {
			h = ( 60 * ( b - r ) / diff ) + 120;
		} else {
			h = ( 60 * ( r - g ) / diff ) + 240;
		}

		if ( l === 0 || l === 1 ) {
			s = l;
		} else if ( l <= 0.5 ) {
			s = diff / add;
		} else {
			s = diff / ( 2 - add );
		}
		return [ h, s, l, a ];
	}

	function hue2rgb( p, q, h ) {
		h = ( h + 1 ) % 1;
		if ( h * 6 < 1 ) {
			return p + (q - p) * 6 * h;
		}
		if ( h * 2 < 1) {
			return q;
		}
		if ( h * 3 < 2 ) {
			return p + (q - p) * ((2/3) - h) * 6;
		}
		return p;
	}

	function fromHsla( hsla ) {
		var h = hsla[ 0 ] / 360,
			s = hsla[ 1 ],
			l = hsla[ 2 ],
			a = hsla[ 3 ],
			q = l <= 0.5 ? l * ( 1 + s ) : l + s - l * s,
			p = 2 * l - q,
			r, g, b;
		
		return [
			Math.round( hue2rgb( p, q, h + ( 1 / 3 ) ) * 255 ),
			Math.round( hue2rgb( p, q, h ) * 255 ),
			Math.round( hue2rgb( p, q, h - ( 1 / 3 ) ) * 255 ),
			a
		];
	}

	// add .fx.step functions
	jQuery.each( stepHooks, function( i, hook ) {
		jQuery.cssHooks[ hook ] = {
			set: function( elem, value ) {
				value = color( value );
				if ( !support.rgba && value._rgba[ 3 ] !== 1 ) {
					var curElem = hook === "backgroundColor" ? elem.parentNode : elem,
						backgroundColor;
					do {
						backgroundColor = jQuery.curCSS( curElem, "backgroundColor" );
						if ( backgroundColor !== "" && backgroundColor !== "transparent" ) {
							break;
						}

					} while ( ( elem = elem.parentNode ) && elem.style );

					value = value.blend( color( backgroundColor || "_default" ) );
				}

				value = value.toRgbaString();

				elem.style[ hook ] = value;
			}
		};
		jQuery.fx.step[ hook ] = function( fx ) {
			if ( !fx.colorInit ) {
				fx.start = color( fx.elem, hook );
				fx.end = color( fx.end );
				fx.colorInit = true;
			}
			jQuery.cssHooks[ hook ].set( fx.elem, fx.start.transition( fx.end, fx.pos ) );
		};
	});

	// detect rgba support
	jQuery(function() {
		var div = document.createElement( "div" ),
			div_style = div.style;

		div_style.cssText = "background-color:rgba(150,255,150,.5)";
		support.rgba = div_style.backgroundColor.indexOf( "rgba" ) > -1;
	});

	// Some named colors to work with
	// From Interface by Stefan Petre
	// http://interface.eyecon.ro/
	colors = jQuery.Color.names = {
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
		transparent: [ null, null, null, 0 ],
		_default: [ 255, 255, 255 ]
	};
})( jQuery );
