Cloudwalkers.Views.Settings.UserDetails = Backbone.View.extend({

	'events' : {
		'submit form.edit-managed-user' : 'submit'
	},
	
	'initialize' : function (options)
	{
		// Parameters	
		if(options) $.extend(this, options);		
	},

	'render' : function ()
	{
		var self = this;
		var data = {};

		var level = Number(this.model.get("level"));
		var levels = [ { 'level' : 0, 'name' : 'Co-Workers' }, { 'level' : 10, 'name' : 'Administrators' }];
		
		levels[(level)? 1:0].checked = true;

		data.user = this.model.attributes;
		data.title = data.user.name;

		data.levels = [];
		for (var i = 0; i < levels.length; i ++)
		{
			var tmp = levels[i];
			tmp.checked = this.model.get ('level') == levels[i].level;

			data.levels.push (tmp);
		}

		self.$el.html (Mustache.render (Templates.settings.userdetails, data));

		return this;
	},

	'submit' : function (e)
	{
		
		var data = {level: $("#level").val()};
		var url = 'account/' + Cloudwalkers.Session.getAccount().get('id') + '/users/' + this.model.get('id');
		
		Cloudwalkers.Net.put (url, {}, data, function()
		{
			Cloudwalkers.RootView.growl('Manage Users', "The user clearance is updated.");
			
			// Load users
			this.view.collection.fetch({records: 100});
		
		}.bind(this));

	}
});