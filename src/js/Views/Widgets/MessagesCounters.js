define(
	['Views/Widgets/Widget', 'mustache', 'Session', 'Views/Root', 'Views/CounterEntry'],
	function (WidgetView, Mustache, Session, RootView, CounterEntryView)
	{
		var MessagesCounters = WidgetView.extend({

			entries : [],
			events : {
				'click a[href]' : 'updatesettings'
			},
			
			initialize : function(options)
			{
			
				if(!options.color) this.options.color = this.color;
				
				// The list source is either the streams or subchannels
				this.collection = options.channel[options.source];

				// Scheduled list
				if(this.options.channel.get('type') == "outgoing")
				{
					this.listenTo(RootView, 'added:message', this.addedmessage.bind(this))
				}
			},

			addedmessage : function(message)
			{
				// Is it a scheduled message?
				if(message.get("schedule") && message.get("schedule").date)
					this.updatecollection();
			},
			
			render : function ()
			{			
				this.$el.html (Mustache.render (Templates.messagescounters, this.options));
				this.$container = this.$el.find('ul.messages-container.messages-list').eq(0)

				this.fill(this.collection);
				
				this.updatecollection();

				return this;
			},

			fill : function(collection)
			{	
				this.$container.empty();

				for(n in collection.models)
				{	
					var counterentry = new CounterEntryView({model: collection.models[n], data: this.options});
					this.$container.append(counterentry.render().el);
				}
			},	
			
			updatecollection : function()
			{
				this.listenToOnce(this.collection, 'sync', this.fill);

				// For inbox & scheduled
				if(this.options.source == 'streams')
				{
					this.options.channel.endpoint = '/streams';
					this.collection.url = this.options.channel.url();
				
					// Lazy update
					this.collection.fetch({remove: false})
				}
			},

			updatesettings : function (e)
			{
				// Currently streams only
				if(this.options.source != "streams" && this.options.source != "outgoing") return null;

				var model = this.collection.get($(e.currentTarget).data("stream"));
				var view = model.get("childtypes")[0] + "s";

				if(this.options.channel.get('type') == "outgoing")
					view = 'scheduled';
				
				// Memory cloth
				var settings = Session.viewsettings(view);
				
				// ... And store
				settings.streams = [model.id];
				Session.viewsettings(view, settings);
				
			},
			
			negotiateFunctionalities : function() {
				
				// Check for scroller
				if(this.$el.find('.scroller').length) this.addScroll();
				
				// Check amountSign
				if(this.options.counter) this.appendCounter();
				
				// Check collapse option
				if(typeof this.options.open != "undefined")
					this.appendCollapseble(this.options.open);
			}
		});

		return MessagesCounters;
	}
);