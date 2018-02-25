var awbno='';
var searchmethod;
var previlege=false;
var Aramex = {
    pages: {
        INPUT:  {div: 'page0', texts: 'message.method'},
        SEARCH: {div: 'page1', texts: 'message.search'},
        SELECT: {div: 'page2', texts: 'message.select'},
		UPDATE: {div: 'page3', texts: 'message.statusA'}
    },
    currentPage: null,
    currentInputMethod: null,
    showProgress: function(){
        $('#progress').show();
    },
    hideProgress: function(){
        $('#progress').hide();
    },
    populateText: function(text, params){
        if(params){
            for(var i in params){
                text = text.replace('{' + i + '}', params[i]);
            }
        }
        return text;
    },
    /* Displays a page and sets the header and description */
    showPage: function(page, params){
        if(this.currentPage){
            this.currentPage.hide();
        }
        console.log("Show page " + page + " "+  JSON.stringify(params));
        var header = this.populateText(this.messages[page.texts + '.header'], params);
		var description = "";      	
		if (page.div == "page1"){
			description = this.populateText(this.messages['help.'+this.currentInputMethod],params);			
		}
		else{
			description = this.populateText(this.messages[page.texts + '.description'], params);
		}
        this.setPageHeader(header);		
        this.setPageDescription(description);
        var p = $('#' + page.div);
        this.currentPage = p;
        p.show();
    },
    init: function(frontOfficeService, backOfficeService, timeoutPage, printingPage, errorPage, notFoundPage, timeout, warehouseZeroName, messages,
                   countryCodes, maxMobileNumberLength, minMobileNumberLength, maxMailboxNumberLength, minMailboxNumberLength, maxShipmentNumberLength,
				   minShipmentNumberLength, css, branchPrefix, mailboxPrefix){
        this.frontOfficeService      = frontOfficeService;
        this.backOfficeService       = backOfficeService;
        this.frontOfficeOnlyLocation = warehouseZeroName;
        this.timeoutPageName         = timeoutPage;
        this.printingTicketPageName  = printingPage;
        this.errorPageName           = errorPage;
        this.notFounPageName         = notFoundPage;
        this.maxInactivity           = timeout;
        this.messages                = messages;
        this.countryCodes            = countryCodes;
        this.maxMobileNumberLength   = maxMobileNumberLength;
        this.minMobileNumberLength   = minMobileNumberLength;
        this.maxMailboxNumberLength  = maxMailboxNumberLength;
        this.minMailboxNumberLength  = minMailboxNumberLength;
		this.maxShipmentNumberLength = maxShipmentNumberLength;
		this.minShipmentNumberLength = minShipmentNumberLength;
		this.updateSuccess = 0;
		this.branchPrefix = branchPrefix;		
        this.inputBox =  $("#inputBox");
		this.mailboxPrefix = mailboxPrefix;
        var buttonPrint =  $("#btnPrint");
        //var buttonSearch = $("#btnSearch");
		var buttonSearchNew = $("#btnSearch1");
		var buttonHomeInShipment = $("#btnHome");
		//added vibval
		var buttonPickUp = $("#btnUpdate1");
		var buttonDeliver = $("#btnUpdate2");
		var buttonWait = $("#btnUpdate3");
		//
        var buttonMethodAWB     = $("#btnMethodAWB");
        var buttonMethodMobile  = $("#btnMethodMobile");
        //var buttonMethodMailbox = $("#btnMethodMailbox");
        buttonPrint.html(this.messages['button.print']);
        //buttonSearch.html(this.messages['button.search']);
		//buttonSearchNew.html(this.messages['button.search']);
		//added by vibval add in widget properties values for update button text and Code to be send for update
		buttonPickUp.html(this.messages['message.statusA.pickup']);
		buttonDeliver.html(this.messages['message.statusA.deliver']);
		buttonWait.html(this.messages['message.statusA.wait']);
		//
        buttonMethodAWB.html(this.messages['button.method.1']);
        //buttonMethodMailbox.html(this.messages['button.method.2']);
        buttonMethodMobile.html(this.messages['button.method.3']);
        var inputMethodName = $("#inputMethodName");
        var Service = new AramexService({basePath:"/aramexsearch/api"});
        HomeTimer.watch(buttonPrint);
        HomeTimer.watch(buttonSearchNew);
        HomeTimer.watch(buttonMethodAWB);
        HomeTimer.watch(buttonMethodMobile);
        //HomeTimer.watch(buttonMethodMailbox);
        /*Disable search button of no parcels are selected */
        var onSelectionChanged = function(selectedParcels){
            if(selectedParcels.length > 0){
                buttonPrint.removeClass("disabled");
            } else {
                buttonPrint.addClass("disabled");
            }
            HomeTimer.touch();
        };
        var parcelList = new ParcelList("#parcelList", onSelectionChanged);
        var style = '<style type="text/css">';
        style +=
            'body{ '
                + 'background: ' + css.backgroundColor + ';'
                + 'color: '      + css.color + ';'
            + ';} ';
        style +=
            '#pageTitle{ '
                + 'font-family: ' + css.title.fontFamily  + ";"
                + 'font-size: '   + css.title.fontSize    + "pt;"
                + 'font-style: '  + css.title.fontStyle   + ";"
                + 'font-weight: ' + css.title.fontWight   + ";"
            + '} ';
        style +=
            '#pageDescription { '
                + 'font-family: ' + css.description.fontFamily  + ";"
                + 'font-size: '   + css.description.fontSize    + ";"
                + 'font-style: '  + css.description.fontStyle   + ";"
                + 'font-weight: ' + css.description.fontWight   + ";"
            + '} ';
        style +=
            '.button { '
                + (css.button.backgroundColor == ''?'':('background: ' + css.button.backgroundColor + ';'))
                + (css.button.backgroundImage == ''?'':('background: url("' + css.button.backgroundImage + '") no-repeat; '))
                + 'text-align: '  + css.button.align  + ";"
                + 'color: '       + css.button.color  + ";"
                + 'width: '       + css.button.width  + "px;"
                + 'height: '      + css.button.height  + "px;"
            //    + 'font-family:  aramexLt;'
				+ 'font-family: ' + css.button.fontFamily  + ";"
                + 'font-size: '   + css.button.fontSize    + ";"
                + 'font-style: '  + css.button.fontStyle   + ";"
                + 'font-weight: ' + css.button.fontWight   + ";"
                + 'line-height:'  + css.button.lineHeight   + "px;"
            + '} ';
        style +=
            '.button.disabled { '
                + (css.button.disabled.backgroundColor == ''?'':('background: ' + css.button.disabled.backgroundColor + ';'))
                + (css.button.disabled.backgroundImage == ''?'':('background: url("' + css.button.disabled.backgroundImage + '") no-repeat; '))
                + 'color: '  + css.button.disabled.color  + ";"
            + '} ';
        style +=
            '.key { '
                + (css.keyboard.key.backgroundColor == ''?'':('background: ' + css.keyboard.key.backgroundColor + ';'))
                + 'color: '  + css.keyboard.key.color  + ";"
                + 'font-family: ' + css.keyboard.key.fontFamily  + ";"
                + 'font-size: '   + css.keyboard.key.fontSize    + ";"
                + 'font-style: '  + css.keyboard.key.fontStyle   + ";"
                + 'font-weight: ' + css.keyboard.key.fontWight   + ";"
                + 'line-height:'   + css.keyboard.key.lineHeight   + "px;"
            + '} ';
        style+='</style>';
        $(style).appendTo('head');
        this.input = new AramexInput('#countryCode', "#mailboxPrefix","#textInput", '#keyboard', function(text, validation){
            if(validation == AramexInput.VALIDATION_VALID){
                //buttonSearch.removeClass("disabled");
				buttonSearchNew.removeClass("disabled");
            } else {
                //buttonSearch.addClass("disabled");
				buttonSearchNew.addClass("disabled");
            }
            console.log(text);
            HomeTimer.touch();
        });
        this.input.setCountryCodes(this.countryCodes);
        this.input.setMaxMobileNumberLength(this.maxMobileNumberLength);
        this.input.setMinMobileNumberLength(this.minMobileNumberLength);
        this.input.setMaxMailboxNumberLength(this.maxMailboxNumberLength);
        this.input.setMinMailboxNumberLength(this.minMailboxNumberLength);
		this.input.setMaxShipmentNumberLength(this.maxShipmentNumberLength);
        this.input.setMinShipmentNumberLength(this.minShipmentNumberLength);
		
		//home button
		buttonHomeInShipment.click($.proxy(function(){
			this.switchPage(this.timeoutPageName);
			this.reset();
		},this));
		
		//Pick Up Button//Goto Start Page after update
		buttonPickUp.click($.proxy(function(){
			console.log("Pick Up");
			this.showProgress();
			//location,query,ustatus,sstatus,pin
			var parcels = parcelList.getSelectedParcels();
			this.updateSuccess = 0;
			for(var i in parcels){
				Service.updateStatusInAramex(this.branchPrefix,parcels[i].shipmentNumber,"2",parcels[i].status,parcels[i].problematicPINumber)
				.done($.proxy(function(updateS){				
					var failedParcels=[];
					if(updateS.result){
						this.addDone();
					//	failedParcels.push(parcels[i]);
					}
					else{
						this.addFail();
						failedParcels.push(parcels[i]);
					}
					if(parcels.length == this.updateSuccess){
						this.hideProgress();
						console.log(this.updateSuccess);
						console.log(failedParcels);
						this.switchPage(this.timeoutPageName);
						this.reset();
					}
					else if(i==parcels.length-1 && this.updateSuccess<parcels.length){
						this.hideProgress();
						HomeTimer.start();
						this.switchPage(this.errorPageName);
						this.reset();
					}
				},this))
				.fail($.proxy(function(){
					this.addFail();
					if(i==parcels.length-1 && this.updateSuccess<parcels.length){
						this.hideProgress();
						HomeTimer.start();
						this.switchPage(this.errorPageName);
						this.reset();
					}
				}, this));	
			}
		},this));
		buttonDeliver.click($.proxy(function(){
			console.log("Deliver");
			this.showProgress();
			//location,query,ustatus,sstatus,pin
			var parcels = parcelList.getSelectedParcels();
			for(var i in parcels){
				Service.updateStatusInAramex(this.branchPrefix,parcels[i].shipmentNumber,"3",parcels[i].status,parcels[i].problematicPINumber)
				.done($.proxy(function(updateS){				
					if(updateS.result){
						this.addDone();
					}
					else{
						this.addFail();
					}
					if(parcels.length == this.updateSuccess){
						this.hideProgress();
						console.log(this.updateSuccess);
						this.switchPage(this.timeoutPageName);
						this.reset();
					}
					else if(i==parcels.length-1 && this.updateSuccess<parcels.length){
						this.hideProgress();
						HomeTimer.start();
						this.switchPage(this.errorPageName);
						this.reset();
					}
				},this))
				.fail($.proxy(function(){
					this.addFail();
					if(i==parcels.length-1 && this.updateSuccess<parcels.length){
						this.hideProgress();
						HomeTimer.start();
						this.switchPage(this.errorPageName);
						this.reset();
					}
				}, this));	
			}
		},this));
		buttonWait.click($.proxy(function(){
			console.log("Wait");
			 var parcels = parcelList.getSelectedParcels();
			parcelList.setParcels(parcels, true);
            this.input.clear();
            this.showPage(this.pages.SELECT, []);
		},this));
		
        buttonPrint.click($.proxy(function(){
            var parcels = parcelList.getSelectedParcels();
			awbno='';
            if(parcels.length > 0) {
                // Goes through each parcel to check if all locations are set to warehouse zero
                // In that case, the visit will only be created for front office
                var p = parcelList.getSelectedParcels();
                var backOffice = false;
				for(var i in p) {
					// Check for every parcel's location whether someone is logged on to that location
					// If not, change location to 1. If no one logged on to location 1, change location to 0.
					awbno+=p[i].shipmentNumber+',';
					console.log("print");
					if (controller.nrLocationLoggedIn(p[i].location) == 0 && p[i].location != this.frontOfficeOnlyLocation){
						var warehouse1 = controller.nrLocationLoggedIn(1);
						if (warehouse1 == 0)
							p[i].location = 0;
						else
							p[i].location = 1;
					}
				}
				awbno+='-'+p.length;
                for(var i in p) {
                    if(p[i].location != this.frontOfficeOnlyLocation){
                        backOffice = true;
                        break;
                    }
                }
                var services = [];

                if(backOffice){
                    services.push(this.backOfficeService);
                    console.log("Putting ticket in backOffice");
                }
                services.push(this.frontOfficeService);
                console.log("Putting ticket in frontOffice");
                Service.printTicket(parcelList.getSelectedParcels(), services);
                this.showPrintPage();
                this.reset();
            }
        }, this));
		//buttonSearchNew
		buttonSearchNew.click(
            $.proxy(function(){
                buttonSearchNew.addClass("disabled");
                if(!this.input.isValid()){
                    return;
                }
                var text = this.input.getText();//this.branchPrefix + "," + this.input.getText();
				//awbno=text;
                HomeTimer.stop();
                this.showProgress();
                var methodStr;
                switch(this.currentInputMethod){
                    case AramexInput.INPUT_METHOD_AWB: methodStr = 'shipment'; break;
                    case AramexInput.INPUT_METHOD_MOBILE: methodStr = 'mobile';break;
                    case AramexInput.INPUT_METHOD_MAILBOX: methodStr = 'mailbox'; break;
                }
				searchmethod=methodStr;
                Service.search(text, methodStr , this.branchPrefix).done($.proxy(function(parcels){				
                    this.hideProgress();
                    HomeTimer.start();
//Added New Logic Here
					previlege=false;
                    if(parcels.length == 0) {
                        this.switchPage(this.notFounPageName);
                        this.reset();
                    } else if (parcels.length >1) {
						var isStatusA = false;
						var isStatusB = false;
						var isStatusC = false;
						var isStatusD = false;
						//previlege=false;
						for(var i in parcels)
						{
							switch(parcels[i].status){
								case AramexInput.STATUS_C:	isStatusC = true;break;
								case AramexInput.STATUS_A:	isStatusA = true;break;
								case AramexInput.STATUS_B:	isStatusB = true;break;
								case AramexInput.STATUS_D:	isStatusD = true;break;
								default:isStatusC = true;break;
							}
						}
						if(isStatusC){
							console.log("Multiple Shipments with atleast 1 status C shipment");
							parcelList.setParcels(parcels, true);
							this.input.clear();
							this.showPage(this.pages.SELECT, []);
						}
						else if(isStatusD && ( !isStatusC && !isStatusB && !isStatusA)){
							console.log("issue previlege ticket because all parcels are status D");
							for(var k in parcels)
							{
								parcels[k].location='0';
							}
							var services = [];
							services.push(this.frontOfficeService);
							previlege=true;
							//Service.printTicket(parcelList.getSelectedParcels(), services);
							Service.printTicket(parcels, services);
							//parcelList.setParcels(parcels, true);
							this.showPrintPage();
							this.reset();
							//this.input.clear();
							//this.showPage(this.pages.UPDATE, []);
						
						}
						else if(isStatusB && ( !isStatusC && !isStatusD && !isStatusA)){
							console.log("All parcels are status B");
							parcelList.setParcels(parcels, true);
							this.input.clear();
							this.showPage(this.pages.SELECT, []);
							
						}
						else if(isStatusA && ( !isStatusC && !isStatusB && !isStatusD)){
							console.log("All parcels are status A");
							parcelList.setParcels(parcels, true);
							this.input.clear();
							this.showPage(this.pages.UPDATE, []);
						}
                    }
					else if(parcels.length == 1)
					{
						console.log(parcels);
						if(parcels[0].status == 'A')
						{
							console.log("Single Shipment with Status A,Get user input and proceed");
							parcelList.setParcels(parcels, true);
							this.input.clear();
							this.showPage(this.pages.UPDATE, []);
						}
						else if(parcels[0].status == 'B')
						{
							console.log("Single Shipment with Status B,Issue Normal Ticket for Main Back Office");
							parcelList.setParcels(parcels, true);
							this.input.clear();
							this.showPage(this.pages.SELECT, []);
						}
						else if(parcels[0].status == 'C')
						{
							console.log("Single Shipment with Status C,Issue Normal Ticket as per Location");
							parcelList.setParcels(parcels, true);
							this.input.clear();
							this.showPage(this.pages.SELECT, []);
						}
						else if(parcels[0].status == 'D')
						{
							console.log("Single Shipment with Status D, Issue Previlege Ticket");
							var services = [];
							parcels[0].location='0';
							services.push(this.frontOfficeService);
							previlege=true;
							//Service.printTicket(parcelList.getSelectedParcels(), services);
							Service.printTicket(parcels, services);
							//parcelList.setParcels(parcels, true);
							this.showPrintPage();
							this.reset();
							//this.input.clear();
							//this.showPage(this.pages.SELECT, []);
						}
					}
                }, this)).fail($.proxy(function(){
                        this.hideProgress();
                        HomeTimer.start();
                        this.switchPage(this.errorPageName);
                        this.reset();
                    }, this))
            }, this));
		
		
        // buttonSearch.click(
            // $.proxy(function(){
                // buttonSearch.addClass("disabled");
                // if(!this.input.isValid()){
                    // return;
                // }
                // var text = this.input.getText();//this.branchPrefix + "," + this.input.getText();
				// //awbno=text;
                // HomeTimer.stop();
                // this.showProgress();
                // var methodStr;
                // switch(this.currentInputMethod){
                    // case AramexInput.INPUT_METHOD_AWB: methodStr = 'shipment'; break;
                    // case AramexInput.INPUT_METHOD_MOBILE: methodStr = 'mobile';break;
                    // case AramexInput.INPUT_METHOD_MAILBOX: methodStr = 'mailbox'; break;
                // }
				// searchmethod=methodStr;
                // Service.search(text, methodStr , this.branchPrefix).done($.proxy(function(parcels){				
                    // this.hideProgress();
                    // HomeTimer.start();
// //Added New Logic Here
					// previlege=false;
                    // if(parcels.length == 0) {
                        // this.switchPage(this.notFounPageName);
                        // this.reset();
                    // } else if (parcels.length >1) {
						// var isStatusA = false;
						// var isStatusB = false;
						// var isStatusC = false;
						// var isStatusD = false;
						// //previlege=false;
						// for(var i in parcels)
						// {
							// switch(parcels[i].status){
								// case AramexInput.STATUS_C:	isStatusC = true;break;
								// case AramexInput.STATUS_A:	isStatusA = true;break;
								// case AramexInput.STATUS_B:	isStatusB = true;break;
								// case AramexInput.STATUS_D:	isStatusD = true;break;
								// default:isStatusC = true;break;
							// }
						// }
						// if(isStatusC){
							// console.log("Multiple Shipments with atleast 1 status C shipment");
							// parcelList.setParcels(parcels, true);
							// this.input.clear();
							// this.showPage(this.pages.SELECT, []);
						// }
						// else if(isStatusD && ( !isStatusC && !isStatusB && !isStatusA)){
							// console.log("issue previlege ticket because all parcels are status D");
							// for(var k in parcels)
							// {
								// parcels[k].location='0';
							// }
							// var services = [];
							// services.push(this.frontOfficeService);
							// previlege=true;
							// //Service.printTicket(parcelList.getSelectedParcels(), services);
							// Service.printTicket(parcels, services);
							// //parcelList.setParcels(parcels, true);
							// this.showPrintPage();
							// this.reset();
							// //this.input.clear();
							// //this.showPage(this.pages.UPDATE, []);
						
						// }
						// else if(isStatusB && ( !isStatusC && !isStatusD && !isStatusA)){
							// console.log("All parcels are status B");
							// parcelList.setParcels(parcels, true);
							// this.input.clear();
							// this.showPage(this.pages.SELECT, []);
							
						// }
						// else if(isStatusA && ( !isStatusC && !isStatusB && !isStatusD)){
							// console.log("All parcels are status A");
							// parcelList.setParcels(parcels, true);
							// this.input.clear();
							// this.showPage(this.pages.UPDATE, []);
						// }
                    // }
					// else if(parcels.length == 1)
					// {
						// console.log(parcels);
						// if(parcels[0].status == 'A')
						// {
							// console.log("Single Shipment with Status A,Get user input and proceed");
							// parcelList.setParcels(parcels, true);
							// this.input.clear();
							// this.showPage(this.pages.UPDATE, []);
						// }
						// else if(parcels[0].status == 'B')
						// {
							// console.log("Single Shipment with Status B,Issue Normal Ticket for Main Back Office");
							// parcelList.setParcels(parcels, true);
							// this.input.clear();
							// this.showPage(this.pages.SELECT, []);
						// }
						// else if(parcels[0].status == 'C')
						// {
							// console.log("Single Shipment with Status C,Issue Normal Ticket as per Location");
							// parcelList.setParcels(parcels, true);
							// this.input.clear();
							// this.showPage(this.pages.SELECT, []);
						// }
						// else if(parcels[0].status == 'D')
						// {
							// console.log("Single Shipment with Status D, Issue Previlege Ticket");
							// var services = [];
							// parcels[0].location='0';
							// services.push(this.frontOfficeService);
							// previlege=true;
							// //Service.printTicket(parcelList.getSelectedParcels(), services);
							// Service.printTicket(parcels, services);
							// //parcelList.setParcels(parcels, true);
							// this.showPrintPage();
							// this.reset();
							// //this.input.clear();
							// //this.showPage(this.pages.SELECT, []);
						// }
					// }
                // }, this)).fail($.proxy(function(){
                        // this.hideProgress();
                        // HomeTimer.start();
                        // this.switchPage(this.errorPageName);
                        // this.reset();
                    // }, this))
            // }, this));
			
			
        buttonMethodAWB.click(    $.proxy(function(){this.selectInputMethod(AramexInput.INPUT_METHOD_AWB);     HomeTimer.touch()}, this));
        buttonMethodMobile.click( $.proxy(function(){this.selectInputMethod(AramexInput.INPUT_METHOD_MOBILE);  HomeTimer.touch()}, this));
        //buttonMethodMailbox.click($.proxy(function(){this.selectInputMethod(AramexInput.INPUT_METHOD_MAILBOX); HomeTimer.touch()}, this));
        this.showPage(this.pages.INPUT, {});
        Aramex.startMonitor();
        HomeTimer.start();

    },
	addDone : function(){
		this.updateSuccess=this.updateSuccess+1;
	},
	addFail : function(){
		this.updateSuccess=this.updateSuccess-1;
	},
    showPrintPage: function(){
        this.switchPage(this.printingTicketPageName);
    },
    switchPage: function(page){
        console.log("Switching page to " + page);
        if(qmatic){
            qmatic.webwidget.client.publish("com.qmatic.qp.topic.operation.SWITCH_HOST_PAGE",{
                pageName: page,
                isStayOnPage: false
            });
        }
    },
    reset: function(){
        this.input.clear();
        //this.setInputCss(this.VALIDATION_EMPTY);
        this.showPage(this.pages.INPUT, {});

    },
    setPageHeader: function(text){
        $("#pageTitle").html(text);
    },
    setPageDescription: function(text){
        console.log(text);
        $("#pageDescription").html(text);
    },
    selectInputMethod: function(method) {
        this.currentInputMethod = method;
        this.input.clear();
        this.input.setInputMethod(method);
        this.showPage(this.pages.SEARCH, [this.messages['button.method.' + method]]);
    },
    destroy: function(){}
};
/* Timer that will redirect to start page if user has been inactive for x milliseconds */
var HomeTimer = new (function(){
    var onTimeout = $.proxy(function(){
        if(Aramex.isOnWidgetPage) {
            if(this.lastTouch == null){
                this.lastTouch = new Date();
            }
            if((new Date().getTime() - this.lastTouch.getTime()) > Aramex.maxInactivity){
                this.lastTouch = null;
                qmatic.webwidget.client.publish("com.qmatic.qp.topic.operation.SWITCH_HOST_PAGE",{
                    pageName: Aramex.timeoutPageName,
                    isStayOnPage: true
                });
                Aramex.reset();
            }
        } else {
            this.lastTouch = null;
        }
        this.timer = setTimeout(onTimeout, 1000);
    }, this);
    this.watch = function(o) {
        o.click($.proxy(function(){
            this.touch();
        }, this));
    };
    this.touch = function() {
        this.lastTouch = new Date();
    };
    this.start = function() {
        this.timer = setTimeout(onTimeout, 1000);
    };
    this.stop = function(){
        clearTimeout(this.timer);
    };

})();
