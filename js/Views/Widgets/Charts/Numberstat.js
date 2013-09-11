Cloudwalkers.Views.Widgets.Charts.Numberstat = Cloudwalkers.Views.Widgets.Widget.extend ({

	'title' : 'Line chart',
	'icon' : 'reorder',
	'color' : null,
	'network' : null,
	'template' : 'dashboardstat',

	'getDataset' : function ()
	{
		return this.options.dataset;
	},

	'render' : function ()
	{
		var element = this.$el;
		var self = this;

		if (this.color)
			this.options.color = this.color;

		if (this.network)
			this.options.network = this.network;

		element.html (Mustache.render (Templates[this.template], this.options));

		this.options.dataset.getValues (function (values)
		{
			self.setValue (values);
		});

		this.options.dataset.on ('dataset:change', function (values)
		{
			self.setValue (values[0].values);
		});

		return this;
	},

	'numberOutput' : function (number, plus)
	{
		if (typeof (plus) == 'undefined')
		{
			plus = false;
		}

		if (number < 0)
		{
			return '- ' + Math.abs (number);
		}

		else if (plus)
		{
			return '+ ' + Math.abs (number);	
		}

		return number;
	},

	'setValue' : function (values)
	{
		var element = this.$el;
		var display = this.options.dataset.getDisplay ();

		var data = {};
		$.extend (true, data, this.options);

		var interval = this.options.dataset.getInterval ();

		data.details = [];

		if (values && values.length > 0)
		{
			// Always last available value

			if (display == 'comparison')
			{
				if (values.length > 1)
				{
					data.details.push ({ 'content' : '(' + this.numberOutput (Math.round(this.options.dataset.getEvolution () * 100), true) + '%)', 'descr' : 'Evolution' });
					//data.details.push ({ 'content' : this.numberOutput (values[1][1], true), 'descr' : 'Previous' });
					//data.details.push ({ 'content' : this.numberOutput (values[0][1] - values[1][1], true), 'descr' : 'Difference' });
				}

				data.details.push ({ 'content' : this.numberOutput (values[0][1]), 'descr' : 'Last ' + interval });
			}

			else
			{
				this.$el.find ('.number').html (this.numberOutput (values[values.length - 1][1]));
			}
		}
		else
		{
			data.details.push ({ 'content' : '☹', 'descr' : 'No information available at this time' });
		}

		element.html (Mustache.render (Templates[this.template], data));
	}

});