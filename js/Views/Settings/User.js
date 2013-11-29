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
		data.user.role = this.model.getRole ();
		
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
		var self = this;
		var tr = $(e.currentTarget).parents("tr");
		
		Cloudwalkers.RootView.confirm ("You are about to remove " + this.model.get('firstname') + ". Sure?", function(){
			
			tr.remove();
			
			var url = 'account/' + Cloudwalkers.Session.getAccount().get('id') + '/users/' + self.model.get('id');
			Cloudwalkers.Net.remove (url, {}, function(){
			
				Cloudwalkers.RootView.growl('Manage Users', "That's an ex-user.");
			});
		});
	}
	
});