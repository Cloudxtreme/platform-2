Cloudwalkers.Models.StatisticDataset = Backbone.Model.extend({

	'initialize' : function (options)
	{
		if (typeof (options.entity) != 'undefined')
		{
			this.entity = options.entity;
		}
		else
		{
			this.entity = 'report';
		}

		if (typeof (options.type) != 'undefined')
		{
			this.type = options.type;
		}
		else
		{
			this.type = 'time';
		}

		this.isFetched = false;
		this.daterange = null;
		this.display = null;
		this.interval = null;
		this.intervalinput = null;
		this.evolution = null;
	},

	'getDataURL': function ()
	{
		var url = this.get('dataurl') + '?';
		if (this.daterange)
		{
			url += 'start=' + Math.floor(this.daterange[0].getTime () / 1000) + '&end=' + Math.floor(this.daterange[1].getTime () / 1000) + '&';
		}

		if (this.intervalinput)
		{
			url += 'interval=' + this.intervalinput;
		}

		return url;
	},

	'setDateRange' : function (start, end)
	{
		var self = this;
		this.daterange = [ start, end ];
		this.refresh ();
	},

	'refresh' : function ()
	{
		var self = this;
		$.ajax 
		(
			this.getDataURL (),
			{
				'success' : function (data)
				{
					//console.log (data);
					var values;
					if (typeof (data[self.entity]) != 'undefined')
					{
						self.setInternalParameters (data[self.entity].series[0]);
						//values = self.processValues (data[self.entity].values);
					}
					else
					{
						console.log ('Information not expected:');
						console.log (data);
						
						return;
					}

					var series = [];

					for (var i = 0; i < data[self.entity].series.length; i ++)
					{
						series.push ({
							'values' : self.processValues (data[self.entity].series[i].values)
						});
					}

					//console.log (values);

					//var data = [ [[0, 0], [1, 1]] ];
					self.trigger ('dataset:change', series);

				}
			}
		);
	},

	'setInterval' : function (interval)
	{
		this.intervalinput = interval;
	},

	'getDisplay' : function ()
	{
		return this.display;
	},

	'getInterval' : function ()
	{
		return this.interval;
	},

	'getEvolution' : function ()
	{
		return this.evolution;
	},

	/**
	* Get values, depreciated method to get all values 
	* of the first dataset.
	*/
	'getValues' : function (callback)
	{
		var self = this;

		this.getSeries (function (series)
		{
			//console.log (self.get ('dataurl'));
			//console.log (series);
			if (series.length > 0)
			{
				callback (series[0].values);
			}
			else
			{
				callback (null);
			}
		})
	},

	'getSeries' : function (callback)
	{
		var self = this;

		this.isFetched = true;

		$.ajax 
		(
			this.getDataURL (),
			{
				'success' : function (data)
				{
					if (typeof (data[self.entity]) == 'undefined')
					{
						callback (false);
						return;
					}

					var series = [];

					for (var i = 0; i < data[self.entity].series.length; i ++)
					{
						series.push ({
							'values' : self.processValues (data[self.entity].series[i].values)
						});
					}

					//var values = self.processValues (data[self.entity].values);

					self.setInternalParameters (data[self.entity].series[0]);

					//var data = [ [[0, 0], [1, 1]] ];
					//console.log (series);

					callback (series);

				}
			}
		);
	},

	'setInternalParameters' : function (data)
	{
		var self = this;
		//console.log (data[self.entity].interval);
		//console.log (data[self.entity].display);
		if (typeof (data.display) != 'undefined')
		{
			self.display = data.display;
		}

		if (typeof (data.evolution) != 'undefined')
		{
			self.evolution = data.evolution;
		}

		if (typeof (data.interval) != 'undefined')
		{
			self.interval = data.interval;
		}
	},

	'processValues' : function (inputvalues)
	{
		var values = [];
		var category;

		if (!inputvalues)
		{
			return [];
		}

		if (this.type == 'table')
		{
			// NO processing required
			return inputvalues;
		}
		else
		{
			for (var i = 0; i < inputvalues.length; i ++)
			{
				// If time related chart, show time
				if (this.type == 'time')
				{
					category = (new Date(inputvalues[i].date).getTime ());
				}

				// If categorized, show category (can be string)
				else if (this.type == 'category' || this.type == 'text')
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
					this.type != 'text' ? parseInt(inputvalues[i].value) : inputvalues[i].value
				])

				//console.log (data.statistics.values[i].value);
			}
		}

		return values;
	}

});