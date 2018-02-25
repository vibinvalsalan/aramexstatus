var Keyboard = function(keboard, onTextChangedHandler){
    var SPECIAL_KEY_HANDLERS = [];
    var self = this;
    self.onTextChangedHandler = onTextChangedHandler;
    self.shifted = false;
    self.alpha = false;
    self.text = "";

    var children = $(keboard).find("[data-key]");
    this.alphakeys = [];
    children.each(function(i){

        var k = $(children[i]).data("key");
        if(k.length == 1 && k >='a' && k <='ö'){
            self.alphakeys.push(children[i]);
        }

        $(children[i]).click(
            (function(key){
                return function(){
                    self.onKeyPressed(key);
                }
            })($(children[i]).data("key"))
        )
    });

    this.shift = function(){
        self.shifted = !self.shifted;
        self.alphakeys.forEach(function(k){
            var t = $(k);
            var v = t.html();
            if(self.shifted){
                $(k).html(v.toUpperCase());
            } else {
                $(k).html(v.toLowerCase());
            }
        });

        if(self.shifted){
            $(keboard).addClass('shifted');
        }else {
            $(keboard).removeClass('shifted');
        }
    };

    this.getKeyHandler = function(key){
        for(var i in SPECIAL_KEY_HANDLERS){
            if(i == key){
                return SPECIAL_KEY_HANDLERS[i];
            }
        }
        return this.handleStandardKey
    };

    this.setAlphaNumericEnabled = function(enabled){
        if(enabled){
            $(keboard).addClass('alphaNumeric');
        } else {
            $(keboard).removeClass('alphaNumeric');
        }
		this.alpha= false;
		this.setAlphaNumeric(false);
    };

    this.setAlphaNumeric = function(alpha){
        if(alpha){
            $(keboard).addClass('alpha');
        } else {
            $(keboard).removeClass('alpha');
        }
    };

    this.onKeyPressed = function(key){
        //HomeTimer.touch();
        var kh = this.getKeyHandler(key);

        self.text = kh(key, self.text);

        self.onTextChangedHandler(self.text);
    };

    this.isAlphabetic = function(s){
        return (s.length == 1 && s >='a' && s <='ö');
    };

    this.handleStandardKey = function(key){
        if(self.isAlphabetic(key) && self.shifted){
            key = key.toUpperCase();
        }
        return self.text + key;
    };

    this.handleBackspace = function(key, text){
        if(text.length > 0){
            text = text.substr(0, text.length - 1)
        }
        return text;
    };

    this.handleClear = function(key, text){
        return "";
    };

    this.toggleMode = function(key, text){
        this.setAlphaNumeric(!this.alpha);
        this.alpha = !this.alpha;
        return text;
    };

    this.handleShift = function(key, text){
        self.shift();
        return text;
    };

    this.clear = function(){
        self.text = ""
    };

    this.getText = function(){
        return self.text;
    };

    SPECIAL_KEY_HANDLERS['bs']     = $.proxy(this.handleBackspace, this);
    SPECIAL_KEY_HANDLERS['clr']    = $.proxy(this.handleClear, this);
    SPECIAL_KEY_HANDLERS['shift']  = $.proxy(this.handleShift, this);
    SPECIAL_KEY_HANDLERS['mode']   = $.proxy(this.toggleMode, this);

};

Keyboard.TYPE_NUMERIC = 0;
Keyboard.TYPE_ALPHA_NUMERIC = 1;