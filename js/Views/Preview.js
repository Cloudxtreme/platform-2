Cloudwalkers.Views.Preview = Backbone.View.extend({
	
	'id' : "preview",
	'events' : {},
	
	'initialize' : function(options)
	{
		if (options) $.extend(this, options); 
		
	},

	'render' : function ()
	{
				
		// Create container view
		var view = Mustache.render(Templates.preview, {network: this.network});
		this.$el.html (view);
		
		// Trigger first part of loading sequence (should happen before $.get)
		
		// Compose preview template name		
		// i.e. this.model.get("network").token + this.viewtype
		var template = "template.html";
		
		$.get('/assets/previews/' + template, this.fill.bind(this));

		
		return this;
	},
	
	'fill' : function (preview)
	{
		// Render preview
		var preview = Mustache.render(preview, this.model.attributes);
		
		this.$el.find(".container").html(preview);
		
		// Trigger second part of loading sequence
		// Make .container visible at end of second loading sequence
	}
	
});