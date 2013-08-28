Cloudwalkers.Views.Widgets.Charts.Numberstat = Cloudwalkers.Views.Widgets.Widget.extend ({

	'title' : 'Line chart',
	'icon' : 'reorder',
	'color' : null,
	'network' : null,

	'render' : function ()
	{
		var element = this.$el;
		var self = this;

		if (this.color)
			this.options.color = this.color;

		if (this.network)
			this.options.network = this.network;

		element.html (Mustache.render (Templates.numberstat, this.options));

		this.options.dataset.getValues (function (values)
		{
			self.setValue (values);
		});

		return this;
	},

	'setValue' : function (values)
	{
		var display = this.options.dataset.getDisplay ();

		if (values && values.length > 0)
		{
			// Always last available value

			if (display == 'comparison')
			{
				var text = 'N: ' + values[0][1];

				if (values.length > 1)
				{
					text += ' - ' + this.options.dataset.getInterval ();
					text += ' - ' + Math.round(this.options.dataset.getEvolution () * 100) + '%';

					text += ' - B: ' + values[1][1];	
				}

				this.$el.find ('.number').html (text);
			}

			else
			{
				this.$el.find ('.number').html (values[values.length - 1][1]);
			}
		}
		else
		{
			this.$el.find ('.number').html ('NaN');
		}
	}

});