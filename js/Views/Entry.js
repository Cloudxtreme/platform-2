Cloudwalkers.Views.Entry = Backbone.View.extend({
	
	'tagName' : 'tr',
	
	'initialize' : function ()
	{
		var self = this;
		this.model.on ('change', function ()
		{
			self.render ();	
		});
		
		this.on ('destroy', this.destroy);
	},

	'render' : function ()
	{
		var data = this.options.model.attributes;

		this.$el.html (Mustache.render (Templates[this.options.template], data));
		
		if(this.$el.find("[data-date]"))
			this.time();
		
		return this;
	},
	
	'time' : function ()
	{
		var now = new Date;
		var date = new Date(this.$el.find("[data-date]").attr("data-date"));
		var diff = Math.round((now.getTime()-date.getTime()) *.001);
		var human;
		
		if(diff < 60)			human = "now";
		else if(diff < 3600)	human = Math.round(diff/60) + "m";
		else if(diff < 86400)	human = Math.round(diff/3600) + "h";
		else if(diff < 3888000)	human = Math.round(diff/86400) + "d";
		else					human = "long ago";
		
		this.$el.find("[data-date]").html(human);
		
		this.tm = setTimeout(this.time.bind(this), 6000);
	},
	
	'destroy' : function ()
    {
        window.clearTimeout(this.tm);
    }

});