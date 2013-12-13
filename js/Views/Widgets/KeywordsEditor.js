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
	
	// Hack
	'forceChange' : function(channels)
	{
		console.log("brute force");
		
		setTimeout(function(){
			
			window.localStorage.clear();
			window.location.reload();
			
		}, 100)
		
	},

	'render' : function (e)
	{
		// Prevent "cancel" page reload
		if(e && e.preventDefault) e.preventDefault();
		
		
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
		
		this.channel.post(object, this.forceChange)

		this.$el.find(".addcategory .icon-cloud-upload").show();

	},
	
	'addKeyword' : function (e)
	{
		e.preventDefault ();
		
		var category = Cloudwalkers.Session.getChannel(Number($("#keyword_manage_category").val()));
		
		category.post(this.keywordParameters(), this.forceChange);

		this.$el.find(".managekeyword .icon-cloud-upload").show();

	},
	
	'fillKeyword' : function (e)
	{
		e.preventDefault ();
		
		// Reset editor
		this.render();
		this.$el.find(".add-keyword, .edit-keyword").toggleClass("inactive");
		
		// Collect keyword
		var id = Number($(e.target).attr("data-edit-keyword-id"));
		var keyword = this.editing = Cloudwalkers.Session.getChannel(id);
		var filters = keyword.get("settings");
		
		$('#keyword_manage_category option[value="' + keyword.get("parent") + '"]').attr("selected", "selected");
		$('#keyword_manage_name').val(keyword.get("name"));
		$('#filter_include').val(filters.include);
		$('#filter_exclude').val(filters.exclude);
		
		for(n in filters.languages) $('#filter_languages option[value="' + filters.languages[n] + '"]').attr("selected", "selected");
		for(n in filters.countries) $('#filter_countries option[value="' + filters.countries[n] + '"]').attr("selected", "selected");
		
		// Update chosen
		this.$el.find("select").trigger('chosen:updated');
		
	},
	
	'updateKeyword' : function (e)
	{
		e.preventDefault ();
		
		this.editing.save(this.keywordParameters(), {success: this.forceChange});

		this.$el.find(".managekeyword .icon-cloud-upload").show();

	},
	
	'keywordParameters' : function()
	{
		var object = {name: $("#keyword_manage_name").val(), settings: {}};
		
		object.settings.include = $("#filter_include").val();
		object.settings.exclude = $("#filter_exclude").val();
		object.settings.languages = $("#filter_languages").val();
		object.settings.countries = $("#filter_countries").val();
		
		return object;
	},

	'toggleFilter' : function (e)
	{
		e.preventDefault ();
		
		var filter = $(e.target).attr("data-keyword-filter");
		
		this.$el.find("div[data-keyword-filter=" + filter + "]").toggleClass("inactive");
		
	}
});