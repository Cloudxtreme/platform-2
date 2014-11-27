define(
	['Views/Pages/Pageview', 'mustache', 'Views/Panels/Filters/ScheduledFilters', 'Views/Panels/EntryLists/ScheduledList'],
	function (Pageview, Mustache, ScheduledFiltersWidget, ScheduledListWidget)
	{
		var Scheduled = Pageview.extend({

			title : 'Schedule',
			className : "container-fluid scheduled",

			options : {},
			
			initialize : function (options)
			{				
				$.extend(this.options, options);
				
				this.model = Cloudwalkers.Session.getStream("scheduled");

				// Emergency break
				if (!this.model) return Cloudwalkers.Session.home();

				var settings = Cloudwalkers.Session.viewsettings('scheduled');
				
				if (settings.streams)
					this.options.filters = {streams : settings.streams};
				
				// Listen for changes
				this.listenTo(this.model, 'sync', this.render);
			},
			
			render : function()
			{
				this.$el.html (Mustache.render (Templates.pageview, { 'title' : this.title }));
				this.$container = this.$el.find("#widgetcontainer").eq(0);

				// Add filter widget
				var filter = new ScheduledFiltersWidget ({model: this.model, filters: this.options.filters});
				this.appendWidget(filter, 4);
				
				// Add list widget
				var list = new ScheduledListWidget ({model: this.model, filters: this.options.filters});
				this.appendWidget(list, 8);
				
				filter.list = list;
				this.list = list;

				// Add refresh button
				this.$el.find('.page-title').eq(0).append('<span class="listrefresh loading"></span></h3>');
				
				return this;
			},

			refreshlist : function()
			{
				this.list.refreshlist();
			},
			
		});

		return Scheduled;
	}
);