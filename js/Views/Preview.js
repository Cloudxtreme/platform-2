Cloudwalkers.Views.Preview = Backbone.View.extend({
	
	'id' : "preview",
	'events' : {},
	'networkclasses' : {'facebook' : 'fb', 'twitter' : 'twt', 'google-plus' : 'gp', 'linkedin' : 'li'},
	
	'initialize' : function(options)
	{
		if (options) $.extend(this, options); 
		this.draftdata = this.model.attributes;

		if(this.streamid) this.draftdata = this.mergedata(this.draftdata, this.model.variation(this.streamid));
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
	},

	'mergedata' : function(model, variation)
	{
		if(variation.length == 0){
			return model;
		}

		var newdata = {};
		
		for(var attr in model){
			if(variation[attr] && attr != "body") {
				newdata[attr] = variation[attr];
			}
			else if(attr == "body" && variation["body"].html)
			{
				newdata[attr] = variation[attr];
				console.log("replaced body");
			}
			else newdata[attr] = model[attr];
		}

		return newdata;
	}
});