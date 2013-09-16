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
		data.footer = '&nbsp;';

		if (values && values.length > 0)
		{
			// Always last available value
			if (display == 'comparison')
			{
				var text = this.numberOutput (values[0][1]);

				if (values.length > 1)
				{
					data.footer = '<strong>' + this.numberOutput (values[0][1] - values[1][1], true) + '</strong> (';
					data.footer += this.numberOutput (Math.round(this.options.dataset.getEvolution () * 100), true) + '%) ' + 'Since ' + interval;
					//data.details.push ({ 'content' : '(' + this.numberOutput (Math.round(this.options.dataset.getEvolution () * 100), true) + '%)', 'descr' : 'Evolution' });

					//text += ' (' + this.numberOutput (Math.round(this.options.dataset.getEvolution () * 100), true) + '%)';

					//data.details.push ({ 'content' : this.numberOutput (values[1][1], true), 'descr' : 'Previous' });
					//data.details.push ({ 'content' : this.numberOutput (values[0][1] - values[1][1], true), 'descr' : 'Difference' });
				}
				else
				{
					data.footer = 'Last ' + interval;
				}

				data.details.push ({ 'content' : text, 'descr' : data.stream.customname + ' ' + data.title });
			}

			else
			{
				this.$el.find ('.number').html (this.numberOutput (values[values.length - 1][1]));
			}
		}
		else
		{
			data.details.push ({ 'content' : '☹', 'descr' : 'No info' });
		}

		element.html (Mustache.render (Templates[this.template], data));
	}

});