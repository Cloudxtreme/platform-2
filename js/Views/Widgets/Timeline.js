/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.Timeline = Cloudwalkers.Views.Widgets.MessageContainer.extend({

	'template' : 'timeline',
	'messagetemplate' : 'messagetimeline',
	'messageelement' : 'li',

	'render' : function ()
	{
		if (typeof (this.options.title) != 'undefined')
		{
			this.title = this.options.title;
		}
		else
		{
			var filters = this.options.channel.getFilters ();

			//console.log (filters.streams);
			if (typeof (filters.streams) != 'undefined' && filters.streams.length > 0)
			{
				var stream = Cloudwalkers.Session.getStream (filters.streams[0]);

				//console.log (stream);

				if (stream)
					this.title = stream.customname;
			}
		}

		if (typeof (this.options.color) != 'undefined')
			this.color = this.options.color;

		var parameters = { 'title' : this.title, 'color' : this.color };
		this.$el.html (Mustache.render (Templates.widgetnoborder, parameters));

		this.$innerEl = $(this.$el.find ('.portlet-body'));
		this.innerRender (this.$innerEl);

		return this;
	}

});