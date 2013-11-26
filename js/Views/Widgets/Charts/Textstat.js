Cloudwalkers.Views.Widgets.Charts.Textstat = Cloudwalkers.Views.Widgets.Widget.extend ({

	'title' : 'Line chart',
	'icon' : 'reorder',
	'color' : null,
	'network' : null,
	'template' : 'dashboardstat',
	'size' : 3,

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

		this.options.footer = '&nbsp;';

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
		var element = this.$el;

		var data = {};
		$.extend (true, data, this.options);

		data.footer = '<strong>' + this.options.stream.get("customname") + '</strong> ' + this.options.title;

		data.details = [];

		if (values && values.length > 0)
		{
			// Always last available value
			data.details.push ({ 'content' : values[0][1], 'descr' : values[0][0] });
		}
		else
		{
			data.details.push ({ 'content' : '☹', 'descr' : 'No info' });
		}

		
		element.html (Mustache.render (Templates[this.template], data));
		element.find('.portlet-loading').toggleClass('portlet-loading');
	}

});