/*
 * jQuery Color Animations v@VERSION
 * Copyright 2011 John Resig
 * Released under the MIT and GPL licenses.
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
		support = color.support = {},

		// colors = jQuery.Color.names
		colors;

		function clamp( value, prop ) {
			if ( prop.empty && value == null ) {
				return null;
			}
			if ( prop.def && value == null ) {
				value = prop.def;
			}
			if ( prop.type === "int" ) {
				value = ~~value;
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

				var type = jQuery.type( red ),
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
							values = match && parser.parse( match );

						if ( values ) {
							jQuery.each( rgbaspace, function( key, prop ) {
								rgba[ prop.idx ] = clamp( values[ prop.idx ], prop );
							});

							// exit jQuery.each( stringParsers ) here because we found ours
							return false;
						}
					});

					// Found a stringParser that handled it
					if ( rgba.length !== 0 ) {
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
			}
		};
		color.fn.toString = color.fn.toRgbaString;
		color.fn.parse.prototype = color.fn;

		// Create .red() .green() .blue() .alpha()
		jQuery.each( rgbaspace, function( key, prop ) {
			color.fn[ key ] = function( value ) {
				var vtype = jQuery.type( value ),
					cur = this._rgba[ prop.idx ],
					copy, match;

				// called as a setter
				if ( arguments.length ) {
					if ( jQuery.isFunction( value ) ) {
						value = value.call( this, cur );
					}
					if ( value === null && prop.empty ) {
						return this;
					}

					if ( jQuery.type( value ) === "string") {
						match = rplusequals.exec( value );
						if ( match ) {
							value = cur + parseFloat( match[ 2 ] ) * ( match[ 1 ] === "+" ? 1 : -1 );
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
