/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.MonitorList = Cloudwalkers.Views.Widgets.DetailedList.extend({

	'id' : 'monitorparent',
	'entries' : [],
	
	'initialize' : function ()
	{
	
		var streams = [];
		$.each(this.options.streams, function(i, stream){ streams.push(stream.id)}.bind(this));
	
		this.networkStreams = streams;
		this.keywordStreams = streams;
		this.category = this.options.category;
		this.title = this.options.category.name;
		
		//$.each(this.options.keywords, function(i, keyword){ this.keywords.push(keyword.id)}.bind(this));
		
		if(!this.category.messages)
			this.category.messages = new Cloudwalkers.Collections.Messages({id: this.category.id, records: 25});
		
		Cloudwalkers.Session.on ('stream:filter', this.toggleEntries.bind(this, "networks"));
		Cloudwalkers.Session.on ('channel:filter', this.toggleEntries.bind(this, "keywords"));
		this.once ('content:change', this.addScroll);
		
		this.initializeWidget ();
	},

	'render' : function ()
	{

		this.category.messages.fetch({ success: this.fill.bind(this), error: this.fail.bind(this) });
		
		this.$el.html (Mustache.render (Templates.monitorlist, {name: this.options.category.name }));

		return this;
	},
	
	'fill' : function (collection)
	{
		this.trigger ('content:change');
		this.$el.find('.inner-loading').toggleClass(collection.length? 'inner-loading': 'inner-empty inner-loading');
		
		// Go trough all messages
		collection.each (function (message)
		{
			message.attributes.network = message.getStream ().attributes.network;
			
			var parameters = {
				'model' : message,
				'streamid' : message.get("stream"),
				'template' : 'keywordentry'
			};
			
			var messageView = new Cloudwalkers.Views.Entry (parameters);
			this.entries.push (messageView);
			
			this.$el.find ('.messages-container').append(messageView.render().el);
			
		}.bind(this));
		
		this.toggleEntries(null);
	},
	
	'add' : function (e, pos)
	{
		
		if(e && pos == "top") return null;
		
		this.$el.find('table').addClass('inner-loading');
		this.category.messages.next({ success: this.fill.bind(this), error: this.fail.bind(this) });
		
	},
	
	'toggleEntries' : function(type, data)
	{
		var data = data;
		var streams = [];
		
		this.$el.find('tr.hidden').removeClass('hidden');
		
		if(type == "networks")
			this.networkStreams = streams = data;
				
		else if(type) {
			$.each(this.options.keywords, function(i, keyword)
			{
				if($.inArray(keyword.id, data) >= 0)
					for(i in keyword.streams) streams.push(keyword.streams[i].id);
			});
			this.keywordStreams = streams;
		}		
		
		$.each(this.entries, function(i, entry)
		{
			if( $.inArray(entry.options.streamid, this.networkStreams) < 0
			||	$.inArray(entry.options.streamid, this.keywordStreams) < 0)
				entry.$el.addClass('hidden');
		
		}.bind(this));
		
		if(this.$el.find('tr:not(.hidden)').size() < 8) this.add();
	},
		
	'fail' : function ()
	{
		Cloudwalkers.RootView.growl ("Oops", "Something went sideways, please reload the page.");
	},
	
	'reset' : function ()
	{
		this.$el.find ('.messages-container').addClass('inner-loading').html("");
	},
	
	'error' : function ()
	{
		Cloudwalkers.RootView.growl("Monitoring error", "A little hick-up, please try again");
	},
	
	'negotiateFunctionalities' : function() { /* Black  Hole */ },
	
	/*'maximizeView' : function() {
		
		var height = $("#inner-content").height() -170;
		$("#monitorlist .portlet-body").css({"height": height + "px", "max-height": height + "px"});
	},*/
	
	'addScroll' : function () {

		this.$el.find('.scroller').slimScroll({
			size: '6px',
			color: '#a1b2bd',
			height: $("#inner-content").height() -165 + "px",
			alwaysVisible: false,
			railVisible: false,
			disableFadeOut: true
		}).bind('slimscroll', this.add.bind(this));
	}
});