/**
* A standard widget
*/
Cloudwalkers.Widget = Backbone.View.extend({

	'title' : '...',
	'color' : 'blue',
	'icon' : 'cloud',
	
	'events' : {
		'click .portlet-title.line' : 'collapse'
	},

    'initialize' : function ()
    {
		//this.listenTo(this.model, "change", this.render);
		this.bind ('destroy', this.destroy);
    },

	'innerRender' : function ()
	{
		this.$el.addClass('inner-empty');
	},

	'render' : function ()
	{
		var self = this;
		var data = {
			title : this.options.title | this.title,
			color: this.options.color | this.color,
			icon : this.options.icon | this.icon
		}

		this.$el.html (Mustache.render (Templates.widget, data));
		
		if(	this.options.height == 'auto')
			this.$el.find('.scroller').remove();
		
		if( typeof this.options.counter != 'undefined')
			this.appendCounter ();
			
		if( this.options.collapsible)
			this.appendCollapsible ();

		this.innerRender ();
		this.addScroll ();
		
		return this;
	},
	
	'appendCounter' : function(amount) {
		
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
	},
	
	'appendCollapsible' : function(open) {

		if(this.$el.find(".tools .count").length)
				this.$el.find(".tools .count").addClass('collapse');
		else	this.$el.find(".tools").append($('<span class="collapse pull-right"></span>'));
		
		this.$el.addClass(open? 'collapse-open':'collapse-closed');
	},
	
	'collapse' : function ()
	{
		this.$el.toggleClass("collapse-closed collapse-open");
	},

    'destroy' : function ()
    {   
        this.$el.find ('.scroller').slimScroll({'destroy':1});
    }

});