define(
	['backbone', 'mustache'],
	function (Backbone, Mustache)
	{
		var Profile = Backbone.View.extend({

			events : {
				'click .add-user' : 'addUser',
				'submit #edit-user-profile' : 'editUserProfile',
				'submit #edit-user-password' : 'editUserPassword',
				'click #add-file' : 'addfile',
				'change input[type=file]' : 'listentofile',
				'click #upload-file' : 'uploadfile',

				'change select' : 'enablereset',
				'keydown input' : 'enablereset',
				'click [type=reset]' : 'disablereset'
			},

			'class' : 'section',
			collections : [],

			render : function ()
			{
				var user = Cloudwalkers.Session.getUser ();
				
				var self = this;
				var data = {
					user: { firstname: user.get('firstname'), name: user.get('name'), mobile: user.get('mobile'), avatar: user.get('avatar'), role: user.getRole ()},
					langs: Cloudwalkers.langs
				};

				// Apply role permissions to template data
				Cloudwalkers.Session.censuretemplate(data);
				
				this.$el.html (Mustache.render (Templates.profile, data));
				
				this.$el.find(".collapse-closed, .collapse-open").each( function(){ self.negotiateFunctionalities(this) });
				
				// Select current lang
				this.$el.find("option[value=" + user.get('locale') + "]").attr("selected", true);
				
				return this;
			},

			editUserProfile : function (e)
			{
				var user = Cloudwalkers.Session.getUser ();
				var firstname = this.$el.find ('[name=firstname]').val ();
				var name = this.$el.find ('[name=name]').val ();
				var mobile = this.$el.find ('[name=mobile]').val (); 
				var locale = this.$el.find ('[name=locale]').val (); 

				this.$el.find('#edit-user-profile .btn').attr('disabled', true);
				this.$el.find('#edit-user-profile').addClass('loading');
				
				user.save ({firstname: firstname, name: name, mobile: mobile, locale: locale}, {patch: true, success: function ()
				{
					Cloudwalkers.RootView.growl(trans("User Profile"), trans("Your Profile Settings are updated"));
					
					// Hack
					window.location.reload();

				}.bind(this), 
				error: function(){
					Cloudwalkers.RootView.growl(trans("User Profile"), trans("There was an error updating your settings."));
					
				}.bind(this)});
			},

			enablereset : function()	{ this.$el.find('[type=reset]').attr('disabled', false);	},

			disablereset : function(e)
			{ 
				$(e.currentTarget).closest('form').get(0).reset();

				this.$el.find('[type=reset]').attr('disabled', true);
			},
			
			/**
			 *	Profile: avatar
			**/

			addfile : function (e) { $(".settings-profile input[type=file]").click(); },
			
			listentofile : function (e)
			{	
				var files = e.target.files;
				
				for (var n in files)
				{
					var f = files[n]

					// Check type
					if (!f.type.match('image.*')) 
						return Cloudwalkers.RootView.information (trans("Wrong file"), trans("You need a valid image"), this.$el.find(".settings-profile .panel-body"));

					var reader = new FileReader();
					
					reader.onload = this.fileparser(f,e);
					
					reader.readAsDataURL(f);
				}
			},

			fileparser : function(file, element)
			{
				return function(element)
				{
					this.addimage(element.target.result);

				}.bind(this);
			},
			
			addimage : function(base64data){
				
				this.base64data = base64data;
				this.$el.find("div.avatar-big").css('background-image', "url(" + base64data + ")");
			},
			
			uploadfile : function(){
				
				this.$el.find('.edit-user-avatar').addClass('loading');

				if (!this.base64data){

					Cloudwalkers.RootView.growl(trans("No Image"), trans("Select an image file first"));

					this.$el.find('.edit-user-avatar').removeClass('loading');
				
				} else {
					Cloudwalkers.Session.getUser().save ({avatar: this.base64data}, {patch: true, success: function ()
					{
					
						Cloudwalkers.RootView.growl(trans("User Profile"), trans("You have a new profile picture"));
					
						this.$el.find('.edit-user-avatar').removeClass('loading');

						setTimeout(function(){
		  					window.location.reload();
		  				},1000);
					
					}.bind(this)});
				}
			},
			
			editUserPassword : function () {
				
				var oldpassword = this.$el.find ('[name=pass0]').val();
				var newpassword = this.$el.find ('[name=pass1]').val();

				this.$el.find('.edit-user-password').addClass('loading');
				
				if (newpassword != this.$el.find ('[name=pass2]').val())
				{
					Cloudwalkers.RootView.growl('Oops', trans("Please re-type your new password"));
					return null;
				}
				
				var user = Cloudwalkers.Session.getUser ();
				
				user.save ({oldpassword: oldpassword, newpassword: newpassword}, {patch: true, endpoint: 'password', success: function ()
				{
					Cloudwalkers.RootView.growl(trans("User Profile"), trans("You have a new password now"));
					
					this.$el.find('.edit-user-password').removeClass('loading');
					this.$el.find ('[name=pass0]').val('');
					this.$el.find ('[name=pass1]').val('');
					this.$el.find ('[name=pass2]').val('');
					this.$el.find ('[name=pass2]').blur(); 

				}.bind(this), 
				error: function(model, response, options)
				{
					var error = response.responseJSON.error.message;
					Cloudwalkers.RootView.growl(trans("User Profile"), error);

					// Hack
					window.location.reload(); //Cloudwalkers.Router.navigate("#settings/profile", true);
				}.bind(this)});

			},
			
			/* on it's way to be deprecated */
			negotiateFunctionalities : function(el) {
				
				// Check collapse option
				$(el).find('.panel-title').on('click', function(){ $(this).parents(".collapse-closed, .collapse-open").toggleClass("collapse-closed collapse-open"); });
			}

		});

		return Profile;
});