Cloudwalkers.Views.Settings.Service = Backbone.View.extend({

	'events' : {
		/*'submit form' : 'submit',
		'click [data-delete]' : 'deleteServiceClick',
        'click [data-stream-details-id]' : 'streamDetailView',*/
        'click li[data-id]' : 'toggleprofile',
        'click .delete-detail' : 'delete',
        'click .close-detail' : 'closedetail'
	},
	
	'listnames' : {
		'facebook': "Pages",
		'twitter': false,
		'linkedin': "Companies",
		'google-plus': "Pages",
		'youtube': false
	}, 

	'service' : null,
	
	'initialize' : function(options)
	{
		if (options) $.extend(this, options);
		
		// Set service
		this.service = this.parent.services.get(this.id);
	},
	
	'render' : function ()
	{
		// Clone service data
		var data = _.clone(this.service.attributes);
		data.listname = this.listnames[data.network.token];

		//Mustache translations
		data.translate_done = this.translateString("done");
		data.translate_delete = this.translateString("delete");
		data.translate_connected_to = this.translateString("connected_to");
		data.translate_reauthenticate_user = this.translateString("reauthenticate_user");
		data.translate_to_add = this.translateString("to_add");
		data.translate_is_not_connected = this.translateString("is_not_connected");
		data.translate_authenticate_user = this.translateString("authenticate_user");
		data.translate_save = this.translateString("save");
		
		// Render view
		this.$el.html (Mustache.render (Templates.settings.service, data));
		
		return this;
	},
	
	'toggleprofile' : function (e)
	{
		// Button
		var entry = $(e.currentTarget).toggleClass("active inactive");
		
		// Patch data
		var profile = new Cloudwalkers.Models.User({id: entry.data("id")});
		
		profile.parent = this.service;
		profile.typestring = "profiles";
		
		// Update profile
		profile.save({"activated": entry.hasClass("active")}, {patch: true, success: function(profile)
		{
			Cloudwalkers.RootView.growl ("Social connections", "A successful update, there.");
		}});
	},
	
	'delete' : function ()
	{
		Cloudwalkers.RootView.confirm("You are about to delete a service. All statistics information will be lost.", function()
		{
			// View
			this.parent.$el.find("[data-service="+ this.service.id +"]").remove();
			
			// Data
			this.service.destroy();
			this.parent.closedetail();
						
		}.bind(this));
	},
	
	'closedetail' : function()
	{
		this.parent.closedetail();
	},
	

	/*'render' : function ()
	{
		var self = this;

		self.getServiceData (this.options.serviceid, function (data)
		{
			self.$el.closest(".inner-loading").removeClass("inner-loading");
			
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
						'service_channel' : Templates.settings.service_channel,
                        'service_stream' : Templates.settings.service_stream
					}
				)
			);
		});

		return this;
	},*/

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
		Cloudwalkers.Net.get 
		(
			'wizard/service/' + id,
			{
				'account' : Cloudwalkers.Session.getAccount ().get ('id')
			},
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
		Cloudwalkers.Net.remove (
			'wizard/service/' + id,
			{
				'account' : Cloudwalkers.Session.getAccount ().get ('id')	
			},
			callback
		);
	},

	'setStreamChannels' : function (service)
	{
		var channels = Cloudwalkers.Session.getChannels ();

		function loadChannels (stream, channels)
		{
			var out = [];

			//for (var i = 0; i < channels.length; i ++)
            channels.each (function (channel)
			{
                //console.log (channels);
                //console.log (channel);

                if (channel.get ('parent') || !channel.get ('name'))
                {
                    return;
                }

				// Check if selected
				var selected = false;
				for (var j = 0; j < stream.channels.length; j ++)
				{
					if (stream.channels[j] == channel.get ('id'))
					{
						selected = true;
						break;
					}
				}

				var tmp  = {
					'channel' : channel.attributes,
					'selected' : selected,
					'channels' : []
				};
				
				var subchannels = channel.attributes? channel.get("channels"): channel.channels;
				
				// Recursive!
				if (subchannels && subchannels.length)
				{
					//tmp.channels = loadChannels (stream, new Backbone.Collection (subchannels));
				}

				out.push (tmp);
			});

			return out;
		}

        // Little helper method
        function parseStreamSettings (stream)
        {
            var groupedsettings = {
                'string' : [],
                'boolean' : []
            };
            for (var j = 0; j < stream.settings.length; j ++)
            {
                if (typeof (groupedsettings[stream.settings[j].type]) == 'undefined')
                {
                    groupedsettings[stream.settings[j].type] = [];
                }
                groupedsettings[stream.settings[j].type].push (stream.settings[j]);
            }

            stream.groupedsettings = groupedsettings;
        }

        function parseStreams ()
        {
            var out = [];
            for (var i = 0; i < service.streams.length; i ++)
            {
                if (service.streams[i].canSetChannels && typeof (service.streams[i].parent) == 'undefined')
                {
                    parseStreamSettings (service.streams[i]);

                    out.push ({
                        'parsedchannels' : loadChannels (service.streams[i], channels),
                        'stream' : service.streams[i],
                        'substreams' : parseSubstreams (service.streams[i])
                    });
                }
            }
            return out;
        }

        function parseSubstreams (stream)
        {
            var out = [];

            // Get the children streams
            $.each (service.streams, function (iii, v)
            {
                if ((typeof (v.parent) != 'undefined'))
                {
                    if (v.parent.id == stream.id)
                    {
                        parseStreamSettings (v);

                        out.push ({
                            'parsedchannels' : loadChannels (v, channels),
                            'stream' : v,
                            'substreams' : parseSubstreams (v)
                        });
                    }
                }
            });

            return out;
        }

        service.parsedstreams = parseStreams ();
	},

	'submit' : function (e)
	{
		// Gather all data
		var self = this;

		e.preventDefault ();

		var form = $(e.target);

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
	},

    'streamDetailView' : function (e)
    {
        e.preventDefault ();

        var streamid = $(e.target).attr ('data-stream-details-id');

        var view = new Cloudwalkers.Views.Settings.StreamSettings ({ 'streamid' : streamid });
        Cloudwalkers.RootView.popup (view);
    },
	'translateTitle' : function(translatedata)
	{	
		// Translate Title
		this.title = Cloudwalkers.Session.polyglot.t(translatedata);
	},
	'translateString' : function(translatedata)
	{	
		// Translate String
		return Cloudwalkers.Session.polyglot.t(translatedata);
	}
});