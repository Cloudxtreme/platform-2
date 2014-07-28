Cloudwalkers.Views.Widgets.DashboardWebcare = Backbone.Collection.extend ({

	'initialize' : function(options)
	{
		if(options) $.extend(this, options);

	},

	'render' : function(){

		console.log(this.$el)
		this.webcareTouch();

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

		this.model.fetch({endpoint: 'messageids', success: this.webcareCount() });
	},

	'webcareCount' : function(reponse){
		console.log(response)
	},
	
	'fail' : function ()
	{
		Cloudwalkers.RootView.growl ("Oops", "Something went sideways, please reload the page.");
	}
});