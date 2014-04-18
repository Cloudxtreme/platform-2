Cloudwalkers.Views.Preview = Backbone.View.extend({
	
	'id' : "preview",
	'events' : {},
	
	'initialize' : function(options)
	{
		if (options) $.extend(this, options); 
		console.log(options);
		
	},

	'render' : function ()
	{
				
		// Create container view
		var view = Mustache.render(Templates.preview, {network: this.network});
		
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
		var preview = Mustache.render(preview, this.model.attributes);
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