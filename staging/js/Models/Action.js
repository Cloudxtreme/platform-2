define(
	['backbone', 'Session'],
	function (Backbone, Session)
	{
		var Action = Backbone.Model.extend({
	
			'typestring' : "actions",
	
			'initialize' : function(options, init)
			{
				if(options) $.extend(this, options);
				
				// Get parent
				if (init)
					this.parent = init.collection.parent;
			},
			
			'url' : function()
			{	
				var url = [Session.api];
				
				if(this.parent)				url.push(this.parent.typestring, this.parent.id);
				if(this.typestring)			url.push(this.typestring);		
				//if(this.id)					url.push(this.id);
				if(this.get("actiontype"))	url.push(this.get("actiontype"));

				url = url.join("/");

				return this.parameters? url + "?" + $.param(this.parameters) : url;
			},
			
			
			'parse' : function(data)
			{	
				// Catch hierarchy
				if (this.parent && data[this.parent.get("objectType")]) data = data[this.parent.get("objectType")];

				// Hack -> CLOUD-617
				else if (this.parent && this.parent.get("objectType") == 'comment')
					data = data['message']
				
				return data;
			}
			
			/*'url' : function ()
			{	
				// Parent and parameters
				var param = this.parameters? "?" + $.param (this.parameters): "";
				var parent = this.parent? this.parent.get("objectType") + "s/" + this.parent.id: "";
				
				return CONFIG_BASE_URL + 'json/' + parent + '/actions/' + this.get("token") + param;
			}*/
		});

		return Action;
});