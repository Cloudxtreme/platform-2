Cloudwalkers.Views.Widgets.DashboardWebcare = Cloudwalkers.Views.Widgets.Widget.extend ({

	'template' : 'reportwebcare',
	'typestring' : 'accounts',
	'initialize' : function()
	{

		this.stream = this.options.stream;
		this.messages = new Cloudwalkers.Collections.Messages()
	},

	'render' : function ()
	{
		console.log(this.messages)
		// Preset template
		this.$el.html (Mustache.render (Templates[this.template], this.options));
		//this.$el.find(".dashboard-stat").addClass("portlet-loading");		
		
		this.assigned = '1'

		//this.messages.touch(this.messages, { assigned: this.assigned } );

		return this;
	},
	
	'fill' : function ()
	{	
		var report = this.stream.reports.findWhere({token: this.options.type});
		
		if(!report) return null;
		
		var data = {
			dashboard: this.options.dashboard,
			streamid: this.stream.id,
			network: this.stream.get("network"),
			details: report.getDetails()
		}
		
		this.$el.html (Mustache.render (Templates[this.template], data));
		
		this.trigger ('content:change');

	},
	
	'fail' : function ()
	{
		Cloudwalkers.RootView.growl ("Oops", "Something went sideways, please reload the page.");
	}
});