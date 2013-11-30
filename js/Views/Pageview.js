Cloudwalkers.Views.Pageview = Backbone.View.extend({

	'title' : "Page",
	'span' : 0,
	'widgets' : [],
	
	'initialize' : function ()
	{
		/*
		proper listen attachmant: 
		this.listenTo(this.model, "change", this.render);
		
		to keep in mind:
		this.on ('destroy', function ()
		{
			for (var i = 0; i < this.widgets.length; i ++)
			{
				self.widgets[i].widget.trigger ('destroy');
			}
		});
		*/
	},

	'render' : function ()
	{
		// Build Pageview
		this.$el.addClass ("container-fluid").html (Mustache.render (Templates.pageview, {'title' : this.title}));
		
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
		
		widget.$el.addClass("span" + span);
		widget.negotiateFunctionalities();
	}

	
});