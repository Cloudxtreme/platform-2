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

		//Get the draft data
		this.draftdata = this.mergedata(this.model.attributes, this.model.getvariation(this.streamid));
		$.extend(this.draftdata, Cloudwalkers.Session.getStream(this.streamid).get("profile"));
	},

	'render' : function ()
	{	
		// Create container view
		var view = Mustache.render(Templates.preview, {networkclass: this.networkclasses[this.network]});
		var template = "template.html";

		this.$el.html (view);
		
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

	/* Not working yet
	'parseforurls' : function(content){

		var newcontent;
		var url_pattern = /(\()((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(\))|(\[)((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(\])|(\{)((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(\})|(<|&(?:lt|#60|#x3c);)((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(>|&(?:gt|#62|#x3e);)|((?:^|[^=\s'"\]])\s*['"]?|[^=\s]\s+)(\b(?:ht|f)tps?:\/\/[a-z0-9\-._~!$'()*+,;=:\/?#[\]@%]+(?:(?!&(?:gt|#0*62|#x0*3e);|&(?:amp|apos|quot|#0*3[49]|#x0*2[27]);[.!&',:?;]?(?:[^a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]|$))&[a-z0-9\-._~!$'()*+,;=:\/?#[\]@%]*)*[a-z0-9\-_~$()*+=\/#[\]@%])/img;
		var urls = content.match(url_pattern);
		
		if(!urls)	return content;
		
		$.each(urls, function(key, url){
			
			while(url.indexOf("ht") != 0)
				url = url.substr(1);

			newcontent = content.replace(url, '<a href="'+url+'">'+url+'</a>');
		});

		return newcontent;
	}*/
});