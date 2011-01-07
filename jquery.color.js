/**
 * jQuery color plugin
 * Copyright (c) 2010, Robert Eisele (robert@xarg.org)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * Date: 06/21/2010
 *
 * @author Robert Eisele
 * @version 1.4
 *
 * @see http://www.xarg.org/project/jquery-color-plugin-xcolor/
 **/

(function ($) {

    // http://www.w3.org/TR/css3-color/#svg-color
    var color_names = {
	transparent: 16777216,
	aliceblue: 15792383,
	antiquewhite: 16444375,
	aqua: 65535,
	aquamarine: 8388564,
	azure: 15794175,
	beige: 16119260,
	bisque: 16770244,
	black: 0,
	blanchedalmond: 16772045,
	blue: 255,
	blueviolet: 9055202,
	brown: 10824234,
	burlywood: 14596231,
	cadetblue: 6266528,
	chartreuse: 8388352,
	chocolate: 13789470,
	coral: 16744272,
	cornflowerblue: 6591981,
	cornsilk: 16775388,
	crimson: 14423100,
	cyan: 65535,
	darkblue: 139,
	darkcyan: 35723,
	darkgoldenrod: 12092939,
	darkgray: 11119017,
	darkgreen: 25600,
	darkgrey: 11119017,
	darkkhaki: 12433259,
	darkmagenta: 9109643,
	darkolivegreen: 5597999,
	darkorange: 16747520,
	darkorchid: 10040012,
	darkred: 9109504,
	darksalmon: 15308410,
	darkseagreen: 9419919,
	darkslateblue: 4734347,
	darkslategray: 3100495,
	darkslategrey: 3100495,
	darkturquoise: 52945,
	darkviolet: 9699539,
	deeppink: 16716947,
	deepskyblue: 49151,
	dimgray: 6908265,
	dimgrey: 6908265,
	dodgerblue: 2003199,
	firebrick: 11674146,
	floralwhite: 16775920,
	forestgreen: 2263842,
	fuchsia: 16711935,
	gainsboro: 14474460,
	ghostwhite: 16316671,
	gold: 16766720,
	goldenrod: 14329120,
	gray: 8421504,
	green: 32768,
	greenyellow: 11403055,
	grey: 8421504,
	honeydew: 15794160,
	hotpink: 16738740,
	indianred: 13458524,
	indigo: 4915330,
	ivory: 16777200,
	khaki: 15787660,
	lavender: 15132410,
	lavenderblush: 16773365,
	lawngreen: 8190976,
	lemonchiffon: 16775885,
	lightblue: 11393254,
	lightcoral: 15761536,
	lightcyan: 14745599,
	lightgoldenrodyellow: 16448210,
	lightgray: 13882323,
	lightgreen: 9498256,
	lightgrey: 13882323,
	lightpink: 16758465,
	lightsalmon: 16752762,
	lightseagreen: 2142890,
	lightskyblue: 8900346,
	lightslategray: 7833753,
	lightslategrey: 7833753,
	lightsteelblue: 11584734,
	lightyellow: 16777184,
	lime: 65280,
	limegreen: 3329330,
	linen: 16445670,
	magenta: 16711935,
	maroon: 8388608,
	mediumaquamarine: 6737322,
	mediumblue: 205,
	mediumorchid: 12211667,
	mediumpurple: 9662683,
	mediumseagreen: 3978097,
	mediumslateblue: 8087790,
	mediumspringgreen: 64154,
	mediumturquoise: 4772300,
	mediumvioletred: 13047173,
	midnightblue: 1644912,
	mintcream: 16121850,
	mistyrose: 16770273,
	moccasin: 16770229,
	navajowhite: 16768685,
	navy: 128,
	oldlace: 16643558,
	olive: 8421376,
	olivedrab: 7048739,
	orange: 16753920,
	orangered: 16729344,
	orchid: 14315734,
	palegoldenrod: 15657130,
	palegreen: 10025880,
	paleturquoise: 11529966,
	palevioletred: 14381203,
	papayawhip: 16773077,
	peachpuff: 16767673,
	peru: 13468991,
	pink: 16761035,
	plum: 14524637,
	powderblue: 11591910,
	purple: 8388736,
	red: 16711680,
	rosybrown: 12357519,
	royalblue: 4286945,
	saddlebrown: 9127187,
	salmon: 16416882,
	sandybrown: 16032864,
	seagreen: 3050327,
	seashell: 16774638,
	sienna: 10506797,
	silver: 12632256,
	skyblue: 8900331,
	slateblue: 6970061,
	slategray: 7372944,
	slategrey: 7372944,
	snow: 16775930,
	springgreen: 65407,
	steelblue: 4620980,
	tan: 13808780,
	teal: 32896,
	thistle: 14204888,
	tomato: 16737095,
	turquoise: 4251856,
	violet: 15631086,
	wheat: 16113331,
	white: 16777215,
	whitesmoke: 16119285,
	yellow: 16776960,
	yellowgreen: 10145074
    };

    /**
     * @constructor
     */
    function xColor(color) {

	function _normalize(n, s) {

	    var m;

	    if (void 0 === s) {
		n = parseInt(n, 10);
		s = 255;
		m = 255;
	    } else {

		if (1 === s) {

		    if (void 0 === n) {
			return 1;
		    }

		    s = 100;
		    m = 1;
		} else {
		    m = s;
		}

		n = parseFloat(n);
	    }

	    if (isNaN(n) || n <= 0) {
		return 0;
	    }

	    if (s < n) {
		return m;
	    }

	    if (n <= 1) {
		if (m === 1) {
		    return n;
		} else {
		    return (n * m) | 0;
		}
	    }
	    return n * m / s;
	}

	function _hsl(h,s,l) {

	    h = _normalize(h, 360) / 360;
	    s = _normalize(s, 1);
	    l = _normalize(l, 1);

	    if (0 === s) {
		l = Math.round(l * 255);
		return [l, l, l];
	    }

	    function _hue(v1, v2, h) {
		if (h < 0) ++h;
		if (h > 1) --h;
		if (6 * h < 1) return v1 + (v2 - v1) * 6 * h;
		if (2 * h < 1) return v2;
		if (3 * h < 2) return v1 + (v2 - v1) * (4 - 6 * h);
		return v1;
	    }

	    var v = l < 0.5 ? (l + l * s) : (l + s - l * s);
	    var m = l + l - v;

	    return [
	    Math.round(255 *_hue(m, v, h + 1 / 3)),
	    Math.round(255 *_hue(m, v, h)),
	    Math.round(255 *_hue(m, v, h - 1 / 3)) ];
	}

	function _hsv(h,s,v) {

	    h = _normalize(h, 360) / 60;
	    s = _normalize(s, 1);
	    v = _normalize(v, 1);

	    var hi = h|0;
	    var f = h - hi;

	    if (!(hi & 1)) f = 1 - f;

	    var m = Math.round(255 * (v * (1 - s)));
	    var n = Math.round(255 * (v * (1 - s * f)));

	    v = Math.round(255 * v);

	    switch (hi) {
		case 6:
		case 0:
		    return [v, n, m];
		case 1:
		    return [n, v, m];
		case 2:
		    return [m, v, n];
		case 3:
		    return [m, n, v];
		case 4:
		    return [n, m, v];
		case 5:
		    return [v, m, n];
	    }
	}

	this.setColor = function (color) {

	    this.success = true;

	    if (typeof color === "number") {

		this.a =((color >> 24) & 0xff) / 255;
		this.r = (color >> 16) & 0xff;
		this.g = (color >>  8) & 0xff;
		this.b = (color      ) & 0xff;
		return;
	    }

	    while (typeof color === "object") {

		if (0 in color && 1 in color && 2 in color) {
		    this.a = _normalize(color[3], 1);
		    this.r = _normalize(color[0]);
		    this.g = _normalize(color[1]);
		    this.b = _normalize(color[2]);
		    return;
		} else if ('r' in color && 'g' in color && 'b' in color) {
		    this.a = _normalize(color.a, 1);
		    this.r = _normalize(color.r);
		    this.g = _normalize(color.g);
		    this.b = _normalize(color.b);
		    return;
		} else if ('h' in color && 's' in color) {

		    var rgb;

		    if ('l' in color) {
			rgb = _hsl(color.h, color.s, color.l);
		    } else if ('v' in color) {
			rgb = _hsv(color.h, color.s, color.v);
		    } else if ('b' in color) {
			rgb = _hsv(color.h, color.s, color.b);
		    } else {
			break;
		    }

		    this.a = _normalize(color.a, 1);
		    this.r = rgb[0];
		    this.g = rgb[1];
		    this.b = rgb[2];
		    return;
		}
		break;
	    }

	    if (typeof color !== "string") {
		this.success = false;
		return;
	    }

	    color = color.toLowerCase().replace(/[^a-z0-9,.()#%]/g, '');

	    var part, c;

	    if (color in color_names) {

		c = color_names[color];

		this.a =(!((c >> 24) & 0xff))|0;
		this.r =  ((c >> 16) & 0xff);
		this.g =  ((c >>  8) & 0xff);
		this.b =  ((c      ) & 0xff);
		return;
	    }

	    // 53892983
	    if (part = /^([1-9]\d*)$/.exec(color)) {

		c = parseInt(part[1], 10);

		this.a =(((c >> 24) & 0xff) || 255) / 255;
		this.r = ((c >> 16) & 0xff);
		this.g = ((c >>  8) & 0xff);
		this.b = ((c      ) & 0xff);
		return;
	    }

	    // #ff9000, #ff0000
	    if (part = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/.exec(color)) {
		this.a = 1;
		this.r = parseInt(part[1], 16);
		this.g = parseInt(part[2], 16);
		this.b = parseInt(part[3], 16);
		return;
	    }

	    // #f00, fff
	    if (part = /^#?([0-9a-f])([0-9a-f])([0-9a-f])$/.exec(color)) {
		this.a = 1;
		this.r = parseInt(part[1] + part[1], 16);
		this.g = parseInt(part[2] + part[2], 16);
		this.b = parseInt(part[3] + part[3], 16);
		return;
	    }

	    // rgb(1, 234, 56)
	    if (part = /^rgba?\((\d{1,3}),(\d{1,3}),(\d{1,3})(,([0-9.]+))?\)$/.exec(color)) {
		this.a = _normalize(part[5], 1);
		this.r = _normalize(part[1]);
		this.g = _normalize(part[2]);
		this.b = _normalize(part[3]);
		return;
	    }

	    // rgb(66%, 55%, 44%) in [0,100]%, [0,100]%, [0,100]%
	    if (part = /^rgba?\(([0-9.]+\%),([0-9.]+\%),([0-9.]+\%)(,([0-9.]+)\%?)?\)$/.exec(color)) {
		this.a = _normalize(part[5], 1);
		this.r = Math.round(_normalize(part[1], 100) * 2.55);
		this.g = Math.round(_normalize(part[2], 100) * 2.55);
		this.b = Math.round(_normalize(part[3], 100) * 2.55);
		return;
	    }

	    // hsv(64, 40, 16) in [0, 360], [0,100], [0,100]
	    if (part = /^hs([bvl])a?\((\d{1,3}),(\d{1,3}),(\d{1,3})(,([0-9.]+))?\)$/.exec(color)) {
		var func;
		if (part[1] === "l") {
		    func = _hsl;
		} else {
		    func = _hsv;
		}

		c = func(parseInt(part[2], 10), parseInt(part[3], 10), parseInt(part[4], 10));

		this.a = _normalize(part[6], 1);
		this.r = c[0];
		this.g = c[1];
		this.b = c[2];
		return;
	    }

	    // 1, 234, 56
	    if (part = /^(\d{1,3}),(\d{1,3}),(\d{1,3})(,([0-9.]+))?$/.exec(color)) {
		this.a = _normalize(part[5], 1);
		this.r = _normalize(part[1]);
		this.g = _normalize(part[2]);
		this.b = _normalize(part[3]);
		return;
	    }

	    this.success = false;
	}

	this.getColor = function (type) {

	    if (void 0 !== type) switch (type.toLowerCase()) {
		case "rgb":
		    return this.getRGB();
		case "hsv":
		case "hsb":
		    return this.getHSV();
		case "hsl":
		    return this.getHSL();
		case "int":
		    return this.getInt();
		case "array":
		    return this.getArray();
		case "fraction":
		    return this.getFraction();
		case "css":
		case "style":
		    return this.getCSS();
		case "name":
		    return this.getName();
	    }
	    return this.getHex();
	}

	this.getRGB = function () {

	    if (this.success) {

		return {
		    r: this.r,
		    g: this.g,
		    b: this.b,
		    a: this.a
		};
	    }
	    return null;
	}

	this.getCSS = function () {

	    if (this.success) {

		if (this.a == 1) {
		    return 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')';
		}
		return 'rgba(' + this.r + ', ' + this.g + ', ' + this.b + ', ' + this.a + ')';
	    }
	    return null;
	}

	this.getArray = function () {

	    if (this.success) {
		return [this.r, this.g, this.b, this.a * 100 | 0];
	    }
	    return null;
	}

	this.getName = function () {

	    if (this.success) {

		var lowest = null;
		var lowest_ndx;

		var table = color_names;

		var a = this.getHSL();

		for (var i in table) {

		    /* We do not handle transparency */
		    var b = new xColor(table[i]).getHSL();

		    var tmp = Math.sqrt(0.5 * (a.h - b.h) * (a.h - b.h) + 0.5 * (a.s - b.s) * (a.s - b.s) + (a.l - b.l) * (a.l - b.l));

		    if (null === lowest || tmp < lowest) {
			lowest = tmp;
			lowest_ndx = i;
		    }
		}
		return lowest_ndx;
	    }
	    return null;
	}

	this.getFraction = function () {

	    if (this.success) {

		return {
		    r: this.r / 255,
		    g: this.g / 255,
		    b: this.b / 255,
		    a: this.a
		};
	    }
	    return null;
	}

	this.getHSL = function () {

	    // inspiration: http://130.113.54.154/~monger/hsl-rgb.html
	    if (this.success) {

		var r = this.r / 255;
		var g = this.g / 255;
		var b = this.b / 255;

		var min = Math.min(r, g, b);
		var max = Math.max(r, g, b);
		var delta = max - min;

		var h, s, l = (max + min) / 2;

		if (0 == delta) {
		    h = 0;
		    s = 0;
		} else {

		    if (max == r) {
			h = (g - b) / delta;
		    } else if (max == g) {
			h = 2 + (b - r) / delta;
		    } else if (max == b) {
			h = 4 + (r - g) / delta;
		    }

		    if (h < 0) {
			h+= 6;
		    }
	    	    s = delta / (l < 0.5 ? max + min : 2 - max - min);
		}
		return {
		    h: Math.round(h * 60),
		    s: Math.round(s * 100),
		    l: Math.round(l * 100),
		    a: this.a
		};
	    }
	    return null;
	}

	this.getHSV = function () {

	    if (this.success) {

		var r = this.r / 255;
		var g = this.g / 255;
		var b = this.b / 255;

		var min = Math.min(r, g, b);
		var max = Math.max(r, g, b);
		var delta = max - min;

		var h, s, v = max;

		if (0 == delta) {
		    h = 0;
		    s = 0;
		} else {
		    s = delta / max;

		    delta*= 6;

		    var dR = .5 + (max - r) / delta;
		    var dG = .5 + (max - g) / delta;
		    var dB = .5 + (max - b) / delta;

		    if (r == max) {
			h = dB - dG;
		    } else if (g == max) {
			h = 1 / 3 + dR - dB;
		    } else if (b == max) {
			h = 2 / 3 + dG - dR;
		    }

		    if (h < 0) ++h;
		    if (h > 1) --h;
		}

		return {
		    h: Math.round(h * 360),
		    s: Math.round(s * 100),
		    v: Math.round(v * 100),
		    a: this.a
		};
	    }
	    return null;
	}

	this.getHex = function () {

	    if (this.success) {

		var chars = "0123456789abcdef";

		var r1 = this.r >> 4;
		var g1 = this.g >> 4;
		var b1 = this.b >> 4;

		var r2 = this.r & 0xf;
		var g2 = this.g & 0xf;
		var b2 = this.b & 0xf;

		if (0 === ((r1 ^ r2) | (g1 ^ g2) | (b1 ^ b2))) {
		    return '#' + chars.charAt(r1) + chars.charAt(g1) + chars.charAt(b1);
		}
		return '#'
		+ chars.charAt(r1) + chars.charAt(r2)
		+ chars.charAt(g1) + chars.charAt(g2)
		+ chars.charAt(b1) + chars.charAt(b2);
	    }
	    return null;
	}

	this.getInt = function (alpha) {

	    if (this.success) {
		if (void 0 !== alpha) {
		    return ((this.a * 100 | 0) << 24 ^ this.r << 16 ^ this.g << 8 ^ this.b);
		}
		return (this.r << 16 ^ this.g << 8 ^ this.b) & 0xffffff;
	    }
	    return null;
	}

	this.toString = function () {
	    return this.getHex();
	}

	this.setColor(color);
    }

    $.each(['color', 'backgroundColor', 'borderColor', 'borderTopColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor', 'outlineColor'], function(i, attr) {

	$.fx.step[attr] = function(fx) {

	    if (fx.xinit === void 0) {

		if (typeof fx.end === "string" && -1 !== fx.end.indexOf(";")) {

		    var x, arr = fx.end.split(";");

		    if (arr.length > 2) {

			for (x in arr) {
			    if (-1 === arr[x].indexOf('native')) {
				arr[x] = new xColor(arr[x]);
			    } else {
				arr[x] = findColor(fx.elem, attr);
			    }
			}
			fx.start = null;
			fx.end = arr;
		    } else {
			fx.start = new xColor(arr[0]);
			fx.end = new xColor(arr[1]);
		    }
		} else {
		    fx.start = findColor(fx.elem, attr);
		    fx.end = new xColor(fx.end);
		}

		fx.xinit = 1;
	    }

	    var S = fx.start;
	    var E = fx.end;
	    var P = fx.pos;

	    if (null === S) {
		var m = P * (E.length - 1), n = P < 1 ? m | 0 : E.length - 2;
		S = E[n];
		E = E[n + 1];
		P = m - n;
	    }

	    if ($.support.opacity) {
		fx.elem.style[attr] = "rgba("
		+ ((S.r + (E.r - S.r) * P)|0) + ","
		+ ((S.g + (E.g - S.g) * P)|0) + ","
		+ ((S.b + (E.b - S.b) * P)|0) + ","
		+ ((S.a + (E.a - S.a) * P)) + ")";
	    } else {
		fx.elem.style[attr] = "rgb("
		+ ((S.r + (E.r - S.r) * P)|0) + ","
		+ ((S.g + (E.g - S.g) * P)|0) + ","
		+ ((S.b + (E.b - S.b) * P)|0) + ")";
	    }
	}
    });

    function findColor(elem, attr) {

	var color = "";

	do {
	    color = $.curCSS(elem, attr);

	    if ("" !== color && "transparent" !== color && "rgba(0, 0, 0, 0)" !== color || $.nodeName(elem, "body")) break;

	} while (elem = elem.parentNode);

	if ("" === color) {

	    if ($.support.opacity) {
		color = "transparent";
	    } else if ("backgroundColor" === attr) {
		color = "white";
	    } else {
		color = "black";
	    }
	}
	return new xColor(color);
    }

    /**
     * @constructor
     */
    function xColorMix() {

	this.test = function (col) {

	    var c = new xColor(col);

	    if (c.success) {
		return c;
	    }
	    return null;
	}

	this.red = function (col) {

	    var c = new xColor(col);

	    if (c.success) {
		c.g = 0xff;
		c.b = 0xff;
		return c;
	    }
	    return null;
	}

	this.blue = function (col) {

	    var c = new xColor(col);

	    if (c.success) {
		c.r = 0xff;
		c.g = 0xff;
		return c;
	    }
	    return null;
	}

	this.green = function (col) {

	    var c = new xColor(col);

	    if (c.success) {
		c.r = 0xff;
		c.b = 0xff;
		return c;
	    }
	    return null;
	}

	this.sepia = function(col) {

	    var c = new xColor(col);

	    // Microsoft's sepia function http://msdn.microsoft.com/en-us/magazine/cc163866.aspx
	    if (c.success) {

		var r = c.r, g = c.g, b = c.b;

		c.r = Math.round(r * 0.393 + g * 0.769 + b * 0.189);
		c.g = Math.round(r * 0.349 + g * 0.686 + b * 0.168);
		c.b = Math.round(r * 0.272 + g * 0.534 + b * 0.131);

		return c;
	    }
	    return null;
	}

	this.random = function () {

	    return new xColor([
		(255 * Math.random())|0,
		(255 * Math.random())|0,
		(255 * Math.random())|0
		]);
	}

	this.complementary = function (col) {

	    var c = new xColor(col);

	    if (c.success) {
		c.r^= 0xff;
		c.g^= 0xff;
		c.b^= 0xff;
		return c;
	    }
	    return null;
	}

	this.opacity = function (x, y, o) {

	    var a = new xColor(x);
	    var b = new xColor(y);

	    if (a.success & b.success) {

		if (o > 1) {
		    o/= 100;
		}

		o = Math.max(o - 1 + b.a, 0);

		a.r = Math.round((b.r - a.r) * o + a.r);
		a.g = Math.round((b.g - a.g) * o + a.g);
		a.b = Math.round((b.b - a.b) * o + a.b);

		return a;
	    }
	    return null;
	}

	this.greyfilter = function (col, formula) {

	    var v, c = new xColor(col);

	    if (c.success) {
		switch (formula) {
		    case 1:
			// My own formula
			v = .35 + 13 * (c.r + c.g + c.b) / 60;
			break;
		    case 2:
			// Sun's formula: (1 - avg) / (100 / 35) + avg)
			v = (13 * (c.r + c.g + c.b) + 5355) / 60;
			break;
		    default:
			v = c.r * .3 + c.g * .59 + c.b * .11;
		}
		c.r = c.g = c.b = Math.min(v|0, 255);

		return c;
	    }
	    return null;
	}

	this.webround = function (col) {

	    var c = new xColor(col);

	    if (c.success) {
		if ((c.r+= 0x33 - c.r % 0x33) > 0xff) c.r = 0xff;
		if ((c.g+= 0x33 - c.g % 0x33) > 0xff) c.g = 0xff;
		if ((c.b+= 0x33 - c.b % 0x33) > 0xff) c.b = 0xff;
		return c;
	    }
	    return null;
	}

	this.distance = function (x, y) {

	    var a = new xColor(x);
	    var b = new xColor(y);

	    if (a.success & b.success) {
		// Approximation attempt of http://www.compuphase.com/cmetric.htm
		return Math.sqrt(3 * (b.r - a.r) * (b.r - a.r) + 4 * (b.g - a.g) * (b.g - a.g) + 2 * (b.b - a.b) * (b.b - a.b));
	    }
	    return null;
	}

	this.readable = function (bg, col) {

	    var a = new xColor(col);
	    var b = new xColor(bg);

	    if (a.success & b.success) {
		return (
		    (b.r - a.r) * (b.r - a.r) +
		    (b.g - a.g) * (b.g - a.g) +
		    (b.b - a.b) * (b.b - a.b)) > 0x28A4;
	    }
	    return null;
	}

	this.combine = function (x, y) {

	    var a = new xColor(x);
	    var b = new xColor(y);

	    if (a.success & b.success) {
		a.r^= b.r;
		a.g^= b.g;
		a.b^= b.b;
		return a;
	    }
	    return null;
	}

	this.breed = function (x, y) {

	    var a = new xColor(x);
	    var b = new xColor(y);

	    var mask = 0;

	    if (a.success & b.success) {

		for (var i = 0; i < 6; ++i) {
		    if (Math.random() < .5) {
			mask|= 0x0f << (i << 2);
		    }
		}

		a.r = (a.r & ((mask >> 0x10) & 0xff)) | (b.r & (((mask >> 0x10) & 0xff) ^ 0xff));
		a.g = (a.g & ((mask >> 0x08) & 0xff)) | (b.g & (((mask >> 0x08) & 0xff) ^ 0xff));
		a.b = (a.b & ((mask >> 0x00) & 0xff)) | (b.b & (((mask >> 0x00) & 0xff) ^ 0xff));
		return a;
	    }
	    return null;
	}

	this.additive = function (x, y) {

	    var a = new xColor(x);
	    var b = new xColor(y);

	    if (a.success & b.success) {

		if ((a.r+= b.r) > 0xff) a.r = 0xff;
		if ((a.g+= b.g) > 0xff) a.g = 0xff;
		if ((a.b+= b.b) > 0xff) a.b = 0xff;

		return a;
	    }
	    return null;
	}

	this.subtractive = function (x, y) {

	    var a = new xColor(x);
	    var b = new xColor(y);

	    if (a.success & b.success) {

		if ((a.r+= b.r - 0xff) < 0) a.r = 0;
		if ((a.g+= b.g - 0xff) < 0) a.g = 0;
		if ((a.b+= b.b - 0xff) < 0) a.b = 0;

		return a;
	    }
	    return null;
	}

	this.subtract = function (x, y) {

	    var a = new xColor(x);
	    var b = new xColor(y);

	    if (a.success & b.success) {

		if ((a.r-= b.r) < 0) a.r = 0;
		if ((a.g-= b.g) < 0) a.g = 0;
		if ((a.b-= b.b) < 0) a.b = 0;

		return a;
	    }
	    return null;
	}

	this.multiply = function (x, y) {

	    var a = new xColor(x);
	    var b = new xColor(y);

	    if (a.success & b.success) {
		a.r = (a.r / 255 * b.r)|0;
		a.g = (a.g / 255 * b.g)|0;
		a.b = (a.b / 255 * b.b)|0;
		return a;
	    }
	    return null;
	}

	this.average = function (x, y) {

	    var a = new xColor(x);
	    var b = new xColor(y);

	    if (a.success & b.success) {
		a.r = (a.r + b.r) >> 1;
		a.g = (a.g + b.g) >> 1;
		a.b = (a.b + b.b) >> 1;
		return a;
	    }
	    return null;
	}

	this.triad = function (col) {

	    var c = new xColor(col);

	    if (c.success) {

		return [c,
		new xColor([c.b, c.r, c.g]),
		new xColor([c.g, c.b, c.r])];
	    }
	    return null;
	}

	this.tetrad = function (col) {

	    var c = new xColor(col);

	    if (c.success) {

		return [c,
		new xColor([c.b, c.r, c.b]),
		new xColor([c.b, c.g, c.r]),
		new xColor([c.r, c.b, c.r])];
	    }
	    return null;
	}

	this.gradientlevel = function (x, y, level, deg) {

	    if (level > deg) return null;

	    var a = new xColor(x);
	    var b = new xColor(y);

	    if (a.success & b.success) {

		a.r = (a.r + ((b.r - a.r) / deg) * level)|0;
		a.g = (a.g + ((b.g - a.g) / deg) * level)|0;
		a.b = (a.b + ((b.b - a.b) / deg) * level)|0;

		return a;
	    }
	    return null;
	}

	this.gradientarray = function (arr, ndx, size) {

	    if (ndx > size) return null;

	    var e = (ndx * (arr.length - 1) / size)|0;
	    var m = (ndx - size * e / (arr.length - 1)) / size;

	    var a = new xColor(arr[e]);
	    var b = new xColor(arr[e + 1]);

	    if (a.success & b.success) {

		a.r = (a.r + arr.length * (b.r - a.r) * m)|0;
		a.g = (a.g + arr.length * (b.g - a.g) * m)|0;
		a.b = (a.b + arr.length * (b.b - a.b) * m)|0;

		return a;
	    }
	    return null;
	}

	this.nearestname = function (a) {

	    a = new xColor(a);

	    if (a.success) {
		return a.getName();
	    }
	    return null;
	}

	this.darken = function (col, by, shade) {

	    if (by === void 0) {
		by = 1;
	    } else if (by < 0) return this.lighten(col, -by, shade);

	    if (shade === void 0) {
		shade = 32;
	    }

	    var c = new xColor(col);

	    if (c.success) {
		if ((c.r-= shade * by) < 0) c.r = 0;
		if ((c.g-= shade * by) < 0) c.g = 0;
		if ((c.b-= shade * by) < 0) c.b = 0;
		return c;
	    }
	    return null;
	}

	this.lighten = function (col, by, shade) {

	    if (by === void 0) {
		by = 1;
	    } else if (by < 0) return this.darken(col, -by, shade);

	    if (shade === void 0) {
		shade = 32;
	    }

	    var c = new xColor(col);

	    if (c.success) {
		if ((c.r+= shade * by) > 0xff) c.r = 0xff;
		if ((c.g+= shade * by) > 0xff) c.g = 0xff;
		if ((c.b+= shade * by) > 0xff) c.b = 0xff;
		return c;
	    }
	    return null;
	}

	this.analogous = function (col, results, slices) {

	    if (results === void 0) {
		results = 8;
	    }

	    if (slices === void 0) {
		slices = 30;
	    }

	    var c = new xColor(col);

	    if (c.success) {

		var hsv = c.getHSV();
		var part = 360 / slices, ret = [ c ];

		for (hsv.h = ((hsv.h - (part * results >> 1)) + 720) % 360; --results; ) {
		    hsv.h+= part;
		    hsv.h%= 360;
		    ret.push(new xColor(hsv));
		}
		return ret;
	    }
	    return null;
	}

	this.splitcomplement = function (col) {

	    var c = new xColor(col);

	    if (c.success) {

		var hsv = c.getHSV();
		var ret = [ c ];

		hsv.h+= 72;
		hsv.h%= 360;
		ret.push(new xColor(hsv));

		hsv.h+= 144;
		hsv.h%= 360;
		ret.push(new xColor(hsv));

		return ret;
	    }
	    return null;
	}

	this.monochromatic = function (col, results) {

	    if (results === void 0) {
		results = 6;
	    }

	    var c = new xColor(col);

	    if (c.success) {

		var hsv = c.getHSV();
		var ret = [ c ];

		while (--results) {
		    hsv.v+= 20;
		    hsv.v%= 100;
		    ret.push(new xColor(hsv));
		}
		return ret;
	    }
	    return null;
	}
    }

    $.color = new xColorMix();

    $.fn.isReadable = function () {

	var elem = this[0];
	var f = "";
	var b = "";

	do {

	    if ("" === f && ("transparent" === (f = $.curCSS(elem, "color")) || "rgba(0, 0, 0, 0)" === f)) {
		f = "";
	    }

	    if ("" === b && ("transparent" === (b = $.curCSS(elem, "backgroundColor")) || "rgba(0, 0, 0, 0)" === b)) {
		b = "";
	    }

	    if ("" !== f && "" !== b || $.nodeName(elem, "body")) {
		break;
	    }

	} while (elem = elem.parentNode);

	if ("" === f) {
	    f = "black";
	}

	if ("" === b) {
	    b = "white";
	}

	// todo: if alpha != 1, use opacity() to calculate correct color on certain element and it's parent
	return $.color.readable(b, f);
    }

})(jQuery);
