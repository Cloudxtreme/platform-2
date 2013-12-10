/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.MonitorList = Cloudwalkers.Views.Widgets.DetailedList.extend({

	'id' : 'monitorparent',
	'reloadLimit' : 0,
	'entries' : [],
	
	'initialize' : function ()
	{
	
		var streams = [];
		$.each(this.options.streams, function(i, stream){ streams.push(stream.id)}.bind(this));
		
		this.networkStreams = streams;
		this.keywordStreams = streams;
		this.category = this.options.category;
		
		if(!this.category.messages)
			this.category.messages = new Cloudwalkers.Collections.Messages([], {id: this.category.id, records: 25});
		

		this.once ('content:change', this.addScroll);
		this.listenTo(Cloudwalkers.Session, 'stream:filter', this.toggleEntries.bind(this, "networks"));
		this.listenTo(Cloudwalkers.Session, 'channel:filter', this.toggleEntries.bind(this, "keywords"));

		this.initializeWidget ();
	},

	'render' : function ()
	{

		this.category.messages.fetch({ success: this.fill.bind(this), error: this.fail.bind(this) });
		
		this.$el.html (Mustache.render (Templates.monitorlist, {name: this.category.get("name") }));
		
		this.listenTo(Cloudwalkers.Session, 'destroy:view', this.remove);

		return this;
	},
	
	'fill' : function (collection)
	{
		this.trigger ('content:change');
		this.$el.find('.inner-loading').removeClass(collection.length? 'inner-loading inner-empty empty-recent': 'inner-loading');
		
		// Go trough all messages
		collection.each (function (message)
		{
			message.channel = this.category;
			
			var parameters = {
				'model' : message,
				'streamid' : message.get("stream"),
				'template' : 'messageentry'//keywordentry
			};
			
			var messageView = new Cloudwalkers.Views.Entry (parameters);
			this.entries.push (messageView);
			
			this.$el.find ('.messages-container').append(messageView.render().el);
			
		}.bind(this));
		
		this.toggleEntries(null);
	},
	
	'fail' : function ()
	{
		Cloudwalkers.RootView.growl ("Oops", "Something went sideways, please reload the page.");
	},

	
	'add' : function (e, pos)
	{
		
		if(e && pos == "top") return null;
		
		//this.$el.find('ul').addClass('inner-loading');
		//this.category.messages.next({ success: this.fill.bind(this), error: this.fail.bind(this) });
		
	},
	
	'toggleEntries' : function(type, data)
	{
		var data = data;
		var streams = [];
		
		this.$el.find('li.hidden').removeClass('hidden');
		
		if(type == "networks")
			this.networkStreams = streams = data.map(function(el){ return Number(el)});
				
		else if(type) {
			$.each(this.options.keywords, function(i, keyword)
			{
				if($.inArray(keyword.id, data) >= 0)
					for(i in keyword.streams) streams.push(keyword.streams[i].id);
			});
			this.keywordStreams = streams.map(function(el){ return Number(el)});
		}		
		
		$.each(this.entries, function(i, entry)
		{
			if( $.inArray(entry.options.streamid, this.networkStreams) < 0
			||	$.inArray(entry.options.streamid, this.keywordStreams) < 0)
				entry.$el.addClass('hidden');
		
		}.bind(this));
	
		if(this.$el.find('li:not(.hidden)').size() < 8 && ++this.reloadLimit <= 3) this.add();
		else this.reloadLimit = 0;

		if(!this.$el.find('li:not(.hidden)').size() && !this.reloadLimit) this.$el.find('.messages-container').addClass('inner-empty empty-recent'); 
		// Hack
		//if(! this.$el.find('li:not(.hidden)').size() && this.reloadLimit == 3)	
		//	   
		//else this.$el.find('.messages-container').removeClass('inner-empty empty-recent');
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