define(	// MIGRATION
	['backbone', 'Session', /*'Collections/Contacts',*/ 'Collections/Messages', 'Collections/Channels', /*'Collections/Notifications',*/ 'Collections/Streams'],
	function (Backbone, Session, Messages, Channels, Streams)
	{
		var Channel = Backbone.Model.extend({
	
			endpoint : '',
			parameters : '',
			
			initialize : function (attributes)
			{				
				// Child channels
				this.channels = new Channels();
				this.channels.seed(this.get("channels"));
				
				// Child streams
				this.streams = new Streams();
				this.streams.seed(this.get("streams"));
				
				// Child messages
				this.messages = new Messages();
				
				// MIGRATION -> Do we need notifications & contacts collections on channel context?
				// Child notifications
				///this.notifications = new Notifications();
				
				// Child contacts
				///this.contacts = new Contacts();
				
				// Listeners
				this.on("change", function(model){ Store.set("channels", model.attributes)});
				
				this.listenTo(this.messages, 'change:from', this.seedcontacts);
				this.listenTo(this.notifications, 'change:from', this.seedcontacts);
				//this.on("change:streams", function(){ Session.setStreams(this.get("streams")) });
				
			},
			
			url : function()
			{
				var id = this.id? this.id: "";
				
				return Session.api + '/channel/' + id + this.endpoint + this.parameters;
			},
			
			parse : function(response)
			{
				if(response.error) return [];
				
				// Save channel data
				Store.set("channels", response.channel);
				
				return response.channel;	
			},
			
			sync : function (method, model, options)
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
			
			loaded : function(param)
			{
				return this.get(param? param: "objectType") !== undefined;
			},
			
			/**
			 *	Get Stream
			 *	Get stream by id (int) or token (string)
			 **/
			getStream : function(identifier)
			{
				 
				var param = {};
				param[(typeof identifier == 'string')? "token": "id"] = identifier;
				
				return this.streams.findWhere(param);

			 },
			 
			seedcontacts : function (child)
			{	
				var contacts = child.get("from");
				
				if (contacts && contacts.length) this.contacts.add(contacts);	
			}
		});

		return Channel;
});