define(
	['backbone', 'Views/Root', 'Views/Settings'],
	function (Backbone, RootView, SettingsView)
	{
		var User = Backbone.View.extend({

			'tagName' : 'tr',

			'events' : 
			{
				'click [data-edit-user-id]' : 'openDetails',
				'click [data-delete-user-id]' : 'deleteUser'
			},
			
			'initialize' : function (options)
			{
				// Parameters	
				if(options) $.extend(this, options);
				
				// HACK!
				this.parameters = {};
				
				this.listenTo(this.model, 'change:clearance', this.render);

				// Translate String
				translate_you_are_about_to_remove = this.translateString("you_are_about_to_remove");
				translate_sure = this.translateString("sure");
				translate_manage_users = this.translateString("manage_users");
				translate_thats_an_ex_user = this.translateString("thats_an_ex_user");
			},

			'render' : function ()
			{
				var self = this;
				var data = {};
				
				data.user = this.model.attributes;
				data.user.role = this.model.getRole().name;
				
				// Apply role permissions to template data
				Session.censuretemplate(data);
				
				self.$el.html (Mustache.render (Templates.settings.user, data));

				return this;
			},

			'openDetails' : function ()
			{
				var view = new SettingsView.UserDetails ({ 'model' : this.model, 'view': this.view });
				$(".manage-users-edit-widget .portlet-body").html(view.render().el);
			},
			
			'deleteUser' : function (e)
			{
				var $tr = $(e.currentTarget).parents('tr');
				var user = Session.getUser($tr.data('delete-user-id'));
				
				RootView.confirm (translate_you_are_about_to_remove + this.model.get('firstname') + translate_sure, function(){
					
					this.model.destroy({success: function(){
						$tr.remove();
						RootView.growl(translate_manage_users, translate_thats_an_ex_user);
					}});
					/*
					var url = 'account/' + Session.getAccount().get('id') + '/users/' + self.model.get('id');
					Cloudwalkers.Net.remove (url, {}, function(){
					
						RootView.growl(translate_manage_users, translate_thats_an_ex_user);
					}.bind(this));*/
				}.bind(this));
			},
			'translateString' : function(translatedata)
			{	
				// Translate String
				return Session.polyglot.t(translatedata);
			}
			
		});
		
		return User;
});