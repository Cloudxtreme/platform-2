Cloudwalkers.Views.Settings.User = Backbone.View.extend({

	'tagName' : 'tr',

	'events' : 
	{
		'click [data-edit-user-id]' : 'openDetails',
		'click [data-delete-user-id]' : 'deleteUser'
	},

	'render' : function ()
	{
		var self = this;
		var data = {};

		data.user = this.model.attributes;
		data.user.functie = this.model.getFunction ();
		
		self.$el.html (Mustache.render (Templates.settings.user, data));

		return this;
	},

	'openDetails' : function ()
	{
		var view = new Cloudwalkers.Views.Settings.UserDetails ({ 'model' : this.model });
		$(".manage-users-edit-widget .portlet-body").html(view.render().el);
	},
	
	'deleteUser' : function (e)
	{
		$(e.currentTarget).parents("tr").remove();
		
		var url = 'account/' + Cloudwalkers.Session.getAccount().get('id') + '/users/' + this.model.get('id');
		Cloudwalkers.Net.delete (url, {}, data, function(){
			
			Cloudwalkers.RootView.growl('Manage Users', "That's an ex-user.");
		});
	}
	
});