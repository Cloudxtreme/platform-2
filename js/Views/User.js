Cloudwalkers.Views.User = Backbone.View.extend({
	
	'tagName' : 'li',
	'template': 'user',
	
	'events' : 
	{
		'click' : 'select'
	},
	
	'initialize' : function (options)
	{
		if(options) $.extend(this, options);
		
		this.listenTo(this.model, 'change', this.render);
	},

	'render' : function ()
	{
		this.$el.html (Mustache.render (Templates[this.template], this.model.filterData(this.type)));
				
		return this;
	},
	
	'select' : function() { this.trigger("select", this); }

});