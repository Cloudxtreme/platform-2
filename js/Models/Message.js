Cloudwalkers.Models.Message = Backbone.Model.extend({

	'humandate' : function ()
	{
		var date = (new Date(this.get ('date')));
		return date.toLocaleString ();
	},

	'getAction' : function (token)
	{
		var actions = this.get ('actions');
		for (var i = 0; i < actions.length; i ++)
		{
			if (actions[i].token == token)
			{
				return actions[i];
			}
		}
		return null;
	},

	// Execute an action, if possible with parameters
	'act' : function (action, parameters)
	{
		if (typeof (parameters) == 'undefined')
		{
			parameters = {};
		}

		console.log ('Contacting ' + action.name + ' with parameters:');
		console.log (parameters);

		alert ('To be implemented.');
	}

});