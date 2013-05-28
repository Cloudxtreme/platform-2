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
					self.addMessages (data.types[i].name, data.types[i].messages)
				}

				for (var i = 0; i < data.channels.length; i ++)
				{
					self.addMessages (data.channels[i].name, data.channels[i].messages, '#channel/' + data.channels[i].id);
				}

				jcf.customForms.replaceAll();
			}
		);

		return this;
	},

	'addMessages' : function (type, messages, more)
	{
		this.$el.find ('.messages-container').append ('<div class="comment-heading"><h3>' + type + '</h3></div>');

		for (var i = 0; i < messages.length; i ++)
		{
			var model = new Cloudwalkers.Models.Message (messages[i]);
			var view = new Cloudwalkers.Views.Message ({ 'model' : model });

			this.$el.find ('.messages-container').append (view.render ().el);
		}

		if (typeof (more) != 'undefined')
		{
			this.$el.find ('.messages-container').append ('<div class="button-row"><a href="' + more + '"><span>more from ' + type + '</span></a></div>');
		}
	}

});