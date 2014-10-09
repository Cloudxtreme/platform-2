define(
	['backbone', 'Session'],
	function (Backbone, Session)
	{
		var Action = Backbone.Model.extend({
	
			typestring : "actions",
	
			initialize : function(options, init)
			{
				if(options) $.extend(this, options);
				
				// Get parent
				if (init)
					this.parent = init.collection.parent;
			},
			
			url : function()
			{	
				var url = [Session.api];
				
				if(this.parent)				url.push(this.parent.typestring, this.parent.id);
				if(this.typestring)			url.push(this.typestring);
				if(this.get("actiontype"))	url.push(this.get("actiontype"));

				url = url.join("/");

				return this.parameters? url + "?" + $.param(this.parameters) : url;
			},
			
			parse : function(data)
			{	
				// Catch hierarchy
				if (this.parent && data[this.parent.get("objectType")]) data = data[this.parent.get("objectType")];

				// Hack -> CLOUD-617
				else if (this.parent && this.parent.get("objectType") == 'comment')
					data = data.message
				
				return data;
			},
			
			 sync : function (method, model, options)
			{
				this.endpoint = (options.endpoint)? "/" + options.endpoint: false;
				
				// Hack
				if(method == "update") return false;
				
				return Backbone.sync(method, model, options);
			},
			
			loaded : function(param)
			{
				return this.get(param? param: "objectType") !== undefined;
			}
		});

		return Action;
});