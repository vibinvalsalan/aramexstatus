var controller = (function($){
	var wwRest = qmatic.connector.client;
	var branchId;
	return {
		onLoaded: function (configuration) {
			var attributeParser = new qmatic.webwidget.AttributeParser(configuration.attributes || {});
			var snsService1  = attributeParser.getInteger("snsService1", 1);
			var snsService2  = attributeParser.getInteger("snsService2", 2);

			var timeoutPage   = attributeParser.getString("timeoutPage",  "startPage");
			var printingPage  = attributeParser.getString("printingPage", "printing");
			var errorPage     = attributeParser.getString("errorPage",    "printing");
			var notFoundPage  = attributeParser.getString("notFoundPage", "notFound");

			var timeout       = attributeParser.getInteger("timeout", 5000);
			var warehouseZero = attributeParser.getString("warehouseZero", "Warehouse Zero");
			var mailboxPrefix = attributeParser.getString("mailboxPrefix", "");
			var countryCodesStr = attributeParser.getString("countryCodes", "");
			var maxMobileNumberLength  = attributeParser.getInteger("maxMobileNumberLength", 15);
			var minMobileNumberLength  = attributeParser.getInteger("minMobileNumberLength", 10);
			var maxMailboxNumberLength = attributeParser.getInteger("maxMailboxNumberLength", 15);
			var minMailboxNumberLength = attributeParser.getInteger("minMailboxNumberLength", 10);		
			var maxShipmentNumberLength = attributeParser.getInteger("maxShipmentNumberLength", 15);		
			var minShipmentNumberLength = attributeParser.getInteger("minShipmentNumberLength", 10);
			$("#mailboxPrefix").html(mailboxPrefix);
	
			/*
			 <q:attribute type="color"   key="css.color"                               name="css.color"                            description="css.color.description"                             defaultValue="#000000"></q:attribute>
			 <q:attribute type="font"    key="css.headerFont"                          name="css.headerFont"                       description="css.headerFont.description"                        defaultValue="Helvetica;30px;normal;normal"></q:attribute>
			 <q:attribute type="font"    key="css.descriptionFont"                     name="css.descriptionFont"                  description="css.descriptionFont.description"                   defaultValue="Helvetica;30px;normal;normal"></q:attribute>
			 */
			var unitId = qmatic.webwidget.client.getUnitId();
			var branchPrefix = unitId.substring(0,3);
			branchId = qmatic.webwidget.client.getBranchId();
			var css = {
				backgroundColor: attributeParser.getString('css.backgroundColor', "#ffffff"),
				color: attributeParser.getString('css.color', "#000000"),
				title: {
					fontSize:  attributeParser.getFontSize('css.headerFont',   "Helvetica;30px;normal;normal"),
					fontFamily:  attributeParser.getFontFamily('css.headerFont', "Helvetica;30px;normal;normal"),
					fontStyle:  attributeParser.getFontStyle('css.headerFont',  "Helvetica;30px;normal;normal"),
					fontWight:  attributeParser.getFontWeight('css.headerFont',  "Helvetica;30px;normal;normal")
				},
				description: {
					fontSize:  attributeParser.getFontSize('css.descriptionFont',   "Helvetica;14px;normal;normal"),
					fontFamily:  attributeParser.getFontFamily('css.descriptionFont', "Helvetica;14px;normal;normal"),
					fontStyle:  attributeParser.getFontStyle('css.descriptionFont',  "Helvetica;14px;normal;normal"),
					fontWight:  attributeParser.getFontWeight('css.descriptionFont',  "Helvetica;14px;normal;normal")
				},
				button: {
					backgroundImage: attributeParser.getImageUrl('css.button.backgroundImage',  ""),
					backgroundColor: attributeParser.getString('css.button.backgroundColor', "#42B8DD"),
					color: attributeParser.getString('css.button.color', "#ffffff"),
					align: attributeParser.getString('css.button.align', "center"),
					width: attributeParser.getString('css.button.width', "400"),
					height: attributeParser.getString('css.button.height', "40"),

					fontSize:  attributeParser.getFontSize('css.button.font',   "Helvetica;30px;normal;normal"),
					fontFamily:  attributeParser.getFontFamily('css.button.font', "Helvetica;30px;normal;normal"),
					fontStyle:  attributeParser.getFontStyle('css.button.font',  "Helvetica;30px;normal;normal"),
					fontWight:  attributeParser.getFontWeight('css.button.font',  "Helvetica;30px;normal;normal"),
					lineHeight:  attributeParser.getString('css.button.lineHeight',  "60"),

					disabled: {
						backgroundImage: attributeParser.getImageUrl('css.button.disabled.backgroundImage',  ""),
						backgroundColor: attributeParser.getString('css.button.disabled.backgroundColor', "#c0c0c0"),
						color: attributeParser.getString('css.button.disabled.color', "#ffffff")
					}
				},

				keyboard: {
					key: {
						backgroundColor: attributeParser.getString('css.keyboard.key.backgroundColor', "#42B8DD"),
						color: attributeParser.getString('css.keyboard.key.color', "#ffffff"),
						fontSize:  attributeParser.getFontSize('css.keyboard.key.font',   "Helvetica;30px;normal;normal"),
						fontFamily:  attributeParser.getFontFamily('css.keyboard.key.font', "Helvetica;30px;normal;normal"),
						fontStyle:  attributeParser.getFontStyle('css.keyboard.key.font',  "Helvetica;30px;normal;normal"),
						fontWight:  attributeParser.getFontWeight('css.keyboard.key.font',  "Helvetica;30px;normal;normal"),
						lineHeight:  attributeParser.getString('css.keyboard.key.lineHeight',  "60")
					}
				}
			};

			var messages = {
				'message.method.header':        attributeParser.getString("textMethodHeader",            "Input Method"),
				'message.method.description':   attributeParser.getString("textMethodDescription",       "Please select an input method"),
				'message.search.header':        attributeParser.getString("textSearchHeader",            "Search"),
				'message.search.description':   attributeParser.getString("textSearchHeaderDescription", "Enter your {0}"),
				'message.select.header':        attributeParser.getString("textSelectHeader",            "Select"),
				'message.select.description':   attributeParser.getString("textSelectDescription",       "Click on each parcel you want to collect"),
				'button.method.1':              attributeParser.getString("textButtonShipmentNumber",    "Shipment Id"),
				'button.method.2':              attributeParser.getString("textButtonMailbox",           "Mailbox"),
				'button.method.3':              attributeParser.getString("textButtonMobile",            "Mobile"),
				'button.search':                attributeParser.getString("textButtonSearch",            "Search"),
				'button.print':                 attributeParser.getString("textButtonPrint",             "Print"),
				'help.1':				attributeParser.getString("helpShipment",  ""),
				'help.2':					attributeParser.getString("helpMobile",""),
				'help.3':					attributeParser.getString("helpMailbox",""),
				'message.statusA.description': attributeParser.getString("textStatusADesc",            "What do you want to do,Please select your option"),
				'message.statusA.header': attributeParser.getString("textStatusAHeader","Shipment is not sorted or ready"),
				'message.statusA.pickup':attributeParser.getString("textButtonUpdate1","Pick Up Later"),
				'message.statusA.deliver':attributeParser.getString("textButtonUpdate2","Deliver it to me"),
				'message.statusA.wait':attributeParser.getString("textButtonUpdate3","I will wait"),
				
			};

			Aramex.init(snsService1, snsService2, timeoutPage, printingPage, errorPage, notFoundPage, timeout, warehouseZero, messages,
				countryCodesStr.split(','),
				maxMobileNumberLength,
				minMobileNumberLength,
				maxMailboxNumberLength,
				minMailboxNumberLength,
				maxShipmentNumberLength,
				minShipmentNumberLength,
				css,
				branchPrefix, mailboxPrefix
			);
		},
		
		nrLocationLoggedIn : function(location){	
			location = location.toString().replace('/','');
			s = wwRest.getBranchVariable(branchId, "location_"+location);
			if (s == undefined || s == null || s.value == undefined)
				return 0;
			else
				return parseInt(s.value);
		}
	}

})(jQuery);

