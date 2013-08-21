Cloudwalkers.Views.Widgets.Charts.Numberstat = Cloudwalkers.Views.Widgets.Widget.extend ({

	'title' : 'Line chart',

	'render' : function ()
	{
		var element = this.$el;
		var self = this;

		element.html (Mustache.render (Templates.numberstat, this.options));

		this.options.dataset.getValues (function (values)
		{
			self.setValue (values);
		});

		return this;
	},

	'setValue' : function (values)
	{
		if (values && values.length > 0)
		{
			// Always last available value
			this.$el.find ('.number').html (values[values.length - 1].value);
		}
		else
		{
			this.$el.find ('.number').html ('NaN');
		}
	}

});