Cloudwalkers.Views.Settings.AddUser = Backbone.View.extend({

	'events' : {
		'submit form' : 'submit'
	},

	'render' : function ()
	{
		var self = this;
		var data = {};

		self.$el.html (Mustache.render (Templates.settings.adduser, data));

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

		jQuery.ajax (
			CONFIG_BASE_URL + 'json/account/' + Cloudwalkers.Session.getAccount ().get ('id') + '/users',
			{
				'type' : 'POST',
				'data' : JSON.stringify (userdata),
				'dataType': 'json',
				'contentType' : 'application/json',
				'processData' : false,
				'cache': false,
				'success' : function (data)
				{
					if (data.error)
					{
						alert (data.error.message);
					}
					else
					{
						self.trigger ('popup:close')
					}
				}
			}
		);
	}
});