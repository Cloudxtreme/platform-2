Cloudwalkers.Views.Settings.StreamSettings = Backbone.View.extend({

	'events' : {
        'submit form' : 'submit'
	},

    'streamid' : null,

	'render' : function ()
	{
		var self = this;

        this.streamid = this.options.streamid;

		self.$el.html ('<p>Please wait, loading data.</p>');

		self.getStreamSettings (function (eventdata)
		{
            var data = {};

            data.events = JSON.stringify (eventdata.events);

            self.$el.html
                (
                    Mustache.render
                    (
                        Templates.settings.streamsettings,
                        data
                    )
                );
		});

		return this;
	},

    'getStreamSettings' : function (callback)
    {
        Cloudwalkers.Net.get('stream/' + this.streamid + '/events', null, callback);
    },

    'setStreamSettings' : function (data, callback)
    {
        Cloudwalkers.Net.put('stream/' + this.streamid + '/events', null, data, callback);
    },

    'submit' : function (e)
    {
        var self = this;

        e.preventDefault ();

        var events = JSON.parse (this.$el.find ('[name="events"]').val ());
        this.setStreamSettings ({'events' : events }, function (data)
        {
            if (typeof (data.error) != 'undefined')
            {
                Cloudwalkers.RootView.alert (data.error.message);
            }
            else
            {
                self.trigger ('popup:close');
            }
        });
    }
});