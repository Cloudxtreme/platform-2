/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.MonitorList = Cloudwalkers.Views.Widgets.DetailedList.extend({

	'messagetemplate' : 'keywordmessage',
	'messageelement' : 'tr',
	'id' : 'monitorlist_parent',

	'currentSelected' : null,

	'render' : function ()
	{
		
		var self = this;
		var element = this.$el;

		element.html (Mustache.render (Templates.monitorlist, this.options));

		/**
		 *	Current Collection Triggers
		 *	reset:	 Triggered when cleaning collections		sort:	Triggered after succes	
		 *	add:	 Triggered each time a message is added		change: Triggered each time something changes in list view, ie adding a message
		 *	refresh: Currently not activated					remove: Currently not activated	
		 *	error:	 Triggered when something goes wrong
		 **/
		 
		this.options.channel.bind('sort', this.resort, this);
		this.options.channel.bind('reset', this.reset, this);
		this.options.channel.bind('error', this.error, this);
		
		// Fetch!
		this.options.channel.fetch ({
			'error' : function (e){ this.trigger("error")}.bind(this.options.channel),
			'success' : this.trigger.bind(this, 'content:change')
		});

		this.on ('content:change', this.addScroll);

		setTimeout( this.maximizeView, 10);

		return this;
	},
	
	'resort' : function ()
	{
		
		
		this.$el.find('.inner-loading').toggleClass((this.options.channel.length)? 'inner-loading': 'inner-empty inner-loading');
		
		
		//;
		
		
		//
				
		//console.log ('--- RESORTING ---');

		var self = this;

		self.$el.find ('p.no-current-messages').remove ();

		// Go trough all messages
		this.options.channel.each (function (message)
		{
			// Is already in the list?
			var current = self.$el.find ('.messages-container .message-view[data-message-id=' + message.get ('id') + ']');
			var element;

			var index = message.collection.indexOf (message);

			if (current.length > 0)
			{
				element = current;
			}
			else
			{

				var messageView = self.getMessageView (message);
				element = messageView.render ().el;

				$(element).attr ('data-message-id', message.get ('id'));

				if (index == 0)
				{
					self.onFirstAdd (message, messageView);
				}
			}

			//console.log (index + ', ' + message.get ('body').plaintext);

			if (index == 0)
			{
				self.$el.find ('.messages-container').prepend (element);
			}
			else
			{
				var previousmessage = message.collection.at (index - 1);

				// Check if previous message is found
				var previouselement = self.$el.find ('.messages-container .message-view[data-message-id=' + previousmessage.get ('id') + ']');

				if (previouselement.length > 0)
				{
					previouselement.after (element);
				}

				else
				{
					console.log ('PREVIOUS MESSAGE NOT FOUND');
				}
			}
		});

		/*setTimeout (function ()
		{
			self.trigger ('content:change');
		}, 1);*/
	},

	'reset' : function ()
	{
		//this.$el.find ('.scroller').slimScroll({'destroy':1});
		this.$el.find ('.messages-container').addClass('inner-loading').html("");
	},
	
	'error' : function ()
	{
		Cloudwalkers.RootView.growl("Monitoring error", "A little hick-up, please try again");
	},
	
	
	
	
	'processMessageView' : function (message, view)
	{
		/*var self = this;
		view.$el.click (function ()
		{
			self.$el.find ('td').removeClass ('active');

			self.currentSelected = view;

			self.currentSelected.$el.find ('td').addClass ('active');
			self.trigger ('select:message', message);
		});*/
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
			//alert (this.options.selectmessage);
			//this.$el.find ('.messages-container').find ('[data-message-id=' + this.options.selectmessage + ']').click ();
		}
	},
	
	'negotiateFunctionalities' : function() { /* Black  Hole */ },
	
	'maximizeView' : function() {
		
		console.log($("#monitorlist .portlet-body"))
		
		var height = $("#inner-content").height() -170;
		$("#monitorlist .portlet-body").css({"height": height + "px", "max-height": height + "px"});
		console.log("maximize");
	},
	
	'addScroll' : function () {
		
		console.log(this.$el);
		
		this.$el.find('.scroller').slimScroll({
			size: '6px',
			color: '#a1b2bd',
			position: 'right',
			height: 'auto',/*$("#inner-content").height() -90 + "px",*/
			alwaysVisible: false,
			railVisible: false,
			disableFadeOut: true
		});
	
	}
});