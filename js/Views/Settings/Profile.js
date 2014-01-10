Cloudwalkers.Views.Settings.Profile = Backbone.View.extend({

	'events' : {
		'click .add-user' : 'addUser',
		'submit .edit-user-profile' : 'editUserProfile',
		'submit .edit-user-password' : 'editUserPassword',
		'submit .edit-user-avatar' : 'editUserAvatar',
		'click .invite-user' : 'addUser'
	},

	'class' : 'section',
	'collections' : [],

	'render' : function ()
	{
		
		var user = Cloudwalkers.Session.getUser ();
		
		
		var self = this;
		var data = {
			user: { firstname: user.get('firstname'), name: user.get('name'), avatar: user.get('avatar')}
		};
		this.$el.html (Mustache.render (Templates.settings.profile, data));
		
		this.$el.find(".collapse-closed, .collapse-open").each( function(){ self.negotiateFunctionalities(this) });
		
		return this;
	},

	'editUserProfile' : function (e)
	{
		var user = Cloudwalkers.Session.getUser ();
		var firstname = this.$el.find ('[name=firstname]').val ();
		var name = this.$el.find ('[name=name]').val ();

		user.set ('firstname', firstname);
		user.set ('name', name);
		user.saveProfile ( function () { Cloudwalkers.RootView.growl('User Profile', "Your profile settings are updated"); });
	},
	
	'editUserAvatar' : function () {
		
		var files = $("form.edit-user-avatar input[type=file]").get(0).files;
		
		if (files[0])
		{
			var FR = new FileReader();
			FR.onload = function(e) {
				
				var user = Cloudwalkers.Session.getUser ();
				var base64img = e.target.result;
				
				user.set ('avatarBase64', base64img );
				user.saveProfile ( function () {
					
					Cloudwalkers.RootView.growl('User Profile', "You have a brand new avatar now.");
					$(".avatar-big").css('background-image',"url(" + base64img + ")");
					
				});
			};       
			
			FR.readAsDataURL( files[0] );
		}
	},
	
	'editUserPassword' : function () {
		
		if(this.$el.find ('[name=pass1]').val() != this.$el.find ('[name=pass2]').val())
		{
			Cloudwalkers.RootView.growl('Oops', "Please re-type your new password.");
			return null;
		}
		
		var user = Cloudwalkers.Session.getUser ();
		var firstname = this.$el.find ('[name=firstname]').val ();
		var name = this.$el.find ('[name=name]').val ();

		user.savePassword (
			this.$el.find ('[name=pass0]').val(),
			this.$el.find ('[name=pass1]').val(),
			function (data) {
				
				if(data.error)	Cloudwalkers.RootView.growl('Oops', "That's not correct.");
				else			Cloudwalkers.RootView.growl('User Profile', "You have a new password now.");
			}
		);
	},
	
	/* on it's way to be deprecated */
	'negotiateFunctionalities' : function(el) {
		
		// Check collapse option
		$(el).find('.portlet-title').on('click', function(){ $(this).parents(".collapse-closed, .collapse-open").toggleClass("collapse-closed collapse-open"); });
	}

});