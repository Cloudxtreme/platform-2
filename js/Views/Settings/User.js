Cloudwalkers.Views.Settings.User = Backbone.View.extend({

	'tagName' : 'tr',
	'events' : 
	{
		'click [data-edit-user-id]' : 'openDetails',
		'click [data-delete-user-id]' : 'deleteUser',
		'click [data-managed-user-id]' : 'saveDetails'
	},
	
	'initialize' : function (options)
	{
		// Parameters	
		if(options) $.extend(this, options);
		
		// HACK!
		this.parameters = {};
		
		this.listenTo(this.model, 'change:clearance', this.closeDetails);

		// Translate String
		translate_you_are_about_to_remove = this.translateString("you_are_about_to_remove");
		translate_sure = this.translateString("sure");
		translate_manage_users = this.translateString("manage_users");
		translate_thats_an_ex_user = this.translateString("thats_an_ex_user");
	},

	'render' : function (a)
	{
		var self = this;
		var data = {};
		
		data.user = this.model.attributes;
		data.user.role = this.model.getRole().name;
		
		// Apply role permissions to template data
		Cloudwalkers.Session.censuretemplate(data);

		this.$el.html (Mustache.render (Templates.settings.user, data));

		return this;
	},

	'openDetails' : function ()
	{	
		var data = {};
		
		data.user = this.model.attributes;
		data.user.role = this.model.getRole().name;

		var role = this.model.get('rolegroup')
		var roles = Cloudwalkers.Session.getAccount().get('roles');
		data.roles = [];
		for (var i = 0; i < roles.length; i ++)
		{
			var tmp = roles[i];
			tmp.checked = this.model.get ('rolegroup') == roles[i].id;

			data.roles.push (tmp);
		}

		this.$el.html (Mustache.render (Templates.settings.userdetails, data));
	},

	'closeDetails' : function ()
	{	
		this.render();
	},

	'saveDetails' : function(){
		var data = {rolegroup: this.$("#level").val(), firstname: this.$("input[name=firstname]").val() , name: this.$("input[name=name]").val() };

		this.model.parent = Cloudwalkers.Session.getAccount();

		this.model.save(data, {
			patch: true, 
			success: this.success.bind(this)
		});
	},

	'deleteUser' : function (e)
	{
		var self = this;
		var tr = $(e.currentTarget).parents("tr");
		
		Cloudwalkers.RootView.confirm (translate_you_are_about_to_remove + this.model.get('firstname') + translate_sure, function(){
			
			tr.remove();
			
			var url = 'account/' + Cloudwalkers.Session.getAccount().get('id') + '/users/' + self.model.get('id');
			Cloudwalkers.Net.remove (url, {}, function(){
			
				Cloudwalkers.RootView.growl(translate_manage_users, translate_thats_an_ex_user);
			});
		});
	},

	'success' : function()
	{	
		Cloudwalkers.RootView.growl(this.translateString("manage_users"), this.translateString("the_user_clearance_is_updated"));
		this.model.trigger("change:clearance");
	},

	'translateString' : function(translatedata)
	{	
		// Translate String
		return Cloudwalkers.Session.polyglot.t(translatedata);
	}
	
});