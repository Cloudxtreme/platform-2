Cloudwalkers.Views.Widgets.Charts.Numberstat = Cloudwalkers.Views.Widgets.Widget.extend ({

	'title' : 'Line chart',
	'icon' : 'reorder',
	'color' : null,
	'network' : null,
	'template' : 'numberstat',

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
				this.$el.find ('.interval').html ('');
				this.$el.find ('.evolution').html ('');
				this.$el.find ('.oldnumber').html ('');

				this.$el.find ('.interval').html (this.options.dataset.getInterval ());
				this.$el.find ('.evolution').html (Math.round(this.options.dataset.getEvolution () * 100) + '%');

				if (values.length > 1)
				{
					this.$el.find ('.oldnumber').html (values[1][1]);
				}

				this.$el.find ('.number').html (values[0][1]);
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