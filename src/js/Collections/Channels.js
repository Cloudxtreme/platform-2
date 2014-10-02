define(
	['backbone', 'Session', 'Models/Channel'],
	function (Backbone, Session, Channel)
	{
		var Channels = Backbone.Collection.extend({

			model : Channel,
			
			initialize : function()
			{
				// Global collection gets created before session build-up
				if( Session.user.account)
				{
					Session.getChannels().listenTo(this, "add", Session.getChannels().distantAdd);
					
					// Listeners
					this.on("destroy", this.cleanModel);
				}
			},
			
			url : function()
			{
				var param = this.parameters? "?" + $.param (this.parameters): "";
				
				return Session.api + '/account/' + Session.getAccount ().id + '/channels' + param;
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
					channel = Session.getChannel(id);
					
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
					Session.getChannel(model.get("parent")).set({channels: this.pluck("id")});

				Store.remove("channels", {id: model.id});
			},
			
			updates : function (ids)
			{
				for(n in ids)
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
			
			/*'seed' : function(ids)
			{
				var list = [];
				
				var fresh = _.compact( ids.map(function(id)
				{
					channel = Session.getChannels().add({id: id});
					
					list.push(channel);
					
					if(!channel.get("name") || channel.outdated) return id;
				
				}, this));
				
				// Get list based on ids
				if(fresh.length)
				{
					this.parameters = {ids: fresh.join(",")};
					this.fetch();
				}

				return list;
			},*/
			
			/*// Add channels child streams to collection
			// used for first load only
			'collectStreams' : function ()
			{
				this.each(function(channel)
				{
					Session.getStreams().add(channel.streams);
				});
			}*/
		});

		return Channels;
	}
);