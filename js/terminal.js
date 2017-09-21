(function ( $ ) {
 
    $.fn.terminalize = function( options ) {
 
        // This is the easiest way to have default options.
        var settings = $.extend({
            // These are the defaults.
            prompt: '>',
            color: '#556b2f',
            mode: 'display',
            backgroundColor: "white",
            cursor_interval: 500,
        }, options );
        
        var parent = this;
        var callback;
        var keypress;
        var current_line = '';
        
        // blink cursor
        if ( settings.cursor_interval > 0 ) {
            window.setInterval(function() {
                parent.cursorToggle()
            }, 500 );
        }
        
        // Greenify the collection based on the settings variable.
        return this.css({
            color: settings.color,
            backgroundColor: settings.backgroundColor
        });
 
    };
 
}( jQuery ));

function Terminal() {
    var parent = this;
    var prompt = ">";
    var mode = 'display';
    var callback;
    var keypress;
    var current_line = "";
    
    // blink cursor
    window.setInterval(function(){parent.cursorToggle()},500);
    
    // keypress handler
    jQuery(document).keypress(function(event) {
        var x = (event.which);
        if (mode === 'confirm') {
            jQuery(".terminal-cursor").remove();
            current_line = jQuery("#current-line").text();
            jQuery("#current-line").remove();
            jQuery("#terminal").append(current_line);
            parent.log("<br/>");
            callback(x);
        } else {
            if (x === 13) {
                /*
                    ENTER key
                */
                jQuery(".terminal-cursor").remove();
                current_line = jQuery("#current-line").text();
                jQuery("#current-line").remove();
                jQuery("#terminal").append(current_line);
                parent.log("<br/>");
                callback(current_line);
            } else {
                parent.logToLine(String.fromCharCode(x));
            }
        }
    });
    
    // keydown handler
    jQuery(document).keydown(function(event) {
        var x = (event.which);
        if (mode !== 'confirm') {
            if (x === 8) {
                /*
                    BACKSPACE key
                */
                
                // remove existing cursor
                jQuery(".terminal-cursor").remove();
                
                // get current line's text
                current_line = jQuery("#current-line").text();
                
                // get length of current line
                var len = current_line.length;
                
                // only do something if current line has content
                if (len > 0) {
                    
                    // remove last character from #current-line
                    current_line = current_line.substring(0, len - 1);
                    
                    // now remove #current-line
                    jQuery("#current-line").remove();
                    
                    // add adjusted #current-line
                    jQuery("#terminal").append('<span id="current-line">' + current_line + '</span>');
                    
                    // add back the cursor
                    jQuery("#current-line").append('<span class="terminal-cursor">_</span>');
                } else {
                    
                    // add back the cursor
                    jQuery("#current-line").append('<span class="terminal-cursor">_</span>');
                }
            }
        }
    });
    
    // getters
    this.getMode = function() {
        return mode;
    };
    
    // setters
    this.setMode = function(x) {
        if (x === 'input') {
            mode = x;
            this.log(prompt);
            jQuery("#terminal").append('<span id="current-line"></span');
            jQuery("#current-line").append('<span class="terminal-cursor">_</span>');
        } else if (x === 'confirm') {
            mode = x;
            this.log(prompt);
            jQuery("#terminal").append('<span id="current-line"></span');
            jQuery("#current-line").append('<span class="terminal-cursor">_</span>');
        }
    };
    
    this.setKeypress = function(x) {
        keypress = x;
    };
    
    this.setPrompt = function(string) {
        prompt = string;
    };
    
    this.setCallback = function(f) {
        callback = f;
    };
    
    // method for logging output to terminal
    this.log = function(string) {
        
        // add the new content
        jQuery("#terminal").append(string);
        
        // scroll to bottom of terminal
        jQuery("#terminal").scrollTop(jQuery("#terminal")[0].scrollHeight);
    };
    
    // helper method for linebreaks
    this.br = function(x) {
        x = typeof x !== 'undefined' ? x : 1;
        for (var i = 0; i < x; i++) {
            this.log('<br />');
        }
    };
    
    // method for logging output to current line
    this.logToLine = function(string) {
        
        // first remove existing cursor
        jQuery(".terminal-cursor").remove();
        
        // add the new content
        jQuery("#current-line").append(string);
        
        // lets add back in the cursor
        jQuery("#current-line").append('<span class="terminal-cursor">_</span>');
        
        // scroll to bottom of terminal
        jQuery("#terminal").scrollTop(jQuery("#terminal")[0].scrollHeight);
    };
    
    this.cursorToggle = function() {
        jQuery(".terminal-cursor").toggleClass("reverse");
    };
    
    this.prompt = function(string, callback) {
        parent.setPrompt(string);
        parent.setCallback(callback);
        parent.setMode('input');
    };
    
    this.confirm = function(string, callback) {
        parent.setPrompt(string);
        parent.setCallback(callback);
        parent.setMode('confirm');
    };
}
