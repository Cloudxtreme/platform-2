/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.MonitorList = Cloudwalkers.Views.Widgets.DetailedList.extend({

	'id' : 'monitorparent',

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
		 
		this.options.channel.bind('sort', this.fill, this);
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
	
	'fill' : function ()
	{
		
		this.$el.find('.inner-loading').toggleClass((this.options.channel.length)? 'inner-loading': 'inner-empty inner-loading');
		
		// Go trough all messages
		this.options.channel.each (function (message)
		{
			
			message.attributes.network = message.getStream ().attributes.network;
			
			//console.log(message.attributes.network)
			
			var parameters = {
				'model' : message,
				'template' : 'keywordentry',
			};
			
			

			var messageView = new Cloudwalkers.Views.Entry (parameters);
			var	element = messageView.render ().el;
			
			//$(element).attr ('data-message-id', message.get ('id'));
			
			this.$el.find ('.messages-container').append(element);
			
		}.bind(this));
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
	
	'maximizeView' : function() {
		
		var height = $("#inner-content").height() -170;
		$("#monitorlist .portlet-body").css({"height": height + "px", "max-height": height + "px"});
	}
});