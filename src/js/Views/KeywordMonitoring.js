define(
	['Views/Pageview', 'mustache',  'Views/Widgets/MonitorFilters', 'Views/Widgets/MonitorList'],
	function (Pageview, Mustache, MonitorFiltersWidget, MonitorListWidget)
	{
		var KeywordMonitoring = Pageview.extend({

			title : 'Keyword monitoring',
			className : "container-fluid monitoring",

			options : {},
			
			initialize : function (options)
			{
				if(options)	$.extend(this.options, options)
				
				// Emergency break
				if (!this.options.category) return Cloudwalkers.Session.home();
				
				// Listen for changes
				//this.listenTo(Cloudwalkers.Session.getChannels(), 'sync', this.render);
				//this.listenTo(Cloudwalkers.Session.getStreams(), 'sync', this.render);
				
				this.category = this.options.category;
			},
			
			render : function()
			{
				this.$el.html (Mustache.render (Templates.pageview, { 'title' : this.title }));
				this.$container = this.$el.find("#widgetcontainer").eq(0);

				// Add filter widget
				var filter = new MonitorFiltersWidget ({category: this.category });
				this.appendWidget(filter, 4);

				/* New UI
				this.appendWidget(filter, 12); */
				
				// Add list widget
				var list = new MonitorListWidget ({category: this.category, reset: true});
				
				this.appendWidget(list, 8);

				/* New UI
				this.appendWidget(list, 12); */
				
				filter.list = list;
				
				return this;
			}
			
		});
		
		return KeywordMonitoring;
	}
);