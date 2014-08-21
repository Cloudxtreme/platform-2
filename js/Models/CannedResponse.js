Cloudwalkers.Models.CannedResponse = Backbone.Model.extend({

	'typestring' : 'messages',

	'initialize' : function ()
	{
		this.streams = Cloudwalkers.Session.getStreams('canned');
	},

	'url' : function()
	{	
		var url = [Cloudwalkers.Session.api];
		
		if(this.id)			url.push(this.typestring + '/' + this.id)
		else if(!this.id)	url.push('accounts/' + Cloudwalkers.Session.getAccount ().id + '/' + this.typestring)
		
		return url.join("/");
	},

	'parse' : function(response)
	{
		return response.message? response.message: response;
	},

	'deletecanned' : function()
	{
		var self = this;

		Cloudwalkers.RootView.confirm 
		(
			this.translateString('are_you_sure_you_want_to_remove_this_template'), 
			function () 
			{
                self.destroy ({success:function(){
	       
	                // Hack
					self.trigger ("destroyed");
					//self.destroy();
					//window.location.reload();
	                    
                }});

			}
		);
	},

	'translateString' : function(translatedata)
	{	
		// Translate String
		return Cloudwalkers.Session.polyglot.t(translatedata);
	}


});