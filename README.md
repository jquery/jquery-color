jQuery.color
=======
This plugin adds the ability to animate color properties on elements using jQuery's [`.animate()`](http://api.jquery.com/animate)

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
    background-color:#bca;
    width:100px;
    border:1px solid green;
    }
    </style>
    <script src="http://code.jquery.com/jquery-1.5.js"></script>
    <script src="jquery.color.js"></script>
    </head>
    <body>
      <button id="go">Run</button>
      <div id="block">Hello!</div>
    <script>
    $("#go").click(function(){
      $("#block").animate({
          backgroundColor: "#abcdef"
      }, 1500 );
    });
    </script>
    </body>
    </html>
