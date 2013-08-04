Cloudwalkers.Views.Dashboard = Cloudwalkers.Views.Widgets.WidgetContainer.extend({

	'navclass' : 'dashboard',
	'title' : 'Dashboard',

	'initializeWidgets' : function ()
	{
		var collection;
		var widget;

		// All channels
		var account = Cloudwalkers.Session.getAccount ();

		var channels = account.channels ();

		for (var i = 0; i < channels.length; i ++)
		{
			if (channels[i].type == 'inbox')
			{
				collection = new Cloudwalkers.Collections.Channel 
				(
					[], 
					{ 
						'id' : channels[i].id, 
						'name' : channels[i].name,
						'amount' : 10
					}
				);

				widget = new Cloudwalkers.Views.Widgets.MessageList ({ 'channel' : collection, 'color' : 'blue', 'title' : 'Inbox social media' })
				this.addHalfWidget (widget, true);
			}
		}

		// All types
		/*
		collection = new Cloudwalkers.Collections.TypedMessages ([], { 'id' : 'social', 'name' : 'Social media' });
		widget = new Cloudwalkers.Views.Widgets.MessageList ({ 'channel' : collection, 'color' : 'blue' });

		this.addHalfWidget (widget);
		*/

		// All types
		collection = new Cloudwalkers.Collections.Drafts ([], { 'name' : 'Inbox Co-Workers' });
		widget = new Cloudwalkers.Views.Widgets.DraftList ({ 'channel' : collection, 'color' : 'yellow' });

		this.addHalfWidget (widget);

		// Useless stat bars
		widget = new Cloudwalkers.Views.Widgets.HTMLWidget ({ 'html' : Mustache.render (Templates.stat1, {}) });
		this.addHalfWidget (widget, true);

		widget = new Cloudwalkers.Views.Widgets.HTMLWidget ({ 'html' : Mustache.render (Templates.stat2, {}) });
		this.addHalfWidget (widget, false);
		// End Useless stat bars

		for (var i = 0; i < channels.length; i ++)
		{
			if (channels[i].type == 'monitoring')
			{
				collection = new Cloudwalkers.Collections.Channel 
				(
					[], 
					{ 
						'id' : channels[i].id, 
						'name' : channels[i].name,
						'amount' : 10
					}
				);

				widget = new Cloudwalkers.Views.Widgets.MessageList ({ 'channel' : collection, 'color' : 'grey' })
				this.addHalfWidget (widget, true);
			}
		}

		// All types
		collection = new Cloudwalkers.Collections.Scheduled ([], { 'name' : 'Scheduled messages' });
		widget = new Cloudwalkers.Views.Widgets.ScheduledList ({ 'channel' : collection, 'color' : 'red' });

		this.addHalfWidget (widget);

		// News and profiles
		for (var i = 0; i < channels.length; i ++)
		{
			if (channels[i].type == 'news' || channels[i].type == 'profiles')
			{
				collection = new Cloudwalkers.Collections.Channel 
				(
					[], 
					{ 
						'id' : channels[i].id, 
						'name' : channels[i].name,
						'amount' : 3,
						'showMoreButton' : '#channel/' + channels[i].id
					}
				);

				widget = new Cloudwalkers.Views.Widgets.Timeline ({ 'channel' : collection, 'color' : 'red' })
				this.addWidget (widget, true);
			}
		}

		// STUPID STAT BLOCKS
		widget = new Cloudwalkers.Views.Widgets.HTMLWidget ({ 'html' : Mustache.render (Templates.stat3, {}) });
		this.addHalfWidget (widget, true);

		widget = new Cloudwalkers.Views.Widgets.HTMLWidget ({ 'html' : Mustache.render (Templates.stat4, {}) });
		this.addHalfWidget (widget, false);
	}
});