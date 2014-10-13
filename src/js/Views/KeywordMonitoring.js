define(
	['Views/Pageview', 'mustache',  'Views/Widgets/MonitorFilters', 'Views/Widgets/MonitorList'],
	function (Pageview, Mustache, MonitorFiltersWidget, MonitorListWidget)
	{
		var KeywordMonitoring = Pageview.extend({

			title : 'Keyword Monitoring',
			className : "container-fluid monitoring",
			
			initialize : function ()
			{
				// Emergency break
				if (!this.options.category) return Cloudwalkers.Session.home();
				
				// Listen for changes
				//this.listenTo(Cloudwalkers.Session.getChannels(), 'sync', this.render);
				//this.listenTo(Cloudwalkers.Session.getStreams(), 'sync', this.render);
				
				this.category = this.options.category;

				// Translation for Title
				this.translateTitle("keyword_monitoring");
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
			},

			translateTitle : function(translatedata)
			{	
				// Translate Title
				this.title = Cloudwalkers.Session.translate(translatedata);
			}
			
		});
		
		return KeywordMonitoring;
	}
);