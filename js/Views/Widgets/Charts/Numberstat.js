Cloudwalkers.Views.Widgets.Charts.Numberstat = Cloudwalkers.Views.Widgets.Widget.extend ({

	'title' : 'Line chart',

	'render' : function ()
	{
		var element = this.$el;
		var self = this;

		element.html (Mustache.render (Templates.numberstat, this.options));

		$.ajax 
		(
			self.options.dataurl,
			{
				'success' : function (data)
				{
					if (typeof (data.statistics) != 'undefined' 
						&& typeof (data.statistics.values) != 'undefined' 
						&& data.statistics.values.length > 0)
					{
						// Always last available value
						self.$el.find ('.number').html (data.statistics.values[data.statistics.values.length - 1].value);
					}
					else
					{
						self.$el.find ('.number').html ('NaN');
					}
				}
			}
		);

		return this;
	}

});