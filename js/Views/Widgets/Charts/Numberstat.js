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
		var display = this.options.dataset.getDisplay ();

		this.$el.find ('.interval').html (this.options.dataset.getInterval ());

		if (values && values.length > 0)
		{
			// Always last available value

			if (display == 'comparison')
			{
				//this.$el.find ('.interval').html ('');
				this.$el.find ('.evolution').html ('');
				this.$el.find ('.oldnumber').html ('');
				this.$el.find ('.difference').html ('');

				if (values.length > 1)
				{
					this.$el.find ('.oldnumber').html (values[1][1]);
					this.$el.find ('.difference').html (this.numberOutput (values[0][1] - values[1][1], true));
					this.$el.find ('.evolution').html (this.numberOutput (Math.round(this.options.dataset.getEvolution () * 100), true) + '%');
				}

				this.$el.find ('.number').html (this.numberOutput (values[0][1]));
			}

			else
			{
				this.$el.find ('.number').html (this.numberOutput (values[values.length - 1][1]));
			}
		}
		else
		{
			this.$el.find ('.number').html ('/');
		}
	}

});