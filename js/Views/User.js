Cloudwalkers.Views.User = Backbone.View.extend({

	'tagName' : 'tr',

	'events' : 
	{
		'click .icon-edit-a' : 'openDetails'
	},

	'render' : function ()
	{
		var self = this;
		var data = {};

		data.user = this.model.attributes;
		data.user.functie = this.model.getFunction ();
		
		self.$el.html (Mustache.render (Templates.user, data));

		return this;
	},

	'openDetails' : function ()
	{
		var view = new Cloudwalkers.Views.UserDetails ({ 'model' : this.model });
		Cloudwalkers.RootView.popup (view);
	}
	
});