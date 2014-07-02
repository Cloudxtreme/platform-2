Cloudwalkers.Models.Note = Backbone.Model.extend({

	'typestring' : 'notes',

	'initialize' : function(options)
	{
		if(options) $.extend(this, options);

		this.on('action', this.action);
	},

	'url' : function()
	{	
		var url = [CONFIG_BASE_URL + "json"];

		if(this.id)										url.push(this.typestring, this.id);
		else if(!this.parent)							url.push(this.typestring);
		//Account
		else if(this.parent.typestring != 'contacts')	url.push(this.parent.typestring, this.parent.id, this.typestring);
		//Contacts
		else if(this.parent.typestring == 'contacts'){
			
			url.push('accounts/' + Cloudwalkers.Session.getAccount().id + '/contacts');
			url.push(this.parent.id);
			url.push(this.typestring)
		}

		url = url.join("/");

		return this.parameters? url + "?" + $.param(this.parameters) : url;
	},

	'action' : function(token)
	{
		if(token == 'delete')	this.destroy();
	}
});