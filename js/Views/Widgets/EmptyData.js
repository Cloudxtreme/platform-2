Cloudwalkers.Views.Widgets.EmptyData = Backbone.View.extend({
	
	'title' : "EmptyData",

	'initialize' : function(options)
	{	
		$.extend(this, options);

		if(this.timeparams)
			this.checknow();
	},

	'checknow' : function()
	{		
		var since = this.timeparams.since * 1000;
		var until = this.timeparams.until * 1000;
		var now = moment().utc().valueOf();

		return (now <= until) && (now > since);
	},	

	'render' : function ()
	{	
		var now = this.checknow();
		var span = this.timeparams.span;
		var message;

		if(now)
			message = this.translateString ("empty_statistics_data") + '<br/><a id="subtractempty">'+ this.translateString ("show_previous_"+ span +"_statistics") +'</a>';
		else
			message = this.translateString ("empty_statistics_data") + '<br/><a id="addempty">'+ this.translateString ("show_next_"+ span +"_statistics") +'</a>';

		this.$el.html (Mustache.render (Templates.emptydata, {message: message}));
		return this;
	},

	'translateString' : function(translatedata)
	{	
		// Translate String
		return Cloudwalkers.Session.polyglot.t(translatedata);
	}
});