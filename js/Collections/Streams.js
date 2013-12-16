
Cloudwalkers.Collections.Streams = Backbone.Collection.extend({

	'model' : Cloudwalkers.Models.Stream,
	
	'initialize' : function(){
		
		if( Cloudwalkers.Session.user.account)
			Cloudwalkers.Session.getStreams().listenTo(this, "add", Cloudwalkers.Session.getStreams().distantAdd)
	},
	
	'url' : function()
	{
		var param = this.parameters? "?" + $.param (this.parameters): "";
		
		return CONFIG_BASE_URL + 'json/account/' + Cloudwalkers.Session.getAccount ().id + '/streams' + param;
	},
	
	'parse' : function (response)
	{
		this.parameters = false;
		
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
	
	'distantAdd' : function(model)
	{
		if(!this.get(model.id)) this.add(model);	
	},
	
	'seed' : function(ids)
	{
		// Ignore empty id lists
		if(!ids || !ids.length) return [];
		
		var list = [];
		var fresh = _.compact( ids.map(function(id)
		{
			stream = Cloudwalkers.Session.getStream(id);
			
			this.add(stream? stream: {id: id});
			
			list.push(stream? stream: this.get(id));
			
			if(!stream || stream.outdated) return id;
		
		}, this));
		
		// Get list based on ids
		if(fresh.length)
		{
			this.parameters = {ids: fresh.join(",")};
			this.fetch();
		}

		return list;
	},
	
	/*'seed' : function(ids)
	{
		// Ignore empty id lists
		if(!ids || !ids.length) return [];
		
		var fresh = _.compact( ids.map(function(id)
		{
			stream = Cloudwalkers.Session.getStream(id);
			
			this.add(stream? stream: {id: id});
			
			if(!stream || stream.outdated) return id;
		
		}, this));
		
		// Get list based on ids
		if(fresh.length)
		{
			this.parameters = {ids: fresh.join(",")};
			this.fetch();
		}

		return this;
	},*/
	
	'filterNetworks' : function (streams, asArray)
	{
		if(!streams) streams = this.models;
		
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
	},
	
	'filterReportStreams' : function ()
	{
		var reportables = {};
		
				
		return reportables;
	}
		
	/*
	// Sort stream on priority
	streams.sort (function (a, b)
	{
		return a.priority < b.priority;
	});
	*/

});