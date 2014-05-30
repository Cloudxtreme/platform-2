Cloudwalkers.Collections.Messages = Backbone.Collection.extend({
	
	'model' : Cloudwalkers.Models.Message,
	'typestring' : "messages",
	'modelstring' : "message",
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
		
		// Put "add" listener to global messages collection
		if( Cloudwalkers.Session.user.account)
			Cloudwalkers.Session.getMessages().listenTo(this, "add", Cloudwalkers.Session.getMessages().distantAdd);	

		// Check if it's empty only after sync
		this.on('sync', function(){
			setTimeout(function(){
				this.isempty();
			}.bind(this),1);
		});
	},
	
	'destroy' : function ()
	{
		console.log("collection destroyed")
		this.reset();
	},

	'isempty' : function(){		
		if(this.length == 0){
			this.trigger('ready');
		}
	}
});