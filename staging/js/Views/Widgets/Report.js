Cloudwalkers.Views.Widgets.Report = Cloudwalkers.Views.Widgets.Widget.extend ({

	'template' : 'report',
	'initialize' : function()
	{
		this.stream = this.options.stream;
	},

	'render' : function ()
	{
		// Preset template
		this.$el.html (Mustache.render (Templates[this.template], {network: this.stream.get("network")}));
		this.$el.find(".dashboard-stat").addClass("portlet-loading");
		
		// Load report data
		this.stream.reports.hook({success: this.fill.bind(this), error: this.fail.bind(this)});

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
		Cloudwalkers.RootView.growl (this.translateString("oops"), this.translateString("something_went_sideways_please_reload_the_page"));
	},

	'translateString' : function(translatedata)
	{	
		// Translate String
		return Cloudwalkers.Session.polyglot.t(translatedata);
	}
});