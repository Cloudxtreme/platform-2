/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.Widget = Backbone.View.extend({

	'title' : 'Untitled widget',
	'icon' : 'inbox',
	'color' : 'blue',
	'network' : null,

	'tools' : [],

	'innerRender' : function (element)
	{
		element.html ('No inner content set.');
	},

	'render' : function ()
	{
		
		
		var self = this;

		if (typeof (this.options.title) != 'undefined')
			this.title = this.options.title;

		if (typeof (this.options.color) != 'undefined')
			this.color = this.options.color;

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
		this.addScroll();
		
		// Check amountSign
		if(this.options.channel && typeof this.options.channel.unread != "undefined")
			this.appendAmountSign(this.options.channel.unread);
		
		// Check collapse option
		if(typeof this.options.open != "undefined")
			this.appendCollapseble(this.options.open);
	},
	
	'appendCollapseble' : function(open) {
		
		this.$el.addClass(open? 'collapse-open':'collapse-closed');

		if(this.$el.find(".tools .count").length)
				this.$el.find(".tools .count").addClass('collapse');
		else	this.$el.find(".tools").append($('<span class="collapse pull-right"></span>'));

	},
	
	'appendAmountSign' : function(amount) {
		
		this.$el.find(".tools").append($('<span class="count">' + amount + '</span>'));
		
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
	
	'handleTools' : function(){
		
		jQuery('body').on('click', '.portlet .tools .collapse, .portlet .tools .expand', function (e) {
            e.preventDefault();
                var el = jQuery(this).closest(".portlet").children(".portlet-body");
                if (jQuery(this).hasClass("collapse")) {
                    jQuery(this).removeClass("collapse").addClass("expand");
                    el.slideUp(200);
                } else {
                    jQuery(this).removeClass("expand").addClass("collapse");
                    el.slideDown(200);
                }
        });
        
        jQuery('body').on('click', '.portlet .portlet-title.collapse-portlet, .portlet .portlet-title.expand-portlet', function (e) {
            e.preventDefault();
                var el = jQuery(this).closest(".portlet").children(".portlet-body");
                if (jQuery(this).hasClass("collapse-portlet")) {
                    jQuery(this).removeClass("collapse-portlet").addClass("expand-portlet");
                    el.slideUp(200);
                } else {
                    jQuery(this).removeClass("expand-portlet").addClass("collapse-portlet");
                    el.slideDown(200);
                }
        });
	},
	
	'collapse' : function ()
	{
		this.$el.toggleClass("collapse-closed collapse-open");
		//this.trigger ('view:collapse');
	}

});