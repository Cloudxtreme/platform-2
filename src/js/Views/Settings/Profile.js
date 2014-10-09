define(
	['backbone', 'Views/Root', 'Router'],
	function (Backbone, RootView, Router)
	{
		var Profile = Backbone.View.extend({

			events : {
				'click .add-user' : 'addUser',
				'submit .edit-user-profile' : 'editUserProfile',
				'submit .edit-user-password' : 'editUserPassword',
				/*'submit .edit-user-avatar' : 'editUserAvatar',*/ 
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

			editUserProfile : function (e)
			{
				var user = Cloudwalkers.Session.getUser ();
				var firstname = this.$el.find ('[name=firstname]').val ();
				var name = this.$el.find ('[name=name]').val ();
				var mobile = this.$el.find ('[name=mobile]').val (); 
				var locale = this.$el.find ('[name=locale]').val (); 

				this.$el.find('.edit-user-profile .btn').attr('disabled', true);
				this.$el.find('.edit-user-profile').addClass('loading');
				
				user.save ({firstname: firstname, name: name, mobile: mobile, locale: locale}, {patch: true, success: function ()
				{
					RootView.growl(this.translateString("user_profile"), this.translateString("your_profile_settings_are_updated"));
					
					// Hack
					window.location.reload(); //Router.Instance.navigate("#settings/profile", true);

				}.bind(this), 
				error: function(){
					RootView.growl(this.translateString("user_profile"), this.translateString("there_was_an_error_updating_your_settings"));
					
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
						return RootView.information (this.translateString("wrong_file"), this.translateString("you_need_a_valid_image"), this.$el.find(".settings-profile .portlet-body"));

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

					RootView.growl(this.translateString("no_image"), this.translateString("select_an_image_file_first"));

					this.$el.find('.edit-user-avatar').removeClass('loading');
				
				} else {
					Cloudwalkers.Session.getUser().save ({avatar: this.base64data}, {patch: true, success: function ()
					{
					
						RootView.growl(this.translateString("user_profile"), this.translateString("you_have_a_new_profile_picture"));
					
						this.$el.find('.edit-user-avatar').removeClass('loading');

						setTimeout(function(){
		  					window.location.reload();
		  				},1000);
					
					}.bind(this)});
				}
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
							RootView.growl('User Profile', "You have a brand new avatar now.");
							$(".avatar-big").css('background-image',"url(" + base64img + ")");
						}});
					};       
					
					FR.readAsDataURL( files[0] );
				}
			},*/
			
			editUserPassword : function () {
				
				var oldpassword = this.$el.find ('[name=pass0]').val();
				var newpassword = this.$el.find ('[name=pass1]').val();

				this.$el.find('.edit-user-password').addClass('loading');
				
				if (newpassword != this.$el.find ('[name=pass2]').val())
				{
					RootView.growl('Oops', this.translateString("please_retype_your_new_password"));
					return null;
				}
				
				var user = Cloudwalkers.Session.getUser ();
				
				user.save ({oldpassword: oldpassword, newpassword: newpassword}, {patch: true, endpoint: 'password', success: function ()
				{
					RootView.growl(this.translateString("user_profile"), this.translateString("you_have_a_new_password_now"));
					
					this.$el.find('.edit-user-password').removeClass('loading');
					this.$el.find ('[name=pass0]').val('');
					this.$el.find ('[name=pass1]').val('');
					this.$el.find ('[name=pass2]').val('');
					this.$el.find ('[name=pass2]').blur(); 

				}.bind(this), 
				error: function(model, response, options)
				{
					var error = response.responseJSON.error.message;
					RootView.growl(this.translateString("user_profile"), error);

					// Hack
					window.location.reload(); //Router.Instance.navigate("#settings/profile", true);
				}.bind(this)});

			},
			
			/* on it's way to be deprecated */
			negotiateFunctionalities : function(el) {
				
				// Check collapse option
				$(el).find('.portlet-title').on('click', function(){ $(this).parents(".collapse-closed, .collapse-open").toggleClass("collapse-closed collapse-open"); });
			},
			
			translateString : function(translatedata)
			{	
				// Translate String
				return Cloudwalkers.Session.polyglot.t(translatedata);
			},

			mustacheTranslateRender : function(translatelocation)
			{
				// Translate array
				this.original  = [
					"profile_type",
					"profile_picture",
					"select",
					"upload",
					"upload_profile_picture",
					"change_password",
					"current_password",
					"new_password",
					"retype_new_password",
					"cancel",
					"your_profile",
					"first_name",
					"last_name",
					"mobile_phone",
					"language",
					"save_changes",
					"cancel",
					"no_image"
				];

				this.translated = [];

				for (var k in this.original)
				{
					this.translated[k] = this.translateString(this.original[k]);
					translatelocation["translate_" + this.original[k]] = this.translated[k];
				}
			}

		});

		return Profile;
});