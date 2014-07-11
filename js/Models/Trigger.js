Cloudwalkers.Models.Trigger = Backbone.Model.extend({
	
	'typestring' : "triggers",
	
	'initialize' : function()
	{
		if(!this.get("actions"))	this.set("actions", [])
	},

	'getaction' : function(type)
	{
		var actions = this.get("actions");
		var action = actions? actions.filter(function(el){ if(el.action == type) return el; }): null;

		if(action)
			return action.length? action[0]: null;
	},

	'getmessage' : function(type)
	{
		var action = this.getaction(type);
		
		if(action && action.message)
			return action.message.body? action.message.body.html: action.message;
		else
			return null;
	},

	'setaction' : function(type, attrs)
	{
		var action = this.getaction(type);

		if(action)	$.extend(action, attrs)
		else		this.attributes.actions.push($.extend({action: type}, attrs));
	},

	'url' : function()
	{	
		var url = [CONFIG_BASE_URL + "json"];
		
		if(this.id)					url.push(this.typestring, this.id)
		else if(this.parent)		url.push(this.parent.typestring, this.parent.id, this.typestring);
		else if(this.typestring)	url.push(this.typestring);		
				
		return url.join("/");
	}
});