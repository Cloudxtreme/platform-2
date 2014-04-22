Cloudwalkers.Views.Preview = Backbone.View.extend({
	
	'id' : "preview",
	'events' : {},
	'networkclasses' : {'facebook' : 'fb', 'twitter' : 'twt', 'google-plus' : 'gp', 'linkedin' : 'li'},
	
	'initialize' : function(options)
	{
		if (options) $.extend(this, options); 
		//Get correct stream data
		if(this.streamid) this.draftdata = this.model.variation(this.streamid);
		else this.draftdata = this.model.attributes;
	},

	'render' : function ()
	{
		// Create container view
		var view = Mustache.render(Templates.preview, {networkclass: this.networkclasses[this.network]});
		this.$el.html (view);
		
		// Compose preview template name		
		// i.e. this.model.get("network").token + this.viewtype
		var template = "template.html";
		
		$.get('/assets/previews/' + template, this.fill.bind(this));

		
		return this;
	},
	
	'fill' : function (preview)
	{
		//Random load times
		this.fakeload((Math.random()*1.2)+0.4);

		// Render preview (opacity:0)
		var preview = Mustache.render(preview, this.draftdata);
		this.$el.find("#pv-main").append(preview);
	},

	'fakeload' : function(time)
	{
		$dis = this.$el;

		//Trigger loading
		$dis.find("#pv-main").addClass("pv-load");
		$dis.find(".progress-bar").css('-webkit-transition','width '+time+'s ease-out');

		setTimeout(function(){
			$dis.find("#pv-main").removeClass("pv-load").addClass("pv-loaded");
		},time*1000);
	}
});