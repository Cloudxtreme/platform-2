/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.ScheduleCounter = Cloudwalkers.Views.Widgets.Widget.extend({

	 'initialize' : function ()
    {
        
        //console.log(Cloudwalkers.Session.getChannels());
        
        
        
        if(!this.options.color) this.options.color = this.color;
        
        // HACK
        Cloudwalkers.Session.on("change:streams", this.rebuild, this);
        
        // Always add this to all your widget initializations
        this.initializeWidget ();
    },

	
	'render' : function ()
	{
		var streams = Cloudwalkers.Session.getStreams();
		var data = {
			color: this.color,
			icon: this.options.icon,
			title: this.options.title,
			list: []
		};
		
		$.each (streams.where({outgoing: 1}), function (i, stream)
			{
				data.list.push(
					{ name: stream.get("customname"), url: '#schedule/' + stream.id, unread: stream.get("count").scheduled, icon: stream.get("network").icon }
				)
			});

		this.$el.html (Mustache.render (Templates.messagescounters, data));
		
		/*var el = this.$el;
		var self = this;

		this.$el.html('<div class="portlet portlet-loading"></div>');

		this.options.schedule.loadCounters (function (inputdata)
		{
			console.log(inputdata)
			
			var data = { list: [] };
			jQuery.extend (true, data, inputdata.schedule, self.options);

			// Order
			data.streams.sort (function (a, b)
			{
				return parseInt(a.message_count) < parseInt(b.message_count);
			});

			$.each (data.streams, function (i, v)
			{
				data.list.push(
					{ name: v.customname, url: '#schedule/' + v.id, unread: v.message_count ? v.message_count : 0, icon: v.network.icon }
				)
			});

			

			setTimeout (function ()
			{
				self.trigger ('content:change');
				self.negotiateFunctionalities();
			}, 100);
		});*/

		return this;
	},
	
	// HACK
	'rebuild' : function ()
	{
		if(!this.$el.find("li").size())
		{
			this.render();
			this.addScroll();
		}
	}
	
});