$(function(){
    AramexService.prototype.printTicket = function(parcels, services)
	{
        console.log("Printing ticket on unit " + qmatic.webwidget.client.getUnitId());
        var unitId = qmatic.webwidget.client.getUnitId();
		console.log("Is it a previlege "+previlege);
        if(previlege)
		{
			qmatic.connector.client.createVisitByUnitId(unitId, 
			{
				services: services,
				parameters:
				{
					parcels: JSON.stringify(parcels),
					custom2:awbno,
					custom3:searchmethod,
					level:"VIP Level 1"
				}
			}, "SORTED");
		}
		else
		{
			qmatic.connector.client.createVisitByUnitId(unitId, 
			{
				services: services,
				parameters:
				{
					parcels: JSON.stringify(parcels),
					custom2:awbno,
					custom3:searchmethod//,
					//level:"VIP Level 1"
				}
			}, "SORTED");			
		}
    };
    Aramex.getLocation = function(){
        return qmatic.webwidget.client.getBranchId();
    };
    Aramex.startMonitor = function(){
        Aramex.monitor();
    };
    Aramex.monitor = function(){
        setTimeout(function(){
            var iFrame = window.frameElement;
            var span = iFrame.parentNode;
            var visible =  $(span.parentNode.parentNode.parentNode).is(':visible');
            if(!Aramex.isOnWidgetPage && visible) {
                Aramex.isOnWidgetPage = true;
                Aramex.reset();
            } else if(!visible){
                Aramex.isOnWidgetPage = false;
            }
            Aramex.monitor();
        }, 200)
    };
});
