define(
	['Collections/BaseCollection',  'Models/Channel'],
	function (BaseCollection, Channel)
	{
		var Channels = BaseCollection.extend({

			// MIGRATION
			///model : Channel,
	
			initialize : function()
			{					
				// MIGRATION
				if (!Channel)	Channel = require('Channel');

				// Global collection gets created before session build-up
				if( Cloudwalkers.Session.user.account)
				{
					Cloudwalkers.Session.getChannels().listenTo(this, "add", Cloudwalkers.Session.getChannels().distantAdd);
					
					// Listeners
					this.on("destroy", this.cleanModel);
				}
			},
			
			url : function()
			{
				var param = this.parameters? "?" + $.param (this.parameters): "";
				
				return Cloudwalkers.Session.api + '/account/' + Cloudwalkers.Session.getAccount ().id + '/channels' + param;
				// return CONFIG_BASE_URL + 'json/account/' + Cloudwalkers.Session.getAccount ().id + '/channels' + param;
			},
			
			parse : function(response)
			{
				this.parameters = false;
					
				return response.channels;
			},
			
			distantAdd : function(model)
			{
				if(!this.get(model.id)) this.add(model);	
			},
			
			seed : function(ids)
			{
				// Ignore empty id lists
				if(!ids || !ids.length) return [];
				
				var list = [];
				var fresh = _.compact( ids.map(function(id)
				{
					channel = Cloudwalkers.Session.getChannel(id);
					
					this.add(channel? channel: {id: id});
					
					list.push(channel? channel: this.get(id));
					
					if(!channel || channel.outdated) return id;
				
				}, this));
				
				// Get list based on ids
				if(fresh.length)
				{
					this.parameters = {ids: fresh.join(",")};
					this.fetch();
				}

				return list;
			},
			
			cleanModel : function(model)
			{
				if( model.get("parent"))
					Cloudwalkers.Session.getChannel(model.get("parent")).set({channels: this.pluck("id")});

				Store.remove("channels", {id: model.id});
			},
			
			updated : function (ids)
			{
				for (var n in ids)
				{
					var model = this.get(ids[n]);
					
					if(model && model.get("objectType"))
					{
						// Store with outdated parameter
						Store.set(this.typestring, {id: ids[n], outdated: true});
						
						// Trigger active models
						model.outdated = true;
						model.trigger("outdated");
					}
				}
			},

			outdated : function(id)
			{
				// Collection
				if(!id) return this.filter(function(model){ return model.outdated});
				
				// Update model
				var model = this.updates([id]);
			}
		});

		return Channels;
	}
);