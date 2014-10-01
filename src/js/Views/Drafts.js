define(
	['mustache', 'Session', 'Views/Pageview', 'Views/Widgets/DraftsFilters', 'Views/Widgets/DraftsList'],
	function (Mustache, Session, Pageview, DraftsFiltersWidget, DraftsListWidget)
	{
		var Drafts = Pageview.extend({

			title : 'Drafts',
			className : "container-fluid drafts",
			
			initialize : function ()
			{				
				this.model = Session.getStream("draft"); 

				// Emergency break
				if (!this.model) return Session.home();
				
				// Listen for changes
				//this.listenTo(this.model, 'outdated', this.model.fetch);
				this.listenTo(this.model, 'sync', this.render);

				// Translation for Title
				this.translateTitle("drafts");
			},
			
			render : function()
			{
				this.$el.html (Mustache.render (Templates.pageview, { 'title' : this.title }));
				this.$container = this.$el.find("#widgetcontainer").eq(0);

				// Add filter widget
				var filter = new DraftsFiltersWidget ({model: this.model});
				this.appendWidget(filter, 4);
				
				// Add list widget
				var list = new DraftsListWidget ({model: this.model});
				this.appendWidget(list, 8);
				
				filter.list = list;
				
				return this;
			},
			translateTitle : function(translatedata)
			{	
				// Translate Title
				this.title = Session.polyglot.t(translatedata);
			}
			
		});

		return Drafts
	}
);