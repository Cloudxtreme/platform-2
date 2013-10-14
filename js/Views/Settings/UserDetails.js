Cloudwalkers.Views.Settings.UserDetails = Backbone.View.extend({

	'events' : {
		'submit form' : 'submit'
	},

	'render' : function ()
	{
		var self = this;
		var data = {};

		var levels = [ { 'level' : 0, 'name' : 'Co-Workers' }, { 'level' : 10, 'name' : 'Administrators' }];

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
		var self = this;
		e.preventDefault ();

		var data = $(e.target).serializeArray ();
		var userdata = {};		
		for (var i = 0; i < data.length; i ++)
		{
			userdata[data[i].name] = data[i].value;
		}

		this.model.set ('level', userdata.level);
		this.model.save 
		(
			{},
			{
				'success' : function ()
				{
					self.trigger ('popup:close');
					var collection = self.model.collection;

					collection.trigger ('reset:all');
				}
		});
	}
});