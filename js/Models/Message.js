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

		//console.log ('Contacting ' + action.name + ' with parameters:');
		//console.log (parameters);

		var data = {
			'actions' : [
				{
					'token' : action.token,
					'parameters' : parameters
				}
			]
		};

		// Do the call
		jQuery.ajax
		({
			data: JSON.stringify (data), 
			dataType:"json", 
			type:"put", 
			url: CONFIG_BASE_URL + 'json/message/' + this.get ('id') + '?account=' + Cloudwalkers.Session.getAccount ().get ('id'), 
			processData : false,
			success:function(objData)
			{
				console.log (objData);
			}
		});
	},

	'scheduledate' : function ()
	{
		var schedule = this.get ('schedule');
		var time = (new Date());

		if (schedule)
		{
			if (schedule.date == 'ASAP')
			{
				// Do nothing
			}

			else
			{
				time = (new Date(schedule.date));
			}
		}

		return time;
	},

	'repeat' : function ()
	{
		var schedule = this.get ('schedule');

		var out = {};

		out.weekdays = {};
		out.interval = 0;
		out.unit = 'days';
		out.end = null;

		if (schedule.repeat)
		{
			if (schedule.repeat.end)
			{
				out.end = new Date(schedule.repeat.end);
			}

			if (schedule.repeat.weekdays)
			{
				for (var i = 0; i < schedule.repeat.weekdays.length; i ++)
				{
					out.weekdays[schedule.repeat.weekdays[i]] = true;
				}
			}
		}

		return out;
	}

});