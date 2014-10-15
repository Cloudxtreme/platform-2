define(
	['Views/BaseView', 'mustache', 'Collections/Users', 'Models/User','Views/Settings/User'],
	function (BaseView, Mustache, Users, User,UserView)
	{
		var UsersView = BaseView.extend({

			events : {
				'submit .users-invite' : 'addUser',
				'click .invite-link' : 'scrolldown'
			},

			class : 'section',
			collections : [],
			
			initialize : function ()
			{
				this.collection = new Users();
				
				//  en to model
				this.listenToOnce(this.collection, 'sync', this.fill);
				this.listenToOnce(this.collection, 'request', this.showloading);
				this.listenToOnce(this.collection, 'sync', this.hideloading);
				
				this.loadListeners(this.collection, ['request', 'sync'], true);
			},

			render : function ()
			{
				var account = Cloudwalkers.Session.getAccount();
				var data = {};

				//Mustache Translate Render
				this.mustacheTranslateRender(data);

				// Apply role permissions to template data
				Cloudwalkers.Session.censuretemplate(data);
				
				this.$el.html (Mustache.render (Templates.users, data));
				
				// Load users
				this.collection.parameters = {records: 100}
				this.collection.parentmodel = account;
				this.collection.fetch();
				
				this.$container = this.$el.find('.toload');
				
				return this;
			},
			
			
			fill : function (collection)
			{	
				var models = collection.models;				
				var $container = this.$el.find(".user-container").eq(-1);

				// Check account limitations
				Cloudwalkers.Session.getAccount().monitorlimit('users', models.length, $(".invite-user"));
				
				for (var n in models)
				{	
					var view = new UserView ({ 'model' : models[n], view: this });
					$container.append(view.render().el);
				}
			},

			/*addUserContainer : function (title, collection)
			{	
				var user = Cloudwalkers.Session.getUser ();

				var self = this;

				var data = {};
				data.title = title;
				data.user = user.attributes;

				var html = $(Mustache.render (Templates.settings.users, data));

				collection.on ('reset', function ()
				{
					html.find ('.user-container').html ('');
				});

				collection.on ('reset:all', function ()
				{
					for (var i = 0; i < self.collections.length; i ++)
					{
						self.collections[i].reset ();
						self.collections[i].fetch ();
					}
				});

				collection.on ('add', function (model)
				{
					var view = new SettingsView.User ({ 'model' : model });
					html.find ('.user-container').append (view.render ().el);
				});

				html.find ('.loading').show ();

				collection.fetch ({
					'success' : function ()
					{
						html.find ('.loading').hide ();
					}
				});

				this.$el.append (html);

			},*/

			/*
			 *	Send invitation
			 */
			addUser : function ()
			{
				
				var data = {email: $('input[name=invite-email]').val()}
				var url = Cloudwalkers.Session.api + '/account/' + Cloudwalkers.Session.getAccount().get('id') + '/users';

				// Make the loading effect
				this.$el.find('.users-invite').addClass('loading');
				this.$el.find('.users-invite .btn').attr('disabled', true);
				
				var user = new User(data);
				
				user.once('sync', function(response)
				{
					Cloudwalkers.RootView.growl(this.translateString("user_management"), this.translateString("invitation_on_its_way"));

					// remove the loading effect
					this.$el.find('input[name=invite-email]').val('');
					this.$el.find('.users-invite').removeClass('loading');
					this.$el.find('.users-invite .btn').attr('disabled', false);
					
				}.bind(this)).save();
			},
			
			/* on it's way to be deprecated */
			/*negotiateFunctionalities : function(el) {
			
				// Check collapse option
				$(this).find('.portlet-title').on('click', function(){ $(this).parents(".collapse-closed, .collapse-open").toggleClass("collapse-closed collapse-open"); });
			},*/

			/*
			 *	Scroll down page
			 */
			scrolldown : function() {
			
				$('html, body').animate({
			        scrollTop: $(".invite-user").offset().top
			    }, 500);
			},
			
			fail : function ()
			{
				Cloudwalkers.RootView.growl (this.translateString("oops"), this.translateString("something_went_sideways_please_reload_the_page"));
			},

			translateString : function(translatedata)
			{	
				// Translate String
				return Cloudwalkers.Polyglot.translate(translatedata);
			},

			mustacheTranslateRender : function(translatelocation)
			{
				// Translate array
				this.original  = [
					"edit_user",
					"select_user",
					"invite_new_user",
					"email",
					"invite_user",
					"userlist",
					"name",
					"type",
					"manage_user_groups"
				];

				this.translated = [];

				for (var k in this.original)
				{
					this.translated[k] = this.translateString(this.original[k]);
					translatelocation["translate_" + this.original[k]] = this.translated[k];
				}
			}

		});

		return UsersView;
});