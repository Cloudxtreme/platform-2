Cloudwalkers.Models.Tag = Backbone.Model.extend({

	'typestring' : 'tags',

	'initialize' : function(options)
	{
		if(options) $.extend(this, options);

		this.on('action', this.action);
	},

	'parse' : function (response) 
	{	
		response = response.tag? response.tag : response;
		
		if(response.date)
		{
			response.fulldate = moment(response.date).format("DD MMM YYYY HH:mm");
			response.dateonly = moment(response.date).format("DD MMM YYYY");
			response.time = moment(response.date).format("HH:mm");
		}

		return response;
	},

	'url' : function()
	{	
		var url = [Cloudwalkers.Session.api];

		//Contacts
		if(this.parent.typestring == 'contacts'){
			
			url.push('accounts/' + Cloudwalkers.Session.getAccount().id);
		}

		if((this.typestring == "tags") && (this.id)) url.push(this.parent.typestring, this.parent.id, this.typestring, this.id);
		else if(this.parent.typestring)	url.push(this.parent.typestring, this.parent.id, this.typestring);


		url = url.join("/");
		return this.parameters? url + "?" + $.param(this.parameters) : url;
	},

	'deletetag' : function()
	{
		var self = this;
		Cloudwalkers.RootView.confirm 
		(
			'Are you sure you want to remove this tag?', 
			function () 
			{
				self.destroy ({success:function(){
					self.trigger ("destroytag");
				}});
			}
		);
	}
});