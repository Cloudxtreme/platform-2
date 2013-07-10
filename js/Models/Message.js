Cloudwalkers.Models.Message = Backbone.Model.extend({

	'humandate' : function ()
	{
		var date = this.date ();
		return Cloudwalkers.Utils.longdate (date);
	},

	'date' : function ()
	{
		return (new Date(this.get ('date')));
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
		var self = this;

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
				//console.log (objData.message);
				self.set (objData.message);
			}
		});
	},

	'scheduledate' : function (showtext)
	{
		if (typeof (showtext) == 'undefined')
		{
			showtext = true;
		}

		var schedule = this.get ('schedule');
		var time = (new Date());

		if (showtext)
		{
			if (schedule)
			{
				if (schedule.date == 'ASAP')
				{
					// Do nothing
					return 'ASAP';
				}

				else
				{
					time = (new Date(schedule.date));
				}
			}

			return Cloudwalkers.Utils.longdate (time);
		}
		else
		{
			if (schedule)
			{
				if (schedule.date == 'ASAP')
				{
					// Do nothing
					return false;
				}

				else
				{
					time = (new Date(schedule.date));
					return time;
				}
			}
		}
	},

	'repeat' : function ()
	{
		var schedule = this.get ('schedule');

		var out = {};

		out.weekdays = {};

		if (typeof (schedule.repeat) != 'undefined')
		{
			// Need some calculations here
			var intervalSeconds = schedule.repeat.interval;
			var intervalunits = { 'minutes' : 60, 'hours' : 60 * 60, 'days' : 60 * 60 * 24, 'weeks' : 60 * 60 * 24 * 7, 'months' : 60 * 60 * 24 * 31 };

			for (var unit in intervalunits)
			{
				if ((intervalSeconds / intervalunits[unit]) < 72)
				{
					out.interval = Math.round (intervalSeconds / intervalunits[unit]);
					out.unit = unit;

					break;
				}
			}

			out.end = null;
			
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
	},

	'getStream' : function ()
	{
		if (this.get ('stream'))
		{
			return Cloudwalkers.Utilities.StreamLibrary.getFromId (this.get ('stream'));
		}
		return null;
	}

});