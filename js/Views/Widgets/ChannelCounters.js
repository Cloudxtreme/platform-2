/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.ChannelCounters = Cloudwalkers.Views.Widgets.Widget.extend({

	'innerRender' : function (el)
	{
		var data = {};
		jQuery.extend (data, this.options.channel);

		data.message_count = data.unread;
		el.html (Mustache.render (Templates.messagecounter, data));

		return this;
	}

});