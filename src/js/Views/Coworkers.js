define(
	['Views/Pageview', 'mustache',  'Views/Widgets/CoworkersFilters', 'Views/Widgets/CoworkersList'],
	function (Pageview, Mustache, CoworkersFiltersWidget, CoworkersListWidget)
	{
		var Coworkers = Pageview.extend({

			title : 'Co-workers wall',
			className : "container-fluid coworkers",
			
			initialize : function ()
			{			
				this.model = Cloudwalkers.Session.getStream("coworkers");

				// Emergency break
				if (!this.model) return Cloudwalkers.Session.home();
				
				// Listen for changes
				this.listenTo(this.model, 'outdated', this.model.fetch);
				this.listenTo(this.model, 'sync', this.render);
			},
			
			render : function()
			{
				this.$el.html (Mustache.render (Templates.pageview, { title : this.title }));
				this.$container = this.$el.find("#widgetcontainer").eq(0);

				// Add filter widget
				var filter = new CoworkersFiltersWidget ({model: this.model});
				this.appendWidget(filter, 4);
				
				// Add list widget
				var list = new CoworkersListWidget ({model: this.model});
				this.appendWidget(list, 8);
				
				filter.list = list;
				
				return this;
			}
		});

		return Coworkers;
	}
);