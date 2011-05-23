#jQuery.Color()
Check out [Color Library on jQuery UI Planning Wiki](http://wiki.jqueryui.com/w/page/12137744/Color-Library) for more information about the new API in this branch

##Animated colors

The main purpose of this plugin to animate color properties on elements using jQuery's [`.animate()`](http://api.jquery.com/animate)

Supported Properties
-------
`backgroundColor`, `borderBottomColor`, `borderLeftColor`, `borderRightColor`, `borderTopColor`, `color`, `outlineColor`

Example Use
-------

    <!DOCTYPE html>
    <html>
    <head>
      <style>
    div {
    background-color:#bada55;
    width:100px;
    border:1px solid green;
    }
    </style>
    <script src="http://code.jquery.com/jquery-1.6.1.min.js"></script>
    <script src="jquery.color.min.js"></script>
    </head>
    <body>
    <button id="go">Simple</button>
    <button id="sat">Desaturate</button>
      <div id="block">Hello!</div>
    <script>
    $("#go").click(function(){
      $("#block").animate({
          backgroundColor: "#abcdef"
      }, 1500 );
    });
    $("#sat").click(function(){
      $("#block").animate({
          backgroundColor: $.Color({ saturation: 0 })
      }, 1500 );
    });
    </script>
    </body>
    </html>


##The $.Color Function Object
The `$.Color()` function allows you to work with colors.

1) Returns a new Color object, similar to $() or $.Event
 
2) Accepts a color value to create a new Color object with a `$.Color.fn` prototype

###Example uses:

    // Parsing String Colors:
    jQuery.Color( "#abcdef" );
    jQuery.Color( "rgb(100,200,255)" );
    jQuery.Color( "rgba(100,200,255,0.5)" );
    jQuery.Color( "aqua" );

    // Creating Color Objects in Code:
    // use null or undefined for values you wish to leave out
    jQuery.Color( red, green, blue, alpha );
    jQuery.Color([ red, green, blue, alpha ]);
    jQuery.Color({ red: red, green: green, blue: blue, alpha: alpha });
    jQuery.Color({ hue: hue, saturation: saturation, lightness: lightness, alpha: alpha });

    // Helper to get value from CSS
    jQuery.Color( element, cssProperty );

##jQuery.Color.fn / prototype / the Color Object methods

###Getters / Setters:

    red()             // returns the "red" component of the color ( Integer from 0 - 255 )
    red( val )        // returns a copy of the color object with the red set to val
    green()           // returns the "green" component of the color from ( Integer from 0 - 255 )
    green( val )      // returns a copy of the color object with the green set to val
    blue()            // returns the "blue" component of the color from ( Integer from 0 - 255 )
    blue( val )       // returns a copy of the color object with the blue set to val
    alpha()           // returns the "alpha" component of the color from ( Float from 0.0 - 1.0 )
    alpha( val )      // returns a copy of the color object with the alpha set to val
    hue()             // returns the "hue" component of the color ( Integer from 0 - 359 )
    hue( val )        // returns a copy of the color objec with the hue set to val
    saturation()      // returns the "hue" component of the color ( Float from 0.0 - 1.0 )
    saturation( val ) // returns a copy of the color objec with the hue set to val
    lightness()       // returns the "hue" component of the color ( Float from 0.0 - 1.0 )
    lightness( val )  // returns a copy of the color objec with the hue set to val
    // all of the above values can also take strings in the format of "+=100" or "-=100"

    rgba() // returns a rgba "tuple" [ red, green, blue, alpha ]
    // rgba() setters: returns a copy of the color with any defined values set to the new value
    rgba( red, green, blue, alpha )
    rgba({ red: red, green: green, blue: blue, alpha: alpha })
    rgba([ red, green, blue, alpha ])

    hsla() // returns a HSL tuple [ hue, saturation, lightness, alpha ]
    // much like the rgb setter - returns a copy with any defined values set
    hsla( hue, saturation, lightness, alpha ) 
    hsla({ hue: hue, saturation: saturation, lightness: lightness, alpha: alpha ) 
    hsla([ hue, saturation, lightness, alpha ]) 
    

###String Methods:
    toRgbString() // as css ex "rgba(255, 255, 255, 1)"
    toHslString() // returns a css string ex "hsla(330, 75%, 25%, 1)"
    toHexString( includeAlpha ) // as css ex "#abcdef" , with "includeAlpha" use "#rrggbbaa"

###Working with other colors:
    transition( othercolor, distance ) // the color distance ( 0.0 - 1.0 ) of the way between this color and othercolor
    blend( othercolor ) // Will apply this color on top of the other color using alpha blending


##jQuery.Color properties

####`jQuery.Color.names`
A list of named color tuples will be stored on `$.Color.names`.  The value they contain should be parsable by `$.Color()`... All named colors should be lowercased.  I.E. `$.Color("Red")` is the same as doing `$.Color( $.Color.names["red"] );`

There should also be a named color `"_default"` which is set to white, this is used for situations where a color is unparseable.

###`"transparent"`
A special note about the color `"transparent"` - it will return `null` for rgb unless you specify colors for these values... The transition funciton makes use of this by detecting null values and using the other endpoint - allowing for something like this:

    $.Color("#abcdef").transition("transparent", 0.5)

Animating to the value "transparent" will still use "#abcdef" for RGB the whole time....

##Internals on The Color Object
1) Internally, rgba is stored as `$colorObj._rgba[0] = red, $colorObj._rgba[1] = green, $colorObj._rgba[2] = blue, $colorObj._rgba[3] = alpha`.

2) `undefined`/`null` values for colors indicate non-existance. For example, animating to `_rgb[ 255, null, null, 1 ]` would only animate the 


##HSL Support

The internal color object properties will probably still be stored in RGBA. However if initiated with an HSLA color or an hsla operations is made, it will store/use the `_hsla` data and update the `_rgba` information as well. Once an RGBA operation is performed on HSLA, however, the `_hsla` cache is removed and all operations will continue based off of rgb.

The `._hsla` array will follow the same format as `._rbga`, `[h,s,l,a]`. 

Colors with 0 saturation, or 100%/0% lightness will be stored with a hue of 0

##Extensibility

It is possible for you to add your own functions to the color object, for instance, this function could tell you if its better to use black or white on a given background color.

    // method taken from https://gist.github.com/960189
    $.Color.fn.contrastColor = function() {
        var r = this._rgba[0], g = this._rgba[1], b = this._rgba[2];
        return (((r*299)+(g*587)+(b*144))/1000) >= 131.5 ? 'black' : 'white';
    };
