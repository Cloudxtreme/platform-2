define(
	['Views/Panels/Panel', 'mustache', 'Collections/Messages', 'Views/Entries/BaseEntry'],
	function (Panel, Mustache, Messages, BaseEntry)
	{
		DashboardMessageList = Panel.extend({

			entries : [], 

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

			render : function ()
			{
				this.$el.html (Mustache.render (Templates.minimessagelist, this.options));
				this.$container = this.$el.find ('.entry-container');
				this.$loadercontainer = this.$el.find ('.panel-body');
				
				// Load messages
				this.model.messages.touch(this.model, this.filters); 
				
				this.trigger('rendered');

				return this;
			},
			
			fill : function (models)
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
					var view = new BaseEntry ({model: models[n], template: 'smallentry', parameters: {trendview: this.trending, mediaview: !this.trending}});
					this.entries.push (view);
					
					this.$container.append(view.render().el);
					
					this.listenTo(view, "toggle", this.toggle);
				}
			},
			
			toggle : function (el)
			{				
				// Get URL
				var link = this.sublink? this.sublink + this.model.id: this.link;
				
				Cloudwalkers.Router.navigate(link, true);
			},
			
			fail : function ()
			{
				Cloudwalkers.RootView.growl ("Oops", "Something went sideways, please reload the page.");
			}

		});

		return DashboardMessageList;
});