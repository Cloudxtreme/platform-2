/**
* A standard widget
*/
define(
	['backbone'],
	function (Backbone)
	{
		var Widget = Backbone.View.extend({

			'title' : 'Untitled widget',
			'icon' : 'inbox',
			'color' : 'blue',
			'network' : null,
			'entries' : [],
			'events' : {
				
			},

			'tools' : [],

		    'initialize' : function ()
		    {
		        if(!this.options.color) this.options.color = this.color;
		        
		        
		        // Always add this to all your widget initializations
		        this.initializeWidget ();
		    },

		    'initializeWidget' : function ()
		    {
		        this.bind ('destroy', this.onDestroy);
		        this.bind ('add', function(){ console.log("View add triggrered")});
		    },

			'innerRender' : function (element)
			{
				element.html ('No inner content set.');
			},

			'render' : function ()
			{

				var self = this;

				if (typeof (this.options.title) != 'undefined')
					this.title = this.options.title;

				//if (typeof (this.options.color) != 'undefined')
				//	this.color = this.options.color;

				if (typeof (this.options.icon) != 'undefined' && this.options.icon)
					this.icon = this.options.icon;

				this.$el.html 
				(
					Mustache.render 
					(
						Templates.widget, 
						{ 
							'title' : this.title, 
							'color' : this.color, 
							'icon' : this.icon,
							'tools' : this.tools,
							'network' : this.network
						}
					)
				);

				// Events
				for (var i = 0; i < this.tools.length; i ++)
				{
					self.attachToolEvents (this.tools[i]);
				}

				this.$innerEl = $(this.$el.find ('.portlet-body'));
				this.innerRender (this.$innerEl);
				
				return this;
			},

			'attachToolEvents' : function (tool)
			{
				var self = this;
				this.$el.find ('.' + tool['class']).click (function (ev)
				{
					self[tool.event] (ev);
				});
			},
			
			'negotiateFunctionalities' : function() {
				
				// Check for scroller
				if(this.$el.find('.scroller').length) this.addScroll();
				
				// Check amountSign
				if(this.options.counter) this.appendCounter();
				
				// Check collapse option
				if(typeof this.options.open != "undefined")
					this.appendCollapseble(this.options.open);
			},
			
			'appendCollapseble' : function(open) {
				
				this.$el.addClass(open? 'collapse-open':'collapse-closed');

				if(this.$el.find(".tools .count").length)
						this.$el.find(".tools .count").addClass('collapse');
				else	this.$el.find(".tools").append($('<span class="collapse pull-right"></span>'));
				
				
				this.$el.find(".portlet-title.line").on("click", this.collapse.bind(this));

			},
			
			'appendCounter' : function(amount) {
				
				var count = 0;
				this.$el.find("li .number, li .count").each(function(){ count += Number($(this).text())});
				
				if(count > 999) count = "+999";
				if(count < 0) count = 0;
				
				this.$el.find(".tools").append($('<span class="count">' + count + '</span>'));
			},
			
			'addScroll' : function () {

				this.$el.find('.scroller').slimScroll({
					size: '6px',
					color: '#a1b2bd',
					position: 'right',
					height: $(this).attr("data-height"),
					alwaysVisible: ($(this).attr("data-always-visible") == "1" ? true : false),
					railVisible: ($(this).attr("data-rail-visible") == "1" ? true : false),
					disableFadeOut: true
				});
				
				
				/*$('.scroller').each(function () {
					$(this).slimScroll({
						size: '7px',
						color: '#a1b2bd',
						position: isRTL ? 'left' : 'right',
						height: $(this).attr("data-height"),
						alwaysVisible: ($(this).attr("data-always-visible") == "1" ? true : false),
						railVisible: ($(this).attr("data-rail-visible") == "1" ? true : false),
						disableFadeOut: true
					});
				});*/
			},

		    'onDestroy' : function ()
		    {
		       
				$.each(this.entries, function(i, entry)
				{
					entry.trigger ('destroy');
				});
				
		        this.$el.find ('.scroller').slimScroll({'destroy':1});
		        this.remove();
		        //this.$el.html ('DESTROYED');
		    },
			
			'collapse' : function ()
			{
				this.$el.toggleClass("collapse-closed collapse-open");
				//this.trigger ('view:collapse');
			}

		});

		return Widget;
});