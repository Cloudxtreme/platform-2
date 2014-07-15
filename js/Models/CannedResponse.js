Cloudwalkers.Models.CannedResponse = Backbone.Model.extend({

	'endpoint' : 'messages',

	'initialize' : function ()
	{
		this.streams = Cloudwalkers.Session.getStreams('canned');
	},

	'url' : function()
	{	
		var url = [CONFIG_BASE_URL + 'json'];
		
		if(this.id)			url.push(this.endpoint + '/' + this.id)
		else if(!this.id)	url.push('accounts/' + Cloudwalkers.Session.getAccount ().id + this.endpoint)
		
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
			'Are you sure you want to remove this template?', 
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
	}


});