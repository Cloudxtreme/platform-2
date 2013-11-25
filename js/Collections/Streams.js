
Cloudwalkers.Collections.Streams = Backbone.Collection.extend({

	'model' : Cloudwalkers.Models.Stream,
	
	'initialize' : function(){
		
	},
	
	'url' : function()
	{
		return CONFIG_BASE_URL + 'json/account/' + Cloudwalkers.Session.getAccount ().id + '/streams';
	},
	
	'parse' : function (response)
	{
		Store.write(this.url(), [response.streams]); 
		return response.streams;
	},
	
	'sync' : function (method, model, options) {
		
		// Store Local
		if( method == "read")
			Store.get(this.url(), null, function(data)
			{
				if(data) this.add(data);

			}.bind(this));
		
		return Backbone.sync(method, model, options);
	},
	
	'filterNetworks' : function (streams, asArray)
	{
		var networks = {};
		
		$.each(streams, function(i, stream)
		{
			var network = (stream.attributes)? stream.get("network") : stream.network;
			
			if(!networks[network.token])
				networks[network.token] = {ids: [], icon: network.icon};
				
			networks[network.token].ids.push(stream.id);
		});
		
		if(!asArray) return networks;
		
		var networksarray = [];
		
		$.each(networks, function(i, network)
		{
			network.ids = network.ids.join(",");
			networksarray.push(network);
		});
		
		return networksarray;
	}
	
	/*
	// Sort stream on priority
	streams.sort (function (a, b)
	{
		return a.priority < b.priority;
	});
	*/

});