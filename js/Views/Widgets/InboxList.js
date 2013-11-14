/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.InboxList = Cloudwalkers.Views.Widgets.DetailedList.extend({

	'template' : 'detailedlist',
	'messagetemplate' : 'messagedetailedlist',
	'messageelement' : 'tr',
	'id' : 'inbox',

	'currentSelected' : null,

	'render' : function ()
	{
		var self = this;

		this.$innerEl = this.$el;
		this.innerRender (this.$innerEl);

		this.$el.attr ('id', 'list');

		this.on ('content:change', function ()
		{
			
			
			
			if (self.currentSelected)
			{
				self.currentSelected.$el.find ('td').addClass ('active');
			}
			
		});

		return this;
	},
	
	'innerRender' : function (element)
	{
		
		var self = this;
		var data = {};

		jQuery.extend (true, data, this.options);

		//data.showMoreButton = typeof (this.options.channel.showMoreButton) != 'undefined' ? this.options.channel.showMoreButton : false;

		element.html (Mustache.render (Templates[this.template], data));

		//element.find ('.load-more').hide ();
		//element.find ('.timeline-loading').show ();

        this.options.channel.bind('add', this.addOne, this);
        this.options.channel.bind('refresh', this.refresh, this);
        this.options.channel.bind('reset', this.refresh, this);
        this.options.channel.bind('sort', this.resort, this);
        //this.options.channel.bind('change', this.resort, this);
        this.options.channel.bind('remove', this.removeMessage, this);

        Cloudwalkers.Session.bind 
        (
        	'message:add', 
        	function () 
        	{ 
        		self.options.channel.reset (); 
        		self.options.channel.fetch (); 
        	}, 
        	this
        );

		// Fetch!
		this.options.channel.fetch ({
			'error' : function (e)
			{
				//alert ('Error');
				console.log (e);
			},
			'success' : function (e)
			{

				/*if (self.canLoadMore
                    && (typeof (self.options.channel.loadMore) != 'undefined')
                )
				{
                    if (self.options.channel.length > 0)
                    {
					    element.find ('.load-more').show ();
                    }

					element.find ('.timeline-loading').hide();
				}*/
				
				if (self.options.channel.length) self.maximizeView();

				// Change laoding class
				$("#inboxcontainer").toggleClass((self.options.channel.length)? 'inner-loading': 'inner-empty inner-loading');

				self.afterInit ();
			}
		});

		// Auth refresh
		this.interval = setInterval (function ()
		{
			//self.options.channel.reset (); 
			//self.options.channel.fetch ();
			self.options.channel.update ();
		}, 1000 * 15);

		return this;
	},

	'processMessageView' : function (message, view)
	{
		var self = this;
		view.$el.click (function ()
		{
			self.$el.find ('td').removeClass ('active');

			self.currentSelected = view;

			self.currentSelected.$el.find ('td').addClass ('active');
			self.trigger ('select:message', message);
		});
	},

	'onFirstAdd' : function (message, messageView)
	{
		if (!this.options.selectmessage)
		{
			setTimeout (function ()
			{
				messageView.$el.click ();
			}, 100);
		}
	},

	'afterInit' : function ()
	{
		if (this.options.selectmessage)
		{
			this.$el.find ('.messages-container').find ('[data-message-id=' + this.options.selectmessage + ']').click ();
		}
	},
	
	'maximizeView' : function() {
		
		var height = $("#inner-content").height() -90;
		
		$("#inboxcontainer, #list .portlet-body").css({"height": height + "px", "max-height": height + "px"});
		
		this.addScroll();
		
	},
	
	'addScroll' : function () {

		this.$el.find('.scroller').slimScroll({
			size: '6px',
			color: '#a1b2bd',
			position: 'right',
			height: 'auto',
			alwaysVisible: false,
			railVisible: false,
			disableFadeOut: true
		});
	}


});