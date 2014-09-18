/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.Title = Backbone.View.extend({

	'size' : 'full',

	'render' : function ()
	{
		this.$el.html ('<h3 style="margin-bottom: 25px;">' + this.options.title + '</h3>');
		return this;
	},
	
	'negotiateFunctionalities' : function() {}
	

});