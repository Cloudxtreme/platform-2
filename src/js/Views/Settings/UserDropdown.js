define(
	['backbone'],
	function (Backbone)
	{
		var UserDropdown = Backbone.View.extend({

			'tagName' : 'option',

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
				
				this.listenTo(this.model, 'change', this.render);
			},

			'render' : function ()
			{
				var self = this;
				var data = {};
				
				data.user = this.model.attributes;
				data.user.role = this.model.getRole ();
				
				// Apply role permissions to template data
				Session.censuretemplate(data);
				
				self.$el.attr('value', data.user.id);
				self.$el.html (data.user.displayname);

				return this;
			},
		});

		return UserDropdown;
});