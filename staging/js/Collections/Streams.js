
define(
	['backbone', 'Session', 'Models/Stream'],
	function (Backbone, Session, Stream)
	{
		var Streams = Backbone.Collection.extend({
			
			'model' : Stream,
			
			'initialize' : function(){

				if(!Session)	Session = require('Session');
				
				if( Session.user.account)
					Session.getStreams().listenTo(this, "add", Session.getStreams().distantAdd)
			},
			
			'url' : function()
			{
				var param = this.parameters? "?" + $.param (this.parameters): "";
				
				return Session.api + '/account/' + Session.getAccount ().id + '/streams' + param;
				// return CONFIG_BASE_URL + 'json/account/' + Session.getAccount ().id + '/streams' + param;
			},
			
			'parse' : function (response)
			{
				this.parameters = false;
				
				return response.streams;
			},
			
			'sync' : function (method, model, options) {
				
				options.headers = {
		            'Authorization': 'Bearer ' + Session.authenticationtoken,
		            'Accept': "application/json"
		        };
				
				/*// Store Local - deprecated
				if( method == "read")
					Store.get(this.url(), null, function(data)
					{
						if(data) this.add(data);

					}.bind(this));*/
				
				return Backbone.sync(method, model, options);
			},
			
			'distantAdd' : function(model)
			{	
				if(!this.get(model.id)) this.add(model);	
			},
			
			'updates' : function (ids)
			{
				for(n in ids)
				{
					var model = this.get(ids[n]);
					
					if(model && model.get("objectType"))
					{
						// Store with outdated parameter
						Store.set(this.typestring, {id: model.id, outdated: true});
						
						// Trigger active models
						model.outdated = true;
						model.trigger("outdated", model);
					}
				}
			},

			'outdated' : function(id)
			{
				// Collection
				if(!id) return this.filter(function(model){ return model.outdated});
				
				// Update model
				var model = this.updates([id]);
			},
			
			'seed' : function(ids)
			{
				// Ignore empty id lists
				if(!ids || !ids.length) return [];
				
				var list = [];
				var fresh = _.compact( ids.map(function(id)
				{
					stream = Session.getStream(id);
					
					this.add(stream? stream: {id: id});
					
					list.push(stream? stream: this.get(id));
					
					// Hack!
					if(!stream /*|| stream.outdated*/) return id;
				
				}, this));
				
				// Get list based on ids
				if(fresh.length)
				{
					this.parameters = {ids: fresh.join(",")};
					this.fetch();
				}

				return list;
			},

			'parsecontacts' : function(){
				console.log(this);
			},
			
			/*'seed' : function(ids)
			{
				// Ignore empty id lists
				if(!ids || !ids.length) return [];
				
				var fresh = _.compact( ids.map(function(id)
				{
					stream = Session.getStream(id);
					
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
						networks[network.token] = {ids: [], icon: network.icon, token: network.token};
						
					networks[network.token].ids.push(stream.id);
				});
				
				if(!asArray) return networks;
				
				var networksarray = [];
				
				$.each(networks, function(i, network)
				{
					network.ids = network.ids.join(" ");
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

		return Streams;
});