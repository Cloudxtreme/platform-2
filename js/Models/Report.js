Cloudwalkers.Models.Report = Backbone.Model.extend({

	'callbackqueue' : [],
	'dataset' : null,
	'isloading' : false,
	'isloaded' : false,

	'initialize' : function (values)
	{
		this.callbackqueue = [];
		this.dataset = null;
		this.isloading = false;
		this.isloaded = false;

		if (typeof (values.stream) != 'undefined')
		{
			this.stream = values.stream;
		}
		else
		{
			this.stream = false;
		}
	},

	/**
	* Load data from server (name, type, ...)
	* and call callback when done (or if already done.)
	*/
	'_load' : function (callback)
	{
		if (this.isloaded)
		{
			callback ();
		}

		// ALready loading
		else if (this.isloading)
		{
			this.callbackqueue.push (callback);
		}

		// Load
		else
		{
			this.isloading = true;
			this.callbackqueue.push (callback);

			var self = this;

			$.ajax 
			(
				self.get('dataurl'),
				{
					'success' : function (data)
					{
						// Set all regular items
						var values = data.report.values;

						delete data.report.values;
						self.set (data.report);

						// Set dataset
						self.dataset = new Cloudwalkers.Models.StatisticDataset 
						({ 
							'entity' : 'report', 
							'type' : self.getDatasetType (),
							'dataurl' : self.get ('dataurl'),
							'initialvalues' : values
						});

						for (var i = 0; i < self.callbackqueue.length; i ++)
						{
							self.callbackqueue[i] ();
						}
					}
				}
			);


		}
	},

	'getDatasetType' : function ()
	{
		if (this.get ('type') == 'bars')
		{
			return 'category';
		}
		else if (this.get ('type') == 'table')
		{
			return 'table';
		}
		else
		{
			return 'category';
		}
	},

	'getWidget' : function (callback)
	{
		var self = this;

		this._load (function ()
		{
			var type = self.get ('type');

			if (type == 'bars')
			{
				var widget = new Cloudwalkers.Views.Widgets.Charts.Barchart ({
					'dataset' : self.dataset,
					'title' : (self.stream ? self.stream.name : '') + ' ' + self.get ('name')
				});
			}

			else if (type == 'pie')
			{
				var widget = new Cloudwalkers.Views.Widgets.Charts.Piechart
				({
					'dataset' : self.dataset,
					'title' : (self.stream ? self.stream.name : '') + ' ' + self.get ('name')
				});
			}

			else if (type == 'table')
			{
				var widget = new Cloudwalkers.Views.Widgets.Charts.Table ({
					'dataset' : self.dataset,
					'title' : (self.stream ? self.stream.name : '') + ' ' + self.get ('name')
				});
			}

			callback (widget);
		});
	},

	'getDataset' : function (callback)
	{
		var self = this;

		this._load (function ()
		{
			callback (self.dataset);
		})
	}

});