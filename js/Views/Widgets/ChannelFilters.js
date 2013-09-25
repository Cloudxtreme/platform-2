/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.ChannelFilters = Backbone.View.extend({

	'render' : function ()
	{
		var data = {};

		data.categories = [];

		data.categories.push ({
			'id' : 1,
			'name' : 'Brand',
			'keywords' : 10
		});

		data.categories.push ({
			'id' : 2,
			'name' : 'Marketing',
			'keywords' : 5
		});

		this.$el.html (Mustache.render (Templates.channelfilters, data));

		return this;
	}

});