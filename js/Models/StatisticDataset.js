Cloudwalkers.Models.StatisticDataset = Backbone.Model.extend({

	'initialize' : function (options)
	{
		if (typeof (options.entity) != 'undefined')
		{
			this.entity = options.entity;
		}
		else
		{
			this.entity = 'statistics';
		}

		if (typeof (options.type) != 'undefined')
		{
			this.type = options.type;
		}
		else
		{
			this.type = 'time';
		}
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
					if (typeof (data[self.entity]) == 'undefined')
					{
						callback (false);
						return;
					}


					//console.log (values);
					var values = self.processValues (data[self.entity].values);

					//console.log (values);

					//var data = [ [[0, 0], [1, 1]] ];
					callback (values);

				}
			}
		);
	},

	'processValues' : function (inputvalues)
	{
		var values = [];
		var category

		for (var i = 0; i < inputvalues.length; i ++)
		{
			// If time related chart, show time
			if (this.type == 'time')
			{
				category = (new Date(inputvalues[i].date).getTime ());
			}

			// If categorized, show category (can be string)
			else if (this.type == 'category')
			{
				category = inputvalues[i].category;
			}

			// Otherwise, just show counter
			else 
			{
				category = i;
			}

			values.push 
			([ 
				category,
				parseInt(inputvalues[i].value)
			])

			//console.log (data.statistics.values[i].value);
		}

		return values;
	}

});