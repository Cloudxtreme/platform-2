Cloudwalkers.Views.Settings.Profile = Backbone.View.extend({

	'events' : {
		'click .add-user' : 'addUser',
		'submit .edit-user-profile' : 'editUserProfile',
		'submit .edit-user-password' : 'editUserPassword',
		/*'submit .edit-user-avatar' : 'editUserAvatar',*/ 
		'click #add-file' : 'addfile',
		'change input[type=file]' : 'listentofile',
		'click #upload-file' : 'uploadfile'
	},

	'class' : 'section',
	'collections' : [],

	'render' : function ()
	{
		
		var user = Cloudwalkers.Session.getUser ();
		
		var self = this;
		var data = {
			user: { firstname: user.get('firstname'), name: user.get('name'), avatar: user.get('avatar'), role: user.getRole ()},
			langs: Cloudwalkers.Session.langs
		};
		
		// Mustache Translate Render
		this.mustacheTranslateRender(data);

		// Apply role permissions to template data
		Cloudwalkers.Session.censuretemplate(data);
		
		this.$el.html (Mustache.render (Templates.settings.profile, data));
		
		this.$el.find(".collapse-closed, .collapse-open").each( function(){ self.negotiateFunctionalities(this) });
		
		// Select current lang
		this.$el.find("option[value=" + user.get('locale') + "]").attr("selected", true);
		
		return this;
	},

	'editUserProfile' : function (e)
	{
		var user = Cloudwalkers.Session.getUser ();
		var firstname = this.$el.find ('[name=firstname]').val ();
		var name = this.$el.find ('[name=name]').val ();
		var mobile = this.$el.find ('[name=mobile]').val (); 
		var locale = this.$el.find ('[name=locale]').val (); 
		
		user.save ({firstname: firstname, name: name, mobile: mobile, locale: locale}, {patch: true, success: function ()
		{
			Cloudwalkers.RootView.growl('User Profile', "Your profile settings are updated");
			
			// Hack
			window.location.reload(); //Cloudwalkers.Router.Instance.navigate("#settings/profile", true);
		}});
	},
	
	/**
	 *	Profile: avatar
	**/

	'addfile' : function (e) { $(".settings-profile input[type=file]").click(); },
	
	'listentofile' : function (e)
	{	
		var self = this;
		var files = e.target.files;
		
		for (var i = 0, f; f = files[i]; i++)
		{
			// Check type
			if (!f.type.match('image.*')) 
				return Cloudwalkers.RootView.information ("Wrong file", "You need a valid image.", this.$el.find(".settings-profile .portlet-body"));

			var reader = new FileReader();
			
			reader.onload = (function(file)
			{	return function(e){	self.addimage(e.target.result)}})(f);
			
			reader.readAsDataURL(f);
		}
	},
	
	'addimage' : function(base64data){
		
		this.base64data = base64data;
		this.$el.find("div.avatar-big").css('background-image', "url(" + base64data + ")");
	},
	
	'uploadfile' : function(){
		
		if (!this.base64data)
			Cloudwalkers.RootView.information ("No image", "Select an image file first.", this.$el.find(".settings-profile .portlet-body"));

		else Cloudwalkers.Session.getUser().save ({avatar: this.base64data}, {patch: true, success: function ()
			{
				Cloudwalkers.RootView.growl('User Profile', "You have a new profile picture.");
			}});
	},

	
	
	/*'editUserAvatar' : function () {
		
		var files = $("form.edit-user-avatar input[type=file]").get(0).files;
		
		if (files[0])
		{
			var FR = new FileReader();
			FR.onload = function(e) {
				
				var user = Cloudwalkers.Session.getUser ();
				var base64img = e.target.result;
				
				user.save ({avatarBase64: base64img}, {patch: true, success: function ()
				{
					Cloudwalkers.RootView.growl('User Profile', "You have a brand new avatar now.");
					$(".avatar-big").css('background-image',"url(" + base64img + ")");
				}});
			};       
			
			FR.readAsDataURL( files[0] );
		}
	},*/
	
	'editUserPassword' : function () {
		
		var oldpassword = this.$el.find ('[name=pass0]').val();
		var newpassword = this.$el.find ('[name=pass1]').val();
		
		if (newpassword != this.$el.find ('[name=pass2]').val())
		{
			Cloudwalkers.RootView.growl('Oops', "Please re-type your new password.");
			return null;
		}
		
		var user = Cloudwalkers.Session.getUser ();
		
		user.save ({oldpassword: oldpassword, newpassword: newpassword}, {patch: true, endpoint: 'password', success: function ()
		{
			Cloudwalkers.RootView.growl('User Profile', "You have a new password now.");
		
		}, error: function(model, response, options)
		{	var response = response.responseJSON.error.message;
			Cloudwalkers.RootView.growl('Oops', response);
		}});
	},
	
	/* on it's way to be deprecated */
	'negotiateFunctionalities' : function(el) {
		
		// Check collapse option
		$(el).find('.portlet-title').on('click', function(){ $(this).parents(".collapse-closed, .collapse-open").toggleClass("collapse-closed collapse-open"); });
	},
	
	'translateString' : function(translatedata)
	{	
		// Translate String
		return Cloudwalkers.Session.polyglot.t(translatedata);
	},

	'mustacheTranslateRender' : function(translatelocation)
	{
		// Translate array
		this.original  = [
			"profile_type"
		];

		this.translated = [];

		for(k in this.original)
		{
			this.translated[k] = this.translateString(this.original[k]);
			translatelocation["translate_" + this.original[k]] = this.translated[k];
		}
	}

});