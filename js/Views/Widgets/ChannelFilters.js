/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.ChannelFilters = Backbone.View.extend({

	'events' : {
		'change select[name=stream]' : 'change'
	},

	'render' : function ()
	{
		var self = this;
		var channel = this.options.channel;

		this.$el.html ('<p>Please wait, loading streams.</p>');

		channel.getStreams (function (streams)
		{
			var data = {};

			data.streams = streams;

			self.$el.html (Mustache.render (Templates.channelfilters, data));

			return this;
		});

		return this;
	},

	'change' : function ()
	{
		this.trigger ('stream:change', this.$el.find ('select[name=stream]').val ());
	}

});