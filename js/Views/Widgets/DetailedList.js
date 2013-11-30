/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.DetailedList = Cloudwalkers.Views.Widgets.MessageContainer.extend({

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
			
			self.maximizeView();
			
			if (self.currentSelected)
			{
				self.currentSelected.$el.find ('td').addClass ('active');
			}
			
		});

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
			//alert (this.options.selectmessage);
			this.$el.find ('.messages-container').find ('[data-message-id=' + this.options.selectmessage + ']').click ();
		}
	},
	
	'maximizeView' : function() {
		
		var height = $("#inner-content").height() -90 ;
		
		$("#inboxcontainer, #list .portlet-body").css({"height": height + "px", "max-height": height + "px"});
		
		this.addScroll();
		
	},
	
	'addScroll' : function () {

		this.$el.find('.scroller').slimScroll({
			size: '6px',
			color: '#a1b2bd',
			position: 'right',
			height: 'auto',/*$("#inner-content").height() -90 + "px",*/
			alwaysVisible: false,
			railVisible: false,
			disableFadeOut: true
		});
		
		
		/*$('.scroller').each(function () {
			$(this).slimScroll({
				size: '7px',
				color: '#a1b2bd',
				position: isRTL ? 'left' : 'right',
				height: $(this).attr("data-height"),
				alwaysVisible: ($(this).attr("data-always-visible") == "1" ? true : false),
				railVisible: ($(this).attr("data-rail-visible") == "1" ? true : false),
				disableFadeOut: true
			});
		});*/
	}


});