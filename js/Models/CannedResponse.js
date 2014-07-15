Cloudwalkers.Models.CannedResponse = Backbone.Model.extend({

	'initialize' : function ()
	{
		this.streams = Cloudwalkers.Session.getStreams('canned');
	},

	'url' : function()
	{
		var url = CONFIG_BASE_URL + 'json/accounts/' + Cloudwalkers.Session.getAccount ().id + '/messages';

		return url;
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