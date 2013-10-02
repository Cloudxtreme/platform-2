Cloudwalkers.Models.Report = Backbone.Model.extend({

	'dataset' : null,

	'initialize' : function ()
	{
		var self = this;

		// Set dataset
		self.dataset = new Cloudwalkers.Models.StatisticDataset 
		({ 
			'entity' : 'report', 
			'type' : self.getDatasetType (),
			'dataurl' : CONFIG_BASE_URL + 'json/' + self.get ('url')
		});
	},

	'getDataset' : function ()
	{
		return this.dataset;
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
		else if (this.get ('type') == 'time')
		{
			return 'time';
		}
		else if (this.get ('type') == 'text')
		{
			return 'text';
		}
		else
		{
			return 'category';
		}
	},

	'getWidget' : function ()
	{
		var self = this;
		var type = self.get ('type');

		if (type == 'bars')
		{
			var widget = new Cloudwalkers.Views.Widgets.Charts.Barchart ({
				'dataset' : self.dataset,
				'title' : (self.stream ? self.stream.name : '') + ' ' + self.get ('name'),
				'stream' : this.get('stream'),
				'report' : this
			});
		}

		else if (type == 'pie')
		{
			var widget = new Cloudwalkers.Views.Widgets.Charts.Piechart
			({
				'dataset' : self.dataset,
				'title' : (self.stream ? self.stream.name : '') + ' ' + self.get ('name'),
				'stream' : this.get('stream'),
				'report' : this
			});
		}

		else if (type == 'table')
		{
			var widget = new Cloudwalkers.Views.Widgets.Charts.Table ({
				'dataset' : self.dataset,
				'title' : (self.stream ? self.stream.name : '') + ' ' + self.get ('name'),
				'stream' : this.get('stream'),
				'report' : this
			});
		}

		else if (type == 'time')
		{
			var widget = new Cloudwalkers.Views.Widgets.Charts.Intervalchart ({
				'dataset' : self.dataset,
				'title' : (self.stream ? self.stream.name : '') + ' ' + self.get ('name'),
				'stream' : this.get('stream'),
				'report' : this
			});
		}

		else if (type == 'comparison')
		{
			var widget = new Cloudwalkers.Views.Widgets.Charts.Comparison ({
				'dataset' : self.dataset,
				'title' : (self.stream ? self.stream.name : '') + ' ' + self.get ('name'),
				'stream' : this.get('stream'),
				'report' : this
			});
		}

		else if (type == 'number')
		{
			var widget = new Cloudwalkers.Views.Widgets.Charts.Numberstat ({
				'dataset' : self.dataset,
				'title' : (self.stream ? self.stream.name : '') + ' ' + self.get ('name'),
				'stream' : this.get('stream'),
				'report' : this
			});
		}

		else if (type == 'text')
		{
			var widget = new Cloudwalkers.Views.Widgets.Charts.Textstat ({
				'dataset' : self.dataset,
				'title' : (self.stream ? self.stream.name : '') + ' ' + self.get ('name'),
				'stream' : this.get('stream'),
				'report' : this
			});
		}

		else 
		{
			alert ('Report type not found: ' + type);
		}

		return widget;
	}

});