Cloudwalkers.Views.Share = Backbone.View.extend({

	'events' : {
		'click .notification-toggle' : 'toggleNotifications'
	},

	'initialize' : function ()
	{
		
	},
	
	'fit' : function ()
	{
		$('#share').html (this.render().el);
	},

	'render' : function ()
	{
		
		var param = {streams: [{icon: "twitter", name: "bmgroup"}, {icon: "facebook", name: "bmgroup"}, {icon: "linkedin", name: "Cloudwalkers"}]};
		
		this.$el.html (Mustache.render(Templates.share, param));
				
		return this;
	},
	
	'show' : function ()
	{
		$('#share').removeClass("collapsed");
		$('#sidebar, #inner-content').addClass("collapsed");
		
		this.spanheight();
	},
	
	'hide' : function ()
	{
		$('#share').addClass("collapsed");
		$('#sidebar, #inner-content').removeClass("collapsed");
	},
	
	'toggle' : function ()
	{
		if($("#share").hasClass("collapsed"))	this.show();
		else									this.hide();
	},
	
	'spanheight' : function()
	{
		this.$el.height($(".page-container").height()+"px");
	}

});