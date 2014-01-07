Cloudwalkers.Collections.Messages = Backbone.Collection.extend({
	
	'model' : Cloudwalkers.Models.Message,
	'processing' : false,
	'paging' : {},
	
	'initialize' : function()//(list, options)
	{
		// Prep parameters
		this.parameters = {};
		
		
		//this.parentid = options.id? options.id: null;
		//this.endpoint = options.endpoint? options.endpoint: "channel";
		
		//this.parameters = {
		//	records : options.records? options.records: 20,
		//	page : options.page? options.page: 1
		//}
		
		if( Cloudwalkers.Session.user.account)
			Cloudwalkers.Session.getMessages().listenTo(this, "add", Cloudwalkers.Session.getMessages().distantAdd)
	},
	
	'url' : function(a)
	{
		// Get parent model
		var url = (this.parentmodel)?

			CONFIG_BASE_URL + "json/" + this.parentmodel.get("objectType") + "/" + this.parentmodel.id :
			CONFIG_BASE_URL + "json/message";
				
		if(this.endpoint)	url += "/" + this.endpoint;

		return this.parameters? url + "?" + $.param (this.parameters): url;
			
		//if(this.endpoint && this.parentid)
			 
		//	 return CONFIG_BASE_URL + "json/" + this.endpoint + "/" + this.parentid + "/messages?" + $.param (this.parameters);
		//else return CONFIG_BASE_URL + "json/message?" + $.param (this.parameters);
	},
	
	'parse' : function (response)
	{
		// Get messages (or ids)
		var messages = this.parentmodel?
		
			response[this.parentmodel.get("objectType")].messages :
			response.messages;
			
		// Get paging
		var paging = this.parentmodel?
		
			response[this.parentmodel.get("objectType")].paging :
			response.paging;
		
		this.setcursor(paging);
		
		//if(response.stream) return response.stream.messages;
		//if(response.channel) return response.channel.messages;
		return messages;
	},
	
	'sync' : function (method, model, options) {
		
		this.processing = true;
		
		// ! Deprecated
		if(options.parentid) this.parentid = options.parentid;
		
		return Backbone.sync(method, model, options);
	},
	
	'distantAdd' : function(model)
	{
		if(!this.get(model.id)) this.add(model);	
	},
	
	'setcursor' : function (paging) {

		// Without paging, it's a messages call
		if(!paging) return false;

		this.cursor = paging.cursors.after;
	},
	
	/*
		Touch messages
		First: check Store for ids list (within Ping lifetime)
		Second: request list update, if needed
	*/
	
	'touch' : function(model, params, callback)
	{
		// Work data
		this.parentmodel = model;
		this.endpoint = model.childtype + "ids";
		this.parameters = params;
		
		console.log(this.url())
		
		// Check for history (within ping lifetime)
		Store.get("touches", {id: this.url(), ping: Cloudwalkers.Session.getPing().cursor},
			function(callback, response){

				var messages = (response && response.messageids.length)?
					this.existing(response.messageids): [];
				
				// If stored messages are found
				if (messages.length && messages.length == response.messageids.length)
					callback(messages)
				
				// Fetch & Store results
				else this.fetch({success: this.touchresponse.bind(this, this.url(), callback)});
			
			}.bind(this, callback));
		
	},
	
	'touchresponse' : function(url, callback, collection, response)
	{
		// Get ids
		var ids = response[this.parentmodel.get("objectType")].messages;
		
		// Store results based on url (for parameters)
		Store.set("touches", {id: url, messageids: ids, ping: Cloudwalkers.Session.getPing().cursor});
	
		// Seed ids to collection (get non-stored messages)
		callback(this.seed(ids));
	},
	
	'existing' : function(ids)
	{		
		var list = _.compact( ids.map(function(id)
		{
			var message = Cloudwalkers.Session.getMessage(id);
			
			if(message && message.get("objectType") && !message.outdated) return message;
		
		}, this));

		return list;
	},
	
	'seed' : function(ids)
	{
		// Ignore empty id lists
		if(!ids || !ids.length) return [];

		var list = [];
		var fresh = _.compact( ids.map(function(id)
		{
			message = Cloudwalkers.Session.getMessage(id);
			
			// Deprecated?
			this.add(message? message: {id: id});
			
			list.push(message? message: this.get(id));
			
			if(!message || !message.get("objectType") || message.outdated) return id;
		
		}, this));
		
		// Get list based on ids
		if(fresh.length)
		{
			this.endpoint = "messages";
			// HACK: ?ids should not have an additional ?records 
			this.parameters = {ids: fresh.join(",")};
			this.fetch();
		}

		return list;
	},
	
	'more' : function(model, params, callback)
	{
		if(!this.cursor) return false;
		
		params.after = this.cursor;
		this.touch(model, params, callback)
		
		return this;
	}
	
	/*'seed' : function(ids)
	{
		
		var fresh = [];
		
		for(n in ids)
		{
			message = this.add({id: ids[n]});
			
			if(!message.get("date") || message.outdated) fresh.push(ids[n]);
		}
		
		// Get list based on ids
		this.parameters = {ids: fresh.join(",")};
		this.fetch();
		
		// Clean the parameters
		this.parameters = {};
			
	},*/
	
	/*'seed' : function(ids)
	{
		var list = [];
		
		var fresh = _.compact( ids.map(function(id)
		{
			message = Cloudwalkers.Session.getMessages().add({id: id});
			
			list.push(message);
			
			if(!message.get("date") || message.outdated) return id;
		
		}, this));
		
		// Get list based on ids
		if(fresh.length)
		{
			this.parameters = {ids: fresh.join(",")};
			this.fetch();
			
			this.parameters = {};
		}

		return list;
	},*/
	
	/*'hook' : function(callbacks)
	{
		if(callbacks.records) this.parameters.records = callbacks.records;
		
		
		if(!this.processing) this.fetch({error: callbacks.error});
		
		else if(this.length) callbacks.success(this);

		this.on("sync", callbacks.success);	
	},
	
	'next' : function (params)
	{
		this.parameters.page ++;
		this.fetch(params);
	}*/
});