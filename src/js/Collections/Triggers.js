define(
	['backbone', 'Session', 'Models/Trigger'],
	function (Backbone, Session, Trigger)
	{
		var Triggers = Backbone.Collection.extend({

			model : Trigger,
			typestring : "triggers",
			
			initialize : function()
			{
				
			},

			parse : function (response)
			{	
				return response.account.triggers;
			},
			
			url : function()
			{
				
				var url = [Session.api];
				
				if(this.parent)				url.push(this.parent.typestring, this.parent.id, this.typestring);
				else if(this.typestring)	url.push(this.typestring);		
						
				return url.join("/");
			},

		});

		return Triggers;
});