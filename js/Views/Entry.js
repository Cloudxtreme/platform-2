Cloudwalkers.Views.Entry = Backbone.View.extend({
	
	'tagName' : 'tr',
	
	'initialize' : function ()
	{
		var self = this;
		this.model.on ('change', function ()
		{
			self.render ();	
		});
	},

	'render' : function ()
	{
		var data = this.options.model.attributes;

		this.$el.html (Mustache.render (Templates[this.options.template], data));

		return this;
	}

});