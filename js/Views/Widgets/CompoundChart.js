Cloudwalkers.Views.Widgets.CompoundChart = Backbone.View.extend({

	'templatemap' : {
		'2col1row' : ['#col1', '#col2', '#row1'],
		'2row' : ['#row1', '#row2']
	},

	'initialize' : function (options)
	{
		if(options) $.extend(this, options);

		this.charttemplate = "compoundchart"+this.options.template;
		this.template = this.options.template;
		this.charts = this.options.chartdata;
		
	},

	'render' : function ()
	{	
		// Create view
		this.settings = {};
		this.settings.title = this.title;

		this.$el.html (Mustache.render (Templates[this.charttemplate], this.settings));
		this.fill();
		return this;
	},

	'fill' : function(){

		//Hack to prevent double loading
		if(this.filled)	return true;

		$.each(this.charts, function(index, chart){
			
			chart.data.network = this.network;
			chart.data.parentview = this.parentview;

			var view = new Cloudwalkers.Views.Widgets[chart.widget](chart.data).render().el;

			this.parentview.views.push (view);

			this.$el.find(this.templatemap[this.template][index]).append(view);
			
		}.bind(this));

		this.filled = true;
	},
/*
	'fill' : function()
	{	
		if(this.filled)	return true;
		
		//Render data
        this.fillcharts();
        if(this.renderinfos)
        	this.fillinfo(this.settings.reports);

        this.filled = true;	
	},

	'fillcharts' : function()
	{	//Fills charts & adds them to DOM
        var charts = this.charts;

        for(n in charts){
			charts[n].data.model = this.model;
			if(charts[n].data.network)	charts[n].data.network = this.network;
			charts[n].data.type = this.type;
			charts[n].data.title = this.titles[this.type];
			view = new Cloudwalkers.Views.Widgets.Chart(this.charts[n].data);
			this.parent.appendWidget(view, 6);
		};
	},

	'fillinfo' : function(reports)
	{	
		var data;
		var view;

		for(n in reports){			
			this.funcs[reports[n]].data.model = this.model;
			this.funcs[reports[n]].data.network = this.network;
			this.funcs[reports[n]].data.icon = this.icon;
			this.funcs[reports[n]].data.footer = "+ 0 (+ 0%) SINCE LAST 7 DAYS";
			view = new Cloudwalkers.Views.Widgets.Info(this.funcs[reports[n]].data);
			this.parent.appendWidget(view, 3);
		};
		this.parent.appendWidget(null, 0);
	},

	'getstreamcontext' : function(streamid)
	{
		var context = {};
		//var network = Cloudwalkers.Session.getStream(streamid).get("network");
		
		context.reports = this.reports[streamid];
		//context.network = network;
		
		return context;
	},
*/
	'negotiateFunctionalities' : function()
	{

	}
	
});