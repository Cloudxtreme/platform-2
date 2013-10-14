Cloudwalkers.Views.Settings.Profile = Backbone.View.extend({

	'events' : {
		'click .add-user' : 'addUser',
		'submit .edit-user-profile' : 'editUserProfile',
		'click .invite-user' : 'addUser'
	},

	'class' : 'section',
	'collections' : [],

	'render' : function ()
	{
		var self = this;

		var data = {};
		self.$el.html (Mustache.render (Templates.settings.profile, data));

		return this;
	},

	'editUserProfile' : function (e)
	{
		var user = Cloudwalkers.Session.getUser ();
		var name = this.$el.find ('[name=name]').val ();

		user.set ('name', name);
		user.save ({}, { 'success' : function () {  }});
	}
});