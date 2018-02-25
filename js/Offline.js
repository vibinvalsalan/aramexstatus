$(function(){
    AramexService.prototype.printTicket = function(parcels, services){
        console.log("fake printing");

        for(var i in services){
            console.log("Printing for service " + services[i]);
        }

        var d = $.Deferred();
        d.resolve();
        return d.promise();

    };

    Aramex.getLocation = function(){
        return 1;
    };

    Aramex.startMonitor = function(){
        console.log("Starting fake monitor");
    };

});
