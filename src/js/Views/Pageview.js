define(
	['backbone'],
	function (Backbone)
	{
		var Pageview = Backbone.View.extend({

			title : "Page",
			className : "container-fluid",
			span : 0,
			widgets : [],
			widgetviews : [],
			events : {
				'rendered' : 'bubblerender',
				'remove': 'destroy'
			},

			render : function ()
			{
				// Build Pageview
				this.$el.html (Mustache.render (Templates.pageview, {'title' : this.title}));
				
				// Widgets parent
				this.$container = this.$el.find("#widgetcontainer").eq(0);
				
				// Append widgets
				this.appendWidgets();
				
				return this;
			},
			
			appendWidgets : function() {
				
				for(n in this.widgets)
				{
					var widget = this.widgets[n].view(this.widgets[n].data);

					this.appendWidget(widget, this.widgets[n].size);
				}
			},
			
			appendWidget : function(widget, span, padding, offset) {
				
				if(!this.span || span == 0)
				{
					this.$container.append(Templates.row);
				}
						
				this.span = (span + this.span < 12)? span + this.span : 0;
				
				if(widget){
					this.$container.children().last().append( widget.render().el );
				
					this.widgetviews.push(widget);
				
					widget.$el.addClass("span" + span);

					if(offset)
						widget.$el.addClass("offset" + offset);
					
					if (widget.negotiateFunctionalities)
						widget.negotiateFunctionalities();

					this.listenTo(widget, 'view:update', this.updatewidget.bind(this, widget));
				}
			},
			
			appendhtml : function(html)
			{
				this.$container.children().last().append(html);
			},
			
			cleanviews : function ()
			{
				if(this.widgetviews.length)
				{
					this.destroy();
					this.widgetviews = [];
				}
			},
			
			bubblerender : function ()
			{	
				// Initial trigger was on $el
				this.trigger("rendered");
				
				// Trigger all Widgets
				$.each(this.widgetviews, function(i, view){ view.trigger("rendered"); });
			},

			updatewidget : function(widget)
			{
				widget.render();	
				
				if (widget.negotiateFunctionalities)
					widget.negotiateFunctionalities();
			},	
			
			destroy : function ()
			{	
				$.each(this.widgetviews, function(i, view){ view.remove() });
			}
		});

		return Pageview;
	}
);