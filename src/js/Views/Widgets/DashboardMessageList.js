define(
	['Views/Widgets/MessageContainer', 'mustache', 'Collections/Messages', 'Views/Entry'],
	function (MessageContainer, Mustache, Messages, EntryView)
	{
		DashboardMessageList = MessageContainer.extend({

			'template' : 'dashboardmessagecontainer',
			'messagetemplate' : 'dashboardmessage',
			'entries' : [], 

			options : {},
			
			'initialize' : function(options)
			{
				$.extend(true, this.options, this.defaults);
				$.extend(this.options, options);
				
				//Stream
				this.model.messages = new Messages();

				// Listen to model
				this.listenTo(this.model.messages, 'seed', this.fill);
				this.loadListeners(this.model.messages, ['request', 'sync', 'ready'], true);
				
				this.initializeWidget ();
			},

			'render' : function ()
			{
				this.$el.html (Mustache.render (Templates.dashboardmessagecontainer, this.options));
				this.$container = this.$el.find ('.messages-container');
				this.$loadercontainer = this.$el.find ('.portlet-body');
				
				// Load messages
				this.model.messages.touch(this.model, this.filters); 
				
				this.trigger('rendered');

				return this;
			},
			
			'fill' : function (models)
			{
				// Hide loader
				this.$el.find('.inner-loading').toggleClass(models.length? 'inner-loading': 'inner-empty inner-loading');
				
				// Clean load
				$.each(this.entries, function(n, entry){ entry.remove()});
				this.entries = [];

				// Add models to view
				for (var n in models)
				{
					// Add link
					if(this.link) models[n].link = this.link;
					
					// Render view
					var view = new EntryView ({model: models[n], template: 'smallentry', /*type: this.type, */ parameters: {trendview: this.trending, mediaview: !this.trending}});
					this.entries.push (view);
					
					this.$container.append(view.render().el);
					
					this.listenTo(view, "toggle", this.toggle);
				}
			},
			
			'toggle' : function (el)
			{				
				// Get URL
				var link = this.sublink? this.sublink + this.model.id: this.link;
				
				Cloudwalkers.Router.Instance.navigate(link, true);
			},
			
			'fail' : function ()
			{
				Cloudwalkers.RootView.growl ("Oops", "Something went sideways, please reload the page.");
			}

		});

		return DashboardMessageList;
});