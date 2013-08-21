Cloudwalkers.Models.StatisticDataset = Backbone.Model.extend({

	'initialize' : function ()
	{
		var self = this;
	},

	'setDateRange' : function (start, end)
	{
		var self = this;

		$.ajax 
		(
			self.get('dataurl') + '?start=' + Math.floor(start.getTime () / 1000) + '&end=' + Math.floor(end.getTime () / 1000),
			{
				'success' : function (data)
				{
					//console.log (data);
					var values = [];

					for (var i = 0; i < data.statistics.values.length; i ++)
					{
						var date = (new Date(data.statistics.values[i].date).getTime ());

						values.push 
						([ 
							date,
							parseInt(data.statistics.values[i].value)
						])

						//console.log (data.statistics.values[i].value);
					}

					//console.log (values);

					//var data = [ [[0, 0], [1, 1]] ];
					self.trigger ('dataset:change', values);

				}
			}
		);
	},

	'getValues' : function (callback)
	{
		var self = this;

		$.ajax 
		(
			self.get('dataurl'),
			{
				'success' : function (data)
				{
					if (typeof (data.statistics) == 'undefined')
					{
						callback (false);
						return;
					}

					var values = [];

					for (var i = 0; i < data.statistics.values.length; i ++)
					{
						var date = (new Date(data.statistics.values[i].date).getTime ());

						values.push 
						([ 
							date,
							parseInt(data.statistics.values[i].value)
						])

						//console.log (data.statistics.values[i].value);
					}

					//console.log (values);

					//var data = [ [[0, 0], [1, 1]] ];
					callback (values);

				}
			}
		);
	}

});