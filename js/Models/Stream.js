Cloudwalkers.Models.Stream = Backbone.Model.extend({
	
	'parameters' : {},
	
	'initialize' : function(attributes){
		
		// Child messages
		this.messages = new Cloudwalkers.Collections.Messages();
		
		// Child contacts (temp hack, should be channel level only)
		this.contacts = new Cloudwalkers.Collections.Contacts();
		
		// Has reports?
		if(this.get("statistics"))
		{
			this.reports = new Cloudwalkers.Collections.Reports();
			this.reports.streamid = this.id;
		}
		
		// Listen to outdates
		this.on("outdated", this.update);
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
		
		return CONFIG_BASE_URL + 'json/streams/' + id + this.endpoint + this.parameters;
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

	'getmessages' : function(){

		return _.isObject(this.get("messages")) ? this.get("messages").total : this.get("messages");
	},

	'getactivities' : function(){

		return _.isObject(this.get("activities")) ? this.get("activities").total : this.get("activities");
	},

	'getimpressions' : function(){

		var messages = _.isObject(this.get("messages")) ? this.get("messages") : null;
		
		if(messages && messages.impressions)	return messages.impressions
		else									return 0;
	},

	'getbesttime' : function(){

		if(_.isObject(this.get("messages").bestTimeToPost))
			return this.get("messages").bestTimeToPost;
	}

});