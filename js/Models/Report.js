Cloudwalkers.Models.Report = Backbone.Model.extend({
	
	/* table	time	category	text	else (numbers, bars, pie) */

	'getDetails' : function ()
	{
		var stat = this.attributes.series[0];
		var details = this[this.attributes.type + "Details"](stat);
		
		details.title = stat.name;
		
		return details;
	},
	
	/**
	 *	Details by type
	 */
	  'textDetails' : function (stat)
	 {
	 
		var stream = Cloudwalkers.Session.getStream(this.get("streamid"));

		return {
			content : stat.values[0].value,
			description : "<strong>" + stream.get("customname") + "</strong>"
		}
	 },
	 
	 'comparisonDetails' : function (stat)
	 {
	 
		var diff = stat.values[0].value - stat.values[1].value;
		if(diff > 0) diff = "+ " + diff ;
		
		var perc = Math.round(stat.values[0].value / stat.values[1].value *100) - 100;

		return {
			content : stat.values[0].value,
			description : "<strong>" + diff + "</strong> (" + perc + "%) in last " + stat.interval
		}
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
			var widget = new Cloudwalkers.Views.Widgets.Charts.Piechart ({
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