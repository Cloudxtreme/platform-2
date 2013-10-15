Cloudwalkers.Views.Settings.Service = Backbone.View.extend({

	'events' : {
		'submit form' : 'submit',
		'click [data-delete]' : 'deleteServiceClick'
	},

	'service' : null,

	'render' : function ()
	{
		var self = this;

		self.$el.html ('<p>Please wait, loading data.</p>');

		self.getServiceData (this.options.serviceid, function (data)
		{
			// Set service data
			self.service = data.service;

			var groupedsettings = {};

			for (var i = 0; i < data.service.settings.length; i ++)
			{
				if (typeof (groupedsettings[data.service.settings[i].type]) == 'undefined')
				{
					groupedsettings[data.service.settings[i].type] = [];
				}
				groupedsettings[data.service.settings[i].type].push (data.service.settings[i]);
			}

			data.service.groupedsettings = groupedsettings;

			self.setStreamChannels (data.service);

			self.$el.html 
			(
				Mustache.render 
				(
					Templates.settings.service, 
					data.service,
					{
						'service_channel' : Templates.settings.service_channel
					}
				)
			);
		});

		return this;
	},

	'processSettings': function (settings)
	{
		var self = this;

		// Most services will provide an authentication URL.
		$.each (settings, function (i, v)
		{
			if (v.type == 'link')
			{
				settings[i].url = self.processLink (v.url);
			}
		});
	},

	'processLink' : function (url)
	{
		if (url.indexOf ('?') > 0)
		{
			url = url + '&return=' + encodeURIComponent(window.location);
		}
		else
		{
			url = url + '?return=' + encodeURIComponent(window.location);
		}
		return url;
	},
	
	'getServiceData' : function (id, callback)
	{
		var self = this;
		Cloudwalkers.Session.call 
		(
			'wizard/service/' + id,
			{
				'account' : Cloudwalkers.Session.getAccount ().get ('id')
			},
			{},
			function (data)
			{
				self.processSettings (data.service.settings);
				callback (data);
			}
		);
	},

	'storeServiceData' : function (id, data, callback)
	{
		Cloudwalkers.Net.put 
		(
			'wizard/service/' + id,
			{
				'account' : Cloudwalkers.Session.getAccount ().get ('id')
			},
			data,
			callback
		);
	},

	'deleteService' : function (id, callback)
	{
		Cloudwalkers.Net.delete (
			'wizard/service/' + id,
			{
				'account' : Cloudwalkers.Session.getAccount ().get ('id')	
			},
			callback
		);
	},

	'setStreamChannels' : function (service)
	{
		var channels = Cloudwalkers.Session.getAccount ().channels ();

		function loadChannels (stream, channels)
		{
			var out = [];

			for (var i = 0; i < channels.length; i ++)
			{
				// Check if selected
				var selected = false;
				for (var j = 0; j < stream.channels.length; j ++)
				{
					if (stream.channels[j] == channels[i].id)
					{
						selected = true;
						break;
					}
				}

				var tmp  = {
					'channel' : channels[i],
					'selected' : selected,
					'channels' : []
				};

				// Recursive!
				if (channels[i].channels.length > 0)
				{
					tmp.channels = loadChannels (stream, channels[i].channels);
				}

				out.push (tmp);
			}

			return out;
		}

		service.parsedstreams = [];

		for (var i = 0; i < service.streams.length; i ++)
		{
			var groupedsettings = {};
			for (var j = 0; j < service.streams[i].settings.length; j ++)
			{
				if (typeof (groupedsettings[service.streams[i].settings[j].type]) == 'undefined')
				{
					groupedsettings[service.streams[i].settings[j].type] = [];
				}
				groupedsettings[service.streams[i].settings[j].type].push (service.streams[i].settings[j]);
			}

			service.streams[i].groupedsettings = groupedsettings;

			if (service.streams[i].canSetChannels)
			{
				service.parsedstreams.push ({
					'parsedchannels' : loadChannels (service.streams[i], channels),
					'stream' : service.streams[i]
				});
			}
		}
	},

	'submit' : function (e)
	{
		// Gather all data
		var self = this;

		e.preventDefault ();

		var form = $(e.target);

		var formdata = {};

		var formdata = {
			'streams' : {}
		};

		form.find ('[data-channel-setting]').each (function (i, v)
		{
			if ($(v).attr ('type') == 'checkbox')
			{
				formdata[$(v).attr ('name')] = $(v).is (':checked');
			}
			else
			{
				formdata[$(v).attr ('name')] = $(v).val ();
			}
		});

		$.each (this.service.streams, function (i, v)
		{
			var channels = [];
			form.find('[data-stream-id=' + v.id + '][data-channel-id]:checked').each (function (i, v)
			{
				channels.push ($(v).attr ('data-channel-id'));
			});

			formdata.streams[v.id] = {
				'channels' : channels
			};

			// And settings.
			form.find ('[data-stream-setting=' + v.id + ']').each (function (ii, vv)
			{
				if ($(vv).attr ('type') == 'checkbox')
				{
					formdata.streams[v.id][$(vv).attr ('name')] = $(vv).is (':checked');
				}
				else
				{
					formdata.streams[v.id][$(vv).attr ('name')] = $(vv).val ();
				}
			});

		});

		// And store.
		this.storeServiceData (this.service.id, formdata, function ()
		{
			self.render ();
		});
	},

	'deleteServiceClick' : function (e)
	{
		e.preventDefault ();

		var self = this;

		Cloudwalkers.RootView.confirm 
		(
			'Are you sure you want to remove this service? All statistics will be lost.', 
			function ()
			{
				self.deleteService (self.service.id, function ()
				{
					self.trigger ('service:delete');
				});
			}
		);
	}
});