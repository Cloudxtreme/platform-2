Cloudwalkers.Collections.Note = Backbone.Collection.extend({
	
	'model' : Cloudwalkers.Models.Note,
	'typestring' : "notes",
	'modelstring' : "note",
	'parameters' : {},
	'paging' : {},
	'cursor' : false,
	
	'events' : {
		'remove' : 'destroy'
	},
	
	'initialize' : function(options)
	{
		// Override type strings if required
		if(options) $.extend(this, options);

		// Check if it's empty only after sync
		/*this.on('sync', function(){
			setTimeout(function(){
				this.isempty();
			}.bind(this),1);
		});*/
	},
	
	'destroy' : function ()
	{
		console.log("collection destroyed")
		this.reset();
	},

	'isempty' : function(){		
		if(this.length == 0){
			this.trigger('ready:empty');
		}
	},

	'url' : function()
	{
		var url = [CONFIG_BASE_URL + "json"];

		if(this.id)										url.push(this.typestring, this.id);
		else if(this.parent.typestring == 'messages')	url.push(this.parent.typestring, this.parent.id, this.typestring);
		else if(this.parent.typestring == 'contacts'){
			
			url.push('accounts/' + Cloudwalkers.Session.getAccount().id + '/contacts');
			url.push(this.parent.id);
			url.push(this.typestring)
		}

		url = url.join("/");

		return this.parameters? url + "?" + $.param(this.parameters) : url;
	}
});