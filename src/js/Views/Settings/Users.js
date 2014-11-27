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

			/*
			 *	Send invitation
			 */
			addUser : function (e)
			{
				e.preventDefault();
				
				var data = {email: $('input[name=invite-email]').val()}
				var url = Cloudwalkers.Session.api + '/account/' + Cloudwalkers.Session.getAccount().get('id') + '/users';

				// Make the loading effect
				this.$el.find('.users-invite').addClass('loading');
				this.$el.find('.users-invite .btn').attr('disabled', true);
				
				var user = new User(data);
				
				user.once('sync', function(response)
				{
					Cloudwalkers.RootView.growl(trans("User Management"), trans("Invitation on it's way."));

					// remove the loading effect
					this.$el.find('input[name=invite-email]').val('');
					this.$el.find('.users-invite').removeClass('loading');
					this.$el.find('.users-invite .btn').attr('disabled', false);
					
				}.bind(this)).save();
			},

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
				Cloudwalkers.RootView.growl (trans("Oops"), trans("Something went sideways, please reload the page."));
			}

		});

		return UsersView;
});