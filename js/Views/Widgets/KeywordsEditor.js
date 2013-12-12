Cloudwalkers.Views.Widgets.KeywordsEditor = Cloudwalkers.Views.Widgets.Widget.extend ({

	'events' : {
		'submit form[data-add-category]' : 'addCategory',
		'click button.add-keyword' : 'addKeyword',
		'click button.update-keyword' : 'updateKeyword',
		'click .cancel-edit-keyword' : 'render',
		'click button[data-keyword-filter]' : 'toggleFilter'
	},
	
	'initialize' : function ()
	{
		this.channel = Cloudwalkers.Session.getChannel("monitoring");
		
		// Listen to categories
		this.listenTo(this.channel, 'change:channels', this.render);
	},

	'render' : function ()
	{
		var account = Cloudwalkers.Session.getAccount();
		var filters = account.get("filteroptions");
		
		// Check presets
		if(!filters) account.fetch({endpoint: "filteroptions", success: this.render.bind(this)})

		// Data
		var data = {filteroptions: filters, categories: this.channel.get("channels")};
		
		this.$el.html (Mustache.render (Templates.keywordseditor, data));
		
		// Chosen
		this.$el.find("select").chosen({width: "100%"});
		
		return this;
	},
	
	'addCategory' : function (e)
	{
		e.preventDefault ();
		
		var object = {name: $("#category_create_name").val()};
		
		this.channel.post(object)

		this.$el.find(".addcategory .icon-cloud-upload").show();

	},
	
	'addKeyword' : function (e)
	{
		e.preventDefault ();
		
		var category = Cloudwalkers.Session.getChannel(Number($("#keyword_manage_category").val()));
		
		category.post(this.keywordParameters());

		this.$el.find(".managekeyword .icon-cloud-upload").show();

	},
	
	'updateKeyword' : function (e)
	{
		e.preventDefault ();
		
		var category = Cloudwalkers.Session.getChannel(Number($("#keyword_manage_category").val()));
		
		category.save(this.keywordParameters());

		this.$el.find(".managekeyword .icon-cloud-upload").show();

	},

	'toggleFilter' : function (e)
	{
		e.preventDefault ();
		
		var filter = $(e.target).attr("data-keyword-filter");
		
		this.$el.find("div[data-keyword-filter=" + filter + "]").toggleClass("inactive");
		
	}
});