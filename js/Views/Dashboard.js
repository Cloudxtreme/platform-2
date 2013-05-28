Cloudwalkers.Views.Dashboard = Backbone.View.extend({

	'render' : function ()
	{
		var self = this;

		self.$el.html ('<p>Please wait, we are loading the dashboard.</p>');

		Cloudwalkers.Session.call 
		(
			'dashboard', 
			{ 
				'account' : Cloudwalkers.Session.getAccount ().get ('id') 
			}, 
			null, 
			function (data)
			{
				console.log (data);


				self.$el.html (Mustache.render (Templates.dashboard, data));

				for (var i = 0; i < data.types.length; i ++)
				{
					self.addType (data.types[i].name, data.types[i].messages)
				}
			}
		);

		return this;
	},

	'addType' : function (type, messages)
	{
		this.$el.find ('.messages-container').append ('<div class="comment-heading"><h3>' + type + '</h3></div>');

		for (var i = 0; i < messages.length; i ++)
		{
			var model = new Cloudwalkers.Models.Message (messages[i]);
			var view = new Cloudwalkers.Views.Message ({ 'model' : model });

			this.$el.find ('.messages-container').append (view.render ().el);
		}
	}

});