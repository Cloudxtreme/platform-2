define(
	['Views/Pages/Pageview', 'mustache',  'Views/Panels/Filters/BaseFilters', 'Views/Panels/EntryLists/BaseList'],
	function (Pageview, Mustache, BaseFiltersPanel, BaseListPanel)
	{
		var Drafts = Pageview.extend({

			/*title : 'Drafts',*/
			className : "container-fluid",
			id: 'drafts',
			
			initialize : function ()
			{
				// Select draft stream (should be integrated)
				//var channel = Cloudwalkers.Session.getChannel("internal");
				
				this.model = Cloudwalkers.Session.getStream("draft"); //channel.getStream("draft");

				// Emergency break
				if (!this.model) return Cloudwalkers.Session.home();
				
				// Listen for changes
				this.listenTo(this.model, 'sync', this.render);
			},
			
			render : function()
			{
				this.$el.html (Mustache.render (Templates.pageview, { 'title' : this.title }));
				this.$container = this.$el.find("#widgetcontainer").eq(0);

				// Add filter widget
				var filter = new BaseFiltersPanel ({model: this.model, template: "listfilters", title: "Draft messages"});
				this.appendWidget(filter, 4);
				
				// Add list widget
				var list = new BaseListPanel ({model: this.model, title: "Draft messages"});
				this.appendWidget(list, 8);
				
				filter.list = list;

				// Expand view to fullscreen height
				this.expandheight();
				
				return this;
			}
			
		});

		return Drafts
	}
);