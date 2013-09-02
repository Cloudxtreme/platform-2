/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.ChannelCounters = Cloudwalkers.Views.Widgets.Widget.extend({

	'innerRender' : function (el)
	{
		el.html (Mustache.render (Templates.channelcounters, this.options.channel));

		return this;
	}

});