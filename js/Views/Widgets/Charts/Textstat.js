Cloudwalkers.Views.Widgets.Charts.Textstat = Cloudwalkers.Views.Widgets.Widget.extend ({

	'title' : 'Line chart',
	'icon' : 'reorder',
	'color' : null,
	'network' : null,
	'template' : 'textstat',

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

	'setValue' : function (values)
	{
		var display = this.options.dataset.getDisplay ();

		this.$el.find ('.interval').html (this.options.dataset.getInterval ());

		if (values && values.length > 0)
		{
			// Always last available value
			this.$el.find ('.value').html (values[0][1]);
		}
		else
		{
			this.$el.find ('.value').html ('/');
		}
	}

});