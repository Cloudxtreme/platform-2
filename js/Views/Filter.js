Cloudwalkers.Views.Filter = Cloudwalkers.Views.Message.extend({

	'collection' : null,

	'initialize' : function (options)
	{
		this.collection = options.collection;
	},

	'render' : function ()
	{
		var data = {};

		var objData = {
			'streams' : Cloudwalkers.Session.getStreams ()
		};

		console.log (objData);

		data.channels = [];
		for (var i = 0; i < objData.streams.length; i ++)
		{
			if (objData.streams[i].direction.INCOMING == 1)
			{
				data.channels.push (objData.streams[i]);
			}
		}

		this.$el.html (Mustache.render (Templates.filter, data));
		return this;
	}

});