Cloudwalkers.Views.UserDetails = Backbone.View.extend({

	'events' : {
		'submit form' : 'submit'
	},

	'render' : function ()
	{
		var self = this;
		var data = {};

		data.user = this.model.attributes;
		data.title = data.user.name;

		self.$el.html (Mustache.render (Templates.userdetails, data));

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

		this.model.set ('name', userdata.name);
		this.model.set ('level', userdata.level);
		this.model.save 
		(
			{},
			{
				'success' : function ()
				{
					self.trigger ('popup:close');
					var collection = self.model.collection;
					collection.reset ();
					collection.fetch ();
				}
		});
	}
});