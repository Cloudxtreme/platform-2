define(
	['backbone'],
	function (Backbone)
	{
		var Trigger = Backbone.Model.extend({
	
			typestring : "triggers",
	
			initialize : function()
			{
				if(!this.get("actions"))	this.set("actions", [])
			},
			
			parse : function(response)
			{	
				// A new object
				if (typeof response == "number") response = {id: response};
				
				// Store incoming object
				else this.stamp(response);

				return response;
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
			},

			getaction : function(type)
			{
				var actions = this.get("actions");
				var action = actions? actions.filter(function(el){ if(el.action == type) return el; }): null;

				if(action)
					return action.length? action[0]: null;
			},

			getmessage : function(type)
			{
				var action = this.getaction(type);
				
				if(action && action.message)
					return action.message.body? action.message.body.html: action.message;
				else
					return null;
			},

			setaction : function(type, attrs)
			{
				var action = this.getaction(type);

				if(action)	$.extend(action, attrs)
				else		this.attributes.actions.push($.extend({action: type}, attrs));
			},

			url : function()
			{	
				var url = [Cloudwalkers.Session.api];
				
				if(this.id)					url.push(this.typestring, this.id)
				else if(this.parent)		url.push(this.parent.typestring, this.parent.id, this.typestring);
				else if(this.typestring)	url.push(this.typestring);		
						
				return url.join("/");
			}
		});
	
		return Trigger;
});