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
		
		// Listen to channel changes
		this.listenTo(Cloudwalkers.Session.getChannels(), 'sync', this.render);
		this.listenTo(Cloudwalkers.Session.getChannels(), 'remove', this.render);
		this.listenTo(Cloudwalkers.Session.getAccount(), 'sync', this.showFilter);
		
	},

	'render' : function (e)
	{
		// Prevent "cancel" page reload
		if(e && e.preventDefault) e.preventDefault();
		
		
		var account = Cloudwalkers.Session.getAccount();

		var filters = account.attributes.filteroptions;
	
		// Check presets
		if(!filters) account.fetch({endpoint: "filteroptions", success: this.render.bind(this)})

		// Data
		var data = {filteroptions: filters, categories: this.channel.channels.models};

		//Mustache Translate Render
		data.title = this.title;
		this.mustacheTranslateRender(data);

		//if filters are filled
		if(filters){
			this.$el.find ('#keywordseditor').keywordfilterscript({
				update : this.translateString('update'),
				cancel: this.translateString('cancel'),
				message_contains: this.translateString('message_contains'),
				message_doesnt_contain: this.translateString('message_doesnt_contain'),
				country_is: this.translateString('country_is'),
				language_is: this.translateString('language_is'),
				country_is_not: this.translateString('country_is_not'),
				language_is_not: this.translateString('language_is_not'),
				group: this.translateString('group'),
				end_group: this.translateString('end_group'),
				and: this.translateString('and'),
				or: this.translateString('or'),
				save: this.translateString('save'),
				there_are: this.translateString('there_are'),
				groups_left_open_please_close_them_and_resubmit: this.translateString('groups_left_open_please_close_them_and_resubmit'),
				formula_is_not_valid_add_more_parameters: this.translateString('formula_is_not_valid_add_more_parameters'),
				choose_language: this.translateString('choose_language'),
				choose_country: this.translateString('choose_country'),
				insert_text: this.translateString('insert_text'),
				countries: filters.countries,
				languages: filters.languages,
				
				success: function(formula) {this.formula = formula}.bind(this)

			});

		}

		this.$el.html (Mustache.render (Templates.keywordseditor, data));
		
		// Chosen
		this.$el.find("select").chosen({width: "100%"});

		if(!filters){
			this.$el.find('#keyword_filter').addClass("hidden");
			this.$el.find('.container-loading').removeClass("hidden");
		}

		return this;
	},
	'showFilter' : function(){
		this.$el.find('#keyword_filter').removeClass("hidden");
		this.$el.find('.container-loading').addClass("hidden");
	},

	'addCategory' : function (e)
	{
		e.preventDefault ();
		
		var object = {name: $("#category_create_name").val()};
		
		this.channel.channels.create(object, {parent: this.channel.id, wait: true});

		this.$el.find(".addcategory .icon-cloud-upload").show();
	},
	
	'addKeyword' : function (e)
	{
		e.preventDefault ();
		
		var catid = Number($("#keyword_manage_category").val())
		
		// Check selected
		if(!catid) return Cloudwalkers.RootView.alert(this.translateString("dont_forget_to_select_a_category"));
		
		var category = Cloudwalkers.Session.getChannel(catid);
		
		//category.channels.create(this.keywordParameters(), {parent: catid, wait: true, error: function(){
		category.channels.create(this.keywordFormula(), {parent: catid, wait: true, error: function(){
			
			Cloudwalkers.RootView.information (this.translateString("not_saved"), this.translateString("your_formula_is_a_bit_fuzzy"), this.$el.find(".manage-keyword"));
			this.$el.find(".managekeyword .icon-cloud-upload").hide();
			
		}.bind(this)});

		this.$el.find(".managekeyword .icon-cloud-upload").show();
	},
	
	'fillKeyword' : function (id, e)
	{
		e.preventDefault ();
		
		// Reset editor
		this.render();
		this.$el.find(".add-keyword, .edit-keyword").toggleClass("inactive");
		
		// Collect keyword
		var keyword = this.editing = Cloudwalkers.Session.getChannel(id);
		var filters = keyword.get("settings");
		
		$('#keyword_manage_category option[value="' + keyword.get("parent") + '"]').attr("selected", "selected");
		$('#keyword_manage_name').val(keyword.get("name"));
		$('#filter_formula').val(filters.formula? filters.formula: "");
		
		
		// Deprecated
		$('#filter_include').val(filters.include? filters.include.join(", "): "");
		$('#filter_exclude').val(filters.exclude? filters.exclude.join(", "): "");
		
		for(n in filters.languages) $('#filter_languages option[value="' + filters.languages[n] + '"]').attr("selected", "selected");
		for(n in filters.countries) $('#filter_countries option[value="' + filters.countries[n] + '"]').attr("selected", "selected");
		// End deprecated
		
		// Update chosen
		this.$el.find("select").trigger('chosen:updated');
	},
	
	'updateKeyword' : function (e)
	{
		e.preventDefault ();
		
		this.editing.save(this.keywordParameters());

		this.$el.find(".managekeyword .icon-cloud-upload").show();
	},

	'keywordFormula' : function()
	{	
		var object = {name: $("#keyword_manage_name").val(), settings: {}};

		object.settings.formula = this.formula;

		return object;
	},
	
	'keywordParameters' : function()
	{
		var object = {name: $("#keyword_manage_name").val(), settings: {}};
		
		if ($("#filter_formula").val()) object.settings.formula = $("#filter_formula").val();
		
		// Deprecated
		if($("#filter_include").val()) object.settings.include = $("#filter_include").val().split(",");
		if($("#filter_exclude").val()) object.settings.exclude = $("#filter_exclude").val().split(",");
		
		if (object.settings.include && object.settings.include.length)
			for (n in object.settings.include) object.settings.include[n] = object.settings.include[n].trim();
			
		if (object.settings.exclude && object.settings.exclude.length)
			for (n in object.settings.exclude) object.settings.exclude[n] = object.settings.exclude[n].trim();
		
		object.settings.languages = $("#filter_languages").val();
		object.settings.countries = $("#filter_countries").val();
		// End Deprecated
		
		return object;
	},

	'toggleFilter' : function (e)
	{
		e.preventDefault ();
		
		var filter = $(e.target).attr("data-keyword-filter");
		
		this.$el.find("div[data-keyword-filter=" + filter + "]").toggleClass("inactive");
	},
	'translateString' : function(translatedata)
	{	
		// Translate String
		return Cloudwalkers.Session.polyglot.t(translatedata);
	},

	'mustacheTranslateRender' : function(translatelocation)
	{
		// Translate array
		this.original  = [
			"add_category",
			"name",
			"create",
			"add_keyword",
			"keyword_name",
			"category",
			"select_category",
			"fine-tune",
			"filters",
			"include",
			"exclude",
			"languages",
			"countries",
			"use_comma_separated_words",
			"language",
			"country",
			"select_from_list",
			"all_languages",
			"global",
			"update",
			"cancel",
			"message_contains",
			"message_doesnt_contain",
			"country_is",
			"language_is",
			"country_is_not",
			"language_is_not",
			"group",
			"end_group",
			"save",
			"insert_text",
			"there_are",
			"groups_left_open_please_close_them_and_resubmit",
			"formula_is_not_valid_add_more_parameters",
			"choose_language",
			"choose_country"
		];

		this.translated = [];

		for(k in this.original)
		{
			this.translated[k] = this.translateString(this.original[k]);
			translatelocation["translate_" + this.original[k]] = this.translated[k];
		}
	}
});