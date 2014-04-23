Cloudwalkers.Views.Preview = Backbone.View.extend({
	
	'id' : "preview",
	'events' : {},
	'networkclasses' : {'facebook' : 'fb', 'twitter' : 'twt', 'google-plus' : 'gp', 'linkedin' : 'li'},
	'events' : {
		'click #viewsummary' : 'togglesummary'
	},
	
	'initialize' : function(options)
	{
		if (options) $.extend(this, options); 
		///console.log(Cloudwalkers.Session.getStream(this.streamid));

		this.draftdata = this.mergedata(this.model.attributes, this.model.variation(this.streamid));
		$.extend(this.draftdata, Cloudwalkers.Session.getStream(this.streamid).get("profile"));
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
		
		if(this.model.hasAttachement("link"))	this.$el.find("#network").addClass("link"); 
		if(img = this.model.hasAttachement("image")){
			this.draftdata.image = img.data;
			this.$el.find("#network").addClass("img"); 
		}

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

		var dataclone = {};

		$.extend(dataclone, model);
		$.extend(dataclone, variation)

		return dataclone;
	},

	'togglesummary' : function(){
		this.$el.find('.pv-url-content').toggle();
	}
});