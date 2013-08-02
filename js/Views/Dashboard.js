Cloudwalkers.Views.Dashboard = Cloudwalkers.Views.Widgets.WidgetContainer.extend({

	'navclass' : 'dashboard',

	'initializeWidgets' : function ()
	{
		var collection;
		var widget;

		// All types
		collection = new Cloudwalkers.Collections.TypedMessages ([], { 'id' : 'social', 'name' : 'Social media' });
		widget = new Cloudwalkers.Views.Widgets.MessageList ({ 'channel' : collection, 'color' : 'blue' });

		this.addHalfWidget (widget);

		// All types
		collection = new Cloudwalkers.Collections.Drafts ([], { 'name' : 'Inbox Co-Workers' });
		widget = new Cloudwalkers.Views.Widgets.MessageList ({ 'channel' : collection, 'color' : 'yellow' });

		this.addHalfWidget (widget);

		// All types
		collection = new Cloudwalkers.Collections.Scheduled ([], { 'name' : 'Scheduled messages' });
		widget = new Cloudwalkers.Views.Widgets.MessageList ({ 'channel' : collection, 'color' : 'grey' });

		this.addHalfWidget (widget, true);

		// All types
		collection = new Cloudwalkers.Collections.Scheduled ([], { 'name' : 'Scheduled messages' });
		widget = new Cloudwalkers.Views.Widgets.MessageList ({ 'channel' : collection, 'color' : 'red' });

		this.addHalfWidget (widget);
	}

	/*
	'events' : {
		'click a.write-message-link' : 'writeMessage'
	},

	'render' : function ()
	{
		var self = this;

		self.$el.html ('<p>Please wait, we are loading the dashboard. This could take some time...</p>');

		Cloudwalkers.Session.call 
		(
			'dashboard', 
			{ 
				'account' : Cloudwalkers.Session.getAccount ().get ('id') 
			}, 
			null, 
			function (data)
			{
				Cloudwalkers.Utilities.StreamLibrary.parse (data.streams);

				self.$el.html (Mustache.render (Templates.dashboard, data));

				// types
				for (var i = 0; i < data.types.length; i ++)
				{
					self.addMessages (data.types[i].name, data.types[i].messages)
				}

				// channels
				for (var i = 0; i < data.channels.length; i ++)
				{
					self.addMessages (data.channels[i].name, data.channels[i].messages, '#channel/' + data.channels[i].id);
				}

				// schedule
				self.addSchedule (data.schedule);

				self.trigger ('content:change');
				//jcf.customForms.replaceAll();
			}
		);

		return this;
	},

	'addMessages' : function (type, messages, more)
	{
		this.$el.find ('.messages-container').append ('<div class="comment-heading"><h3>' + type + '</h3></div>');

		for (var i = 0; i < messages.length; i ++)
		{
			var model = new Cloudwalkers.Models.Message (messages[i]);
			var view = new Cloudwalkers.Views.Message ({ 'model' : model });

			this.$el.find ('.messages-container').append (view.render ().el);
		}

		if (typeof (more) != 'undefined')
		{
			this.$el.find ('.messages-container').append ('<div class="button-row"><a href="' + more + '"><span>more from ' + type + '</span></a></div>');
		}
	},

	'addSchedule' : function (messages)
	{
		for (var i = 0; i < messages.length; i ++)
		{
			var model = new Cloudwalkers.Models.Message (messages[i]);
			var view = new Cloudwalkers.Views.OutgoingMessage ({ 'model' : model });

			this.$el.find ('.schedule-container').append (view.render ().el);
		}

		this.$el.find ('.schedule-container').append ('<div class="button-row"><a href="#schedule"><span>view more scheduled messages</span></a></div>');
	},

	'writeMessage' : function (e)
	{
		Cloudwalkers.RootView.writeMessage (e);
	}
	*/

});