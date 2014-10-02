define(
	['backbone', 'Session', 'Collections/Contacts', 'Collections/Messages'],
	function (Backbone, Session, Contacts, Messages)
	{
		var Stream = Backbone.Model.extend({
	
			'parameters' : {},
	
			'initialize' : function(attributes){
				
				// Child messages
				this.messages = new Messages();
				
				// Child contacts (temp hack, should be channel level only)
				this.contacts = new Contacts();
			
				// Has reports?
				if(this.get("statistics"))
				{
					//this.reports = new Cloudwalkers.Collections.Reports(); -> deprecated?
					this.reports.streamid = this.id;
				}
				
				// Listen to outdates
				//this.on("outdated", this.update);

			},
			
			'outdated' : function ()
			{
				this.fetch();
			},
			
			'update' : function ()
			{
				this.fetch();
			},
			
			'url' : function ()
			{
				var id = this.id? this.id: "";
				
				return Session.api + '/streams/' + id + this.endpoint + this.parameters;
			},
			
			'parse' : function(response)
			{
				if(response.stream) response = response.stream;
				
				// Hack
				this.outdated = response.outdated = false;
				
				Store.set("streams", response);
				
				return response;
			},
			
			'sync' : function (method, model, options)
			{
				options.headers = {
		            'Authorization': 'Bearer ' + Session.authenticationtoken,
		            'Accept': "application/json"
		        };
				
				if(method == "read")
				{
					this.endpoint = (options.endpoint)? "/" + options.endpoint: "";
					this.parameters = (options.parameters)? "?" + $.param(options.parameters): "";
					
				} else if(method == "create")
				{
					this.endpoint = (options.parent)? options.parent + "/streams": "";  
				}

				return Backbone.sync(method, model, options);
			},
			
			'seedusers' : function (child)
			{	

				var users = child.get("from");
				
				if (users && users.length) this.users.add(users);	
			},

			'getcontacts' : function(){
				return _.isObject(this.get("contacts")) ? this.get("contacts").total : this.get("contacts");
			},

			'getnotifications' : function(){
				return _.isObject(this.get("notifications")) ? this.get("notifications").total : this.get("notifications");
			},

			'getmessages' : function(){
				return _.isObject(this.get("messages")) ? this.get("messages").total : this.get("messages");
			},

			'getactivities' : function(){
				return _.isObject(this.get("activities")) ? this.get("activities").total : this.get("activities");
			},

			'getimpressions' : function(){

				if(this.impressions)	return this.impressions;

				var messages = _.isObject(this.get("messages")) ? this.get("messages") : null;		
				if(messages && messages.impressions)	return messages.impressions
				else									return 0;
			},

			'getfollowers' : function(){

				if(_.isObject(this.get("contacts"))){
					if(_.isObject(this.get("contacts").types)){
						return this.get("contacts").types.followers;
					}else{ 
						return 0;
					}
				}else{
					return 0;
				}
			},

			'getfollowing' : function(){

				if(_.isObject(this.get("contacts"))){
					if(_.isObject(this.get("contacts").types)){
						return this.get("contacts").types.following;
					}else{ 
						return 0;
					}
				}else{
					return 0;
				}
			},

			'getbesttime' : function(){
				if(_.isObject(this.get("messages").besttimetopost))
					return this.get("messages").besttimetopost;
			},

			'getnetwork' : function(){
				return this.get("network");
			},


			// Get/increment attributes dinamically to help in statistics

			'getattribute' : function(attribute){
				var attr = "get"+attribute;
				return this[attr]();
			},

			'incrementattr' : function(attribute, n){
				var attr = this.get(attribute);
				
				if(_.isObject(attr))		attr.total += n;
				else						attr += n;
				
				this.set(attribute, attr);

				return this;
			},

			'getlimitations' : function(limitation)
			{
				var network = this.get('network');

				return network? network.limitations: null;
			}
		});

		return Stream;
});