Cloudwalkers.Views.Pageview = Backbone.View.extend({

	'title' : "Page",
	'className' : "container-fluid",
	'span' : 0,
	'widgets' : [],
	'widgetviews' : [],
	'events' : {
		'remove': 'destroy'
	},

	'render' : function ()
	{
		// Build Pageview
		this.$el.html (Mustache.render (Templates.pageview, {'title' : this.title}));
		
		// Widgets parent
		this.$container = this.$el.find("#widgetcontainer").eq(0);
		
		// Append widgets
		this.appendWidgets();
		
		return this;
	},
	
	'appendWidgets' : function() {
		
		for(n in this.widgets)
		{
			var widget = this.widgets[n].view(this.widgets[n].data);

			this.appendWidget(widget, this.widgets[n].size);
		}
	},
	
	'appendWidget' : function(widget, span) {
		
		if(!this.span)
		{
			this.$container.append(Templates.row);
		}
				
		this.span = (span + this.span < 12)? span + this.span: 0;
		
		this.$container.children().last().append( widget.render().el );
		
		this.widgetviews.push(widget);
		
		widget.$el.addClass("span" + span);
		widget.negotiateFunctionalities();
	},
	
	'appendhtml' : function(html)
	{
		this.$container.children().last().append(html);
	},
	
	'destroy' : function ()
	{
		$.each(this.widgetviews, function(i, view){ view.remove() });
	}
});