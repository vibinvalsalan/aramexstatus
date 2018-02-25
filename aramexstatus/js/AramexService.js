var AramexService = function(config) {

    var self = this;
    self.config = config;

    this.get = function(url){
        return $.ajax({
            dataType: "json",
            url: self.config.basePath + url,
			//url: "https://ws.staging.aramex.net/CSQueuing/service_1_0.svc/GetShipmentsByMobileNumber"
            timeout: 30000
        });
    };

    this.search = function(query, method, location){
		location = "GAR";
        return self.get("/" + location + "/shipments?q=" + query + "&method=" + method);
    };
	
	//DOH/shipments/9497050032/updatestatus/1/searchstatus/A/pin/SH157
	// addeed by vibval
	//This function will update the shipment status in aramex based on input obtained from the customer at the kiosk
	
	this.updateStatusInAramex = function(location,query,ustatus,sstatus,pin){
		//location = "DOH";
		return self.get("/"+location+"/shipments/"+query+"/updatestatus/"+ustatus+"/searchstatus/"+sstatus+"/pin/"+pin+"/backoffice/QMATIC PRINTER");
	};
	
};
