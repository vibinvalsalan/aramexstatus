var ParcelList = function(container, selectionListener){

    var self = this;

    self.container = container;
    self.parcels = [];
    self.selectionListener = selectionListener;

    this.setParcels = function(parcels, selectAll){
        $(self.container).html("");
        self.parcels = parcels;
        for(var i in parcels){
            var row       = $('<div></div>');
            var item      = $('<div></div>');
            var info      = $('<div></div>');
			//var sstatus   =
            var checkbox  = $('<div ></div>');
            if(selectAll) {
                parcels[i].selected = true;
            }
            //info.html(parcels[i].shipmentNumber);
			info.html('<tr><td width="250px">'+parcels[i].shipmentNumber+'</td><td>'+parcels[i].status+'</td></tr>');
            checkbox.attr("id", "parcel-" + parcels[i].shipmentNumber);
            row.addClass("parcelRow");
            info.addClass("parcelInfo");
            checkbox.addClass("checkbox");
            item.addClass("rowItem");
            if(parcels[i].selected) {
                checkbox.addClass("selected");
            }
            item.append(info);
            item.append(checkbox);
            row.append(item);
            checkbox.click(($.proxy(function(parcel){
                return function(){
                    HomeTimer.touch();
                    var d = $("#parcel-" + parcel.shipmentNumber);
                    if(parcel.selected){
                        d.removeClass("selected");
                    } else {
                        d.addClass("selected");
                    }
                    parcel.selected = !parcel.selected;
                    self.selectionListener(self.getSelectedParcels());
                }
            }, this))(parcels[i]));
            $(container).append(row);
        }
        self.selectionListener(self.getSelectedParcels());
    };
    this.getSelectedParcels = function(){
        var out = [];
        for(var i in self.parcels){
            if(self.parcels[i].selected){
                out.push(self.parcels[i]);
            }
        }
        return out;
    };
};