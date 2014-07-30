Cloudwalkers.Views.Settings.UserDetails = Backbone.View.extend({

	'events' : {
		'submit form.edit-managed-user' : 'submit'
	},
	
	'initialize' : function (options)
	{
		// Parameters	
		if(options) $.extend(this, options);		

		this.listenTo(this.model, 'request', this.disablesave);
		this.listenTo(this.model, 'sync', this.enablesave);
	},

	'render' : function ()
	{
		var self = this;
		var data = {};
		//left dropdown & default checked
		//var level = Number(this.model.get("level"));
		//var levels = [ { 'level' : 0, 'name' : 'Co-Workers' }, { 'level' : 10, 'name' : 'Administrators' }];

		var role = this.model.get('rolegroup')
		var roles = Cloudwalkers.Session.getAccount().get('roles');
		
		//levels[(level)? 1:0].checked = true;

		data.user = this.model.attributes;
		data.title = data.user.name;
		
		// add levels to dropdown
		//data.levels = [];
		data.roles = [];
		for (var i = 0; i < roles.length; i ++)
		{
			var tmp = roles[i];
			tmp.checked = this.model.get ('rolegroup') == roles[i].id;

			data.roles.push (tmp);
		}

		self.$el.html (Mustache.render (Templates.settings.userdetails, data));

		return this;
	},

	'submit' : function (e)
	{		
		var data = {rolegroup: $("#level").val()};

		this.model.parent = Cloudwalkers.Session.getAccount();

		this.model.save(data, {
			patch: true, 
			success: this.success.bind(this)
		});

	},

	'success' : function()
	{	
		Cloudwalkers.RootView.growl('Manage Users', "The user clearance is updated.");	
		this.model.trigger("change:clearance")	;
	},

	'disablesave' : function()
	{	
		this.$el.find('.edit-managed-user .btn').attr("disabled", true);
	},

	'enablesave' : function()
	{	
		this.$el.find('.edit-managed-user .btn').attr("disabled", false);
	}
});