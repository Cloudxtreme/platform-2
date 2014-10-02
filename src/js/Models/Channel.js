define(
	['backbone', 'Collections/Contacts', 'Collections/Messages'],
	function (Backbone, Contacts, Messages)
	{
		var Channel = Backbone.Model.extend({
	
			'endpoint' : '',
			'parameters' : '',
			
			'initialize' : function (attributes)
			{
				// Child channels
				this.channels = new Channels();
				this.channels.seed(this.get("channels"));
				
				// Child streams
				this.streams = new Cloudwalkers.Collections.Streams();
				this.streams.seed(this.get("streams"));
				
				// Child messages
				this.messages = new Messages();
				
				// Child notifications
				this.notifications = new Cloudwalkers.Collections.Notifications();
				
				// Child contacts
				this.contacts = new Contacts();
				
				// Listeners
				this.on("change", function(model){ Store.set("channels", model.attributes)});
				
				this.listenTo(this.messages, 'change:from', this.seedcontacts);
				this.listenTo(this.notifications, 'change:from', this.seedcontacts);
				//this.on("change:streams", function(){ Session.setStreams(this.get("streams")) });
				
			},
			
			'url' : function()
			{
				var id = this.id? this.id: "";
				
				return Session.api + '/channel/' + id + this.endpoint + this.parameters;
			},
			
			'parse' : function(response)
			{
				if(response.error) return [];
				
				// Save channel data
				Store.set("channels", response.channel);
				
				return response.channel;	
			},
			
			'sync' : function (method, model, options)
			{		
				if(method == "read")
				{
					this.endpoint = (options.endpoint)? "/" + options.endpoint: "";
					this.parameters = (options.parameters)? "?" + $.param(options.parameters): "";
					
				} else if(method == "create")
				{
					this.endpoint = (options.parent)? options.parent + "/channels": "";  
				
				} else if(method == "delete")
				{
					this.endpoint = "";  
				}

				return Backbone.sync(method, model, options);
			},
			
			/**
			 *	Get Stream
			 *	Get stream by id (int) or token (string)
			 **/
			'getStream' : function(identifier)
			{
				 
				var param = {};
				param[(typeof identifier == 'string')? "token": "id"] = identifier;
				
				return this.streams.findWhere(param);
				
				
				/*if(typeof identifier == 'string')
				{
					var identifier = identifier;
					var streams = this.get("streams").filter(function(stream){ return stream.token==identifier});
					
					if(!streams.length) return null;
					
					var id = streams.shift().id;
				}
				 
				return Session.getStream((id)? id: identifier);*/

			 },
			 
			'seedcontacts' : function (child)
			{	
				var contacts = child.get("from");
				
				if (contacts && contacts.length) this.contacts.add(contacts);	
			}
			
			
			
			/*'post' : function(object, callback)
			{
				// Hack	
				var callback = callback
				
				Session.getAccount().channels.create(object, {parent: this.id, wait: true, success: function(model)
				{
					// Double hack
					if(callback) callback();
					
					// Hack
					var channels = this.get("channels");
					channels.push(model.attributes)
					
					this.set({channels: channels}).trigger("change:channels");
					this.store();
					
					
					
				}.bind(this)});	
			},
			
			'store' : function()
			{
				Store.set("channels", this.attributes);
			}
			 */
		});		

		return Channel;
});