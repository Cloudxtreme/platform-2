define(
	['Views/Pages/Pageview', 'mustache',  'Views/Panels/Filters/BaseFilters', 'Views/Panels/EntryLists/BaseList'],
	function (Pageview, Mustache, BaseFiltersPanel, BaseListPanel)
	{
		var Coworkers = Pageview.extend({

			/*title : 'Co-workers wall',*/
			className : "container-fluid",
			id: 'coworkers',
			
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
				var filter = new BaseFiltersPanel ({model: this.model, template: "listfilters", title: "Co-workers messages"});
				this.appendWidget(filter, 4);
				
				// Add list widget
				var list = new BaseListPanel ({model: this.model, title: "Co-workers messages"});
				this.appendWidget(list, 8);
				
				filter.list = list;

				// Expand view to fullscreen height
				this.expandheight();
				
				return this;
			}
		});

		return Coworkers;
	}
);