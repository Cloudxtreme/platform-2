define(
	['backbone', 'mustache'],
	function (Backbone, Mustache)
	{
		var Pageview = Backbone.View.extend({

			/*title : "Page",*/
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
				
				for (var n in this.widgets)
				{
					var widget = this.widgets[n].view(this.widgets[n].data);

					this.appendWidget(widget, this.widgets[n].size);
				}
			},
			
			appendWidget : function(widget, span, padding, offset) 
			{
				if(!widget)	
					return;

				if(this.span === 0 || span === 0)	//Add new row
					this.$container.append(Templates.row);	
				
				this.$container.children().last().append( widget.render().el );				
				this.widgetviews.push(widget);
				
				// Responsive array
				if(_.isArray(span)){

					widget.$el.addClass("col-xs-"+ span[0] +" col-sm-"+ span[1] +" col-md-"+ span[2] +" col-lg-"+ span[3]);					
					span = span[this.getspan()];
				}

				else	
					widget.$el.addClass("col-md-" + span);

				if(offset)
					widget.$el.addClass("col-md-offset-" + offset);

				// Set span memory
				//this.span = (span + this.span < 12)? span + this.span : 0;
				
				this.span = span + this.span;					
					
				if (widget.negotiateFunctionalities)
					widget.negotiateFunctionalities();

				this.listenTo(widget, 'view:update', this.updatewidget.bind(this, widget));

			},

			// resets the collumns for responsiveness
			resetwrapping : function () {

				this.$container.children().last().append( '<div class="clearfix"></div>');	
			},	

			// Return spans array index corresponding to the current resolution
			getspan : function() {

				var width = $( window ).width();
				var span = 2;		// default

				if(width >= 1200)	 	span = 3;
				else if(width >= 992)	span = 2;
				else if(width >= 768)	span = 1;
				else					span = 0;

				return span;
			},
			
			appendhtml : function(html)
			{
				this.$container.children().last().append(html);
			},

			expandheight : function(){

				var contentheight = $("#inner-content").height() -10 + "px";

				this.$container.css('height', contentheight);
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