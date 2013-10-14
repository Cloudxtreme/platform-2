Cloudwalkers.Views.Services = Backbone.View.extend({

	'events' : {
		'click [data-open-service]' : 'openService',
		'click [data-add-service]' : 'addServiceCall'
	},

	'render' : function ()
	{
		var self = this;

		self.$el.html ('<p>Please wait, loading data.</p>');

		self.getAvailable (function (available)
		{
			self.getConnected (function (connected)
			{
				var data = {};

				data.available = available.services;
				data.connected = connected.services;

				self.$el.html (Mustache.render (Templates.services, data));

			});
		});

		return this;
	},
	
	'getAvailable' : function (callback)
	{
		Cloudwalkers.Session.call 
		(
			'wizard/service/available',
			{
				'account' : Cloudwalkers.Session.getAccount ().get ('id')
			},
			{},
			callback
		);
	},

	'getConnected' : function (callback)
	{
		Cloudwalkers.Session.call 
		(
			'wizard/service/list',
			{
				'account' : Cloudwalkers.Session.getAccount ().get ('id')
			},
			{},
			callback
		);
	},

	'addService' : function (id, callback)
	{
		Cloudwalkers.Net.post 
		(
			'wizard/service/add',
			{
				'account' : Cloudwalkers.Session.getAccount ().get ('id')
			},
			{
				'id' : id
			},
			callback
		);
	},

	'openService' : function (e)
	{
		e.preventDefault ();

		var id = $(e.target).attr ('data-open-service');

		var self = this;
		var container = self.$el.find ('[data-service-container=' + id + ']');

		var view = new Cloudwalkers.Views.Service ({ 'serviceid' : id });
		container.show ();
		container.html (view.render ().el);

		// Rerender on 
		view.on ('service:delete', function ()
		{
			self.render ();
		});
	},

	'addServiceCall' : function (e)
	{
		e.preventDefault ();

		var self = this;
		var id = $(e.target).attr ('data-add-service');

		this.addService (id, function (data)
		{
			if (typeof (data.error) != 'undefined')
			{
				Cloudwalkers.RootView.alert (data.error.message);
			}
			else
			{
				// Most services will provide an authentication URL.
				// If available, redirect user to that URL now.
				$.each (data.service.settings, function (i, v)
				{
					if (v.type == 'link')
					{
						var url
						if (v.url.indexOf ('?'))
						{
							url = v.url + '&return=' + encodeURIComponent(window.location);
						}
						else
						{
							url = v.url + '?return=' + encodeURIComponent(window.location);
						}

						window.location = url;
					}
				});

				self.render ();
			}
		});
	}
});