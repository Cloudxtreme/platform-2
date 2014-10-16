define(
	['backbone', 'mustache', 'Views/Settings/UserDetails'],
	function (Backbone, Mustache, UserDetailsView)
	{
		var User = Backbone.View.extend({

			tagName : 'tr',

			events : 
			{
				'click [data-edit-user-id]' : 'openDetails',
				'click [data-delete-user-id]' : 'deleteUser'
			},
			
			initialize : function (options)
			{
				// Parameters	
				if(options) $.extend(this, options);
				
				// HACK!
				this.parameters = {};
				
				this.listenTo(this.model, 'change:clearance', this.render);
			},

			render : function ()
			{
				var data = {};
				
				data.user = this.model.attributes;
				data.user.role = this.model.getRole().name;
				
				// Apply role permissions to template data
				Cloudwalkers.Session.censuretemplate(data);
				
				this.$el.html (Mustache.render (Templates.user, data));

				return this;
			},

			openDetails : function ()
			{
				var view = new UserDetailsView ({ model : this.model, view: this.view });
				$(".manage-users-edit-widget .portlet-body").html(view.render().el);
			},
			
			deleteUser : function (e)
			{
				var $tr = $(e.currentTarget).parents('tr');
				var user = Cloudwalkers.Session.getUser($tr.data('delete-user-id'));
				
				Cloudwalkers.RootView.confirm (trans("You are about to remove ") + this.model.get('firstname') + trans(". Are you sure?"), function(){
					
					this.model.destroy({success: function(){
						$tr.remove();
						Cloudwalkers.RootView.growl(trans("Manage users"), trans("That's an ex-user."));
					}});
				}.bind(this));
			}
			
		});
		
		return User;
});