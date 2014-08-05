Cloudwalkers.Views.Widgets.DashboardWebcare = Backbone.View.extend ({

	'initialize' : function(options)
	{
		if(options) $.extend(this, options);

	},

	'render' : function(){	

		this.webcareTouch();

		this.$el.html (Mustache.render (Templates.reportwebcare, this));

		this.$container = this.$el.find('.number');

		this.$container.html("--")

		return this;
	},

	'webcareTouch' : function(){

		var params = "?";
		if(this.assigned)		params += "assigned=" + this.assigned + "&";
		if(this.assigneduser)	params += "assigneduser=" + this.assigneduser + "&";
		if(this.status)			params += "status=" + this.status;

		this.model = new Cloudwalkers.Models.Message();
		this.typestring = 'accounts';
		this.model.parameters = params;

		this.model.fetch({endpoint: 'messageids', success: this.webcareCount.bind(this) });

	},

	'webcareCount' : function(model, response){
		
		this.count = response.account.messages.length;
		this.$container.html(this.count)
		
	},
	
	'fail' : function ()
	{
		Cloudwalkers.RootView.growl ("Oops", "Something went sideways, please reload the page.");
	}
});