Cloudwalkers.Collections.Tags = Backbone.Collection.extend({
	
	'model' : Cloudwalkers.Models.Tag,
	'typestring' : "tags",
	'modelstring' : "tag",
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
		this.on('sync', function(){
			setTimeout(function(){
				this.isempty();
			}.bind(this),1);
		});
	},
	
	'destroy' : function ()
	{
		this.reset();
	},

	'isempty' : function(){		
		if(this.length == 0){
			this.trigger('ready:empty');
		}
	},

	'url' : function()
	{
		var url = [Cloudwalkers.Session.api];

		if(this.parentmodel.typestring == 'contacts'){
			
			url.push('accounts/' + Cloudwalkers.Session.getAccount().id);
		}

		if(this.id)											url.push(this.typestring, this.id);
		else if(!this.parentmodel)							url.push(this.typestring);
		//Accounts
		else url.push(this.parentmodel.typestring, this.parentmodel.id, this.endpoint);
		url = url.join("/");

		return this.parameters? url + "?" + $.param(this.parameters) : url;
	}
});