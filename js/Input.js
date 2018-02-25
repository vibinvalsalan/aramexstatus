var AramexInput = function(countryCodeElementId, mailboxPrefixElementId, outputElementId, keyboardElementId, changeListener){
    var self = this;

    this.keyboard = new Keyboard(keyboardElementId, function(text){
        $(outputElementId).val(text);
        self.onInputChanged();
    });

    $(countryCodeElementId).change(function(){
        self.onInputChanged();
    });

    this.onInputChanged = function(){
        var validation = self.validate(self.getText());

        $(outputElementId).removeClass('validation1');
        $(outputElementId).removeClass('validation2');
        $(outputElementId).removeClass('validation3');
        $(outputElementId).removeClass('validation4');
        $(outputElementId).removeClass('validation5');
        $(outputElementId).removeClass('validation6');

        $(outputElementId).addClass('validation' + validation);

        changeListener(self.getText(), validation);

    };



    this.setCountryCodes = function(countryCodes){
        for(var i = 0; i < countryCodes.length; i++){
            $(countryCodeElementId).append($("<option></option>")
                .attr("value", countryCodes[i])
                .text(countryCodes[i]));
        }
    };

    this.getText = function(){
        if(self.method == AramexInput.INPUT_METHOD_MOBILE){
            return $(countryCodeElementId).val() + self.keyboard.getText();
        }
		if (self.method == AramexInput.INPUT_METHOD_MAILBOX){
			return $(mailboxPrefixElementId).text() + " " + self.keyboard.getText();
		}
        return self.keyboard.getText();
    };

    this.clear = function(){
        self.text = "";
        self.keyboard.clear();
        $(outputElementId).val("");
        self.onInputChanged();
    };

    this.validate = function(text){
        if(this.method == AramexInput.INPUT_METHOD_AWB){
            if(text.length == 0){
                return AramexInput.VALIDATION_EMPTY;
            }

            if(isNaN(text)) {
                return AramexInput.VALIDATION_INVALID_CHARS;
            }

            if(text.length < self.minShipmentNumberLength){
                return AramexInput.VALIDATION_TOO_SHORT;
            }

            if(text.length > self.maxShipmentNumberLength){
                return AramexInput.VALIDATION_TOO_LONG;
            }

            var inBond = parseInt(text.substr(0, text.length-1));
            var inChecksum = parseInt(text.substr(text.length-1, 1));

            var checksum = inBond%7;

            if(inChecksum != checksum){
                return AramexInput.VALIDATION_VALID
            }

            return AramexInput.VALIDATION_VALID;
        } else if(this.method == AramexInput.INPUT_METHOD_MAILBOX){

            console.log("text.length " + text.length);
            console.log("self.minMailboxNumberLength " + self.minMailboxNumberLength);
            console.log("self.maxMailboxNumberLength " + self.maxMailboxNumberLength);
            if(text.length == 0){
                return AramexInput.VALIDATION_EMPTY;
            }

            if(text.length < self.minMailboxNumberLength){
                return AramexInput.VALIDATION_TOO_SHORT;
            }

            if(text.length > self.maxMailboxNumberLength){
                return AramexInput.VALIDATION_TOO_LONG;
            }
            return AramexInput.VALIDATION_VALID;

        } else { //mobile
            if(text.length == 0){
                return AramexInput.VALIDATION_EMPTY;
            }

            if(text.length < self.minMobileNumberLength){
                return AramexInput.VALIDATION_TOO_SHORT;
            }

            if(text.length > self.maxMobileNumberLength){
                return AramexInput.VALIDATION_TOO_LONG;
            }
            return AramexInput.VALIDATION_VALID;
        }
    };

    this.isValid = function(){
        return self.validate(self.getText()) == AramexInput.VALIDATION_VALID;
    };
	
	this.isValidWithChecksum = function(){
		
		
		if(this.method == AramexInput.INPUT_METHOD_AWB){
			var text = self.getText();

			var inBond = parseInt(text.substr(0, text.length-1));
			var inChecksum = parseInt(text.substr(text.length-1, 1));

			var checksum = inBond%7;

			if(inChecksum != checksum){
				$(outputElementId).addClass('validation' + AramexInput.VALIDATION_INCORRECT_CHECKSUM);
				return false;
			}
		}
		else 
			return self.isValid();

		return true;
    };

    this.setInputMethod = function(method){


        this.method = method;

        $(outputElementId).removeClass('inputType1');
        $(outputElementId).removeClass('inputType2');
        $(outputElementId).removeClass('inputType3');

        $(outputElementId).addClass('inputType' + method);

        if(method == AramexInput.INPUT_METHOD_AWB){

            $(countryCodeElementId).hide();
			$(mailboxPrefixElementId).hide();
            self.keyboard.setAlphaNumericEnabled(false);
        } else if(method == AramexInput.INPUT_METHOD_MOBILE){
            $(countryCodeElementId).show();
			$(mailboxPrefixElementId).hide();
            self.keyboard.setAlphaNumericEnabled(false);
        } else {
            self.keyboard.setAlphaNumericEnabled(true);
            $(countryCodeElementId).hide();
			$(mailboxPrefixElementId).show();
        }
    };

    this.setMaxMobileNumberLength = function(max){
        this.maxMobileNumberLength = max;
    };

    this.setMinMobileNumberLength = function(min){
        this.minMobileNumberLength = min;
    };

    this.setMaxMailboxNumberLength = function(max){
        this.maxMailboxNumberLength = max;
    };
    this.setMinMailboxNumberLength = function(min){
        this.minMailboxNumberLength = min;
    };
	this.setMaxShipmentNumberLength = function(max){
		this.maxShipmentNumberLength = max;
	};
	this.setMinShipmentNumberLength = function(min){
		this.minShipmentNumberLength = min;
	};
	
};

AramexInput.INPUT_METHOD_AWB = 1;
AramexInput.INPUT_METHOD_MAILBOX = 2;
AramexInput.INPUT_METHOD_MOBILE = 3;
AramexInput.STATUS_A = 'A';
AramexInput.STATUS_B = 'B';
AramexInput.STATUS_C = 'C';
AramexInput.STATUS_D = 'D';

AramexInput.VALIDATION_VALID              = 1;
AramexInput.VALIDATION_EMPTY              = 2;
AramexInput.VALIDATION_TOO_SHORT          = 3;
AramexInput.VALIDATION_TOO_LONG           = 4;
AramexInput.VALIDATION_INVALID_CHARS      = 5;
AramexInput.VALIDATION_INCORRECT_CHECKSUM = 6;
