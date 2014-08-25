Cloudwalkers.Views.Widgets.KeywordsEditor = Cloudwalkers.Views.Widgets.Widget.extend ({

	'events' : {
		'submit form[data-add-category]' : 'addCategory',
		'click button.add-keyword' : 'addKeyword',
		'click button.update-keyword' : 'updateKeyword',
		'click .cancel-edit-keyword' : 'render',
		'click .reset-keyword' : 'resetFilter',
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
		if(filters && !this.scriptloaded){
			this.$el.find ('#keywordseditor').keywordfilterdestroy();
			this.$el.find ('#keywordseditor').keywordfilterscript({
				update : this.translateString('update'),
				cancel: this.translateString('cancel'),
				message_contains: this.translateString('message_contains'),
				message_doesnt_contain: this.translateString('message_doesnt_contain'),
				author_is: this.translateString('author_is'),
				author_is_not: this.translateString('author_is_not'),
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
				insert_author: this.translateString('insert_author'),
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
		$("#keyword_warning .alert").remove();
		console.log(this.keywordFormula().settings.formula);
		if(this.keywordFormula().settings.formula){
			category.channels.create(this.keywordFormula(), {
				parent: catid,
				wait: true,
				error: function(){
					Cloudwalkers.RootView.information (this.translateString("not_saved"), this.translateString("your_formula_is_a_bit_fuzzy"), this.$el.find(".manage-keyword"));
					this.$el.find(".managekeyword .icon-cloud-upload").hide();
				}.bind(this),
				success: function (){
					Cloudwalkers.RootView.growl (this.translateString('manage_keywords'), this.translateString('keyword_filter_has_been_successfully_added'))
				}.bind(this)
			});
			this.$el.find(".managekeyword .icon-cloud-upload").show();
		} else {
			Cloudwalkers.RootView.information (this.translateString("not_saved"), this.translateString("your_formula_is_a_bit_fuzzy"), this.$el.find(".manage-keyword"));
			this.$el.find(".managekeyword .icon-cloud-upload").hide();
		}
	},

	'updateKeyword' : function (e)
	{
		e.preventDefault ();
		
		this.editing.save(
			this.keywordFormula(),
			{success:  function(){
				Cloudwalkers.RootView.growl (this.translateString('manage_keywords'), this.translateString('keyword_filter_has_been_updated'))
			}.bind(this)}
		);

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

		//Fill formula
		//clean formula and split it to an array
		var stringFormula = filters.formula;
		stringFormula = stringFormula.replace(/\(/g, ",(,");
		stringFormula = stringFormula.replace(/\)/g, ",),");
		stringFormula = stringFormula.replace(/ and /gi, ",and,");
		stringFormula = stringFormula.replace(/ or /gi, ",or,");
		stringFormula = stringFormula.split(",");
		
		for(n in stringFormula)
		{
			stringFormula[n] = stringFormula[n].trim();
		}
		
		var stringFormulaClean = $.map(stringFormula, function (el)
		{
		    return el !== '' ? el : null;
		});

		translation = {}
		this.mustacheTranslateRender(translation);

		for(n in stringFormulaClean)
		{
			this.formulaElement(stringFormulaClean[n]);
			this.$el.find("select").chosen({width: "100%"});
		}
		
		$("#keyword_filter #demo_plus").remove();
		this.addPlus('small');

		// Deprecated
		/*$('#filter_include').val(filters.include? filters.include.join(", "): "");
		$('#filter_exclude').val(filters.exclude? filters.exclude.join(", "): "");
		
		for(n in filters.languages) $('#filter_languages option[value="' + filters.languages[n] + '"]').attr("selected", "selected");
		for(n in filters.countries) $('#filter_countries option[value="' + filters.countries[n] + '"]').attr("selected", "selected");*/
		// End deprecated
		
		// Update chosen
		this.$el.find("select").trigger('chosen:updated');
	},

	'addPlus' : function (size){
		
		if(size == "small")
			$("#keyword_filter").append('<span id="demo_plus" class="demo_bubble demo_drop demo_hit_me"><span class="demo_hit_me">+</spam><span class="demo_options"><ul><li class="add_and">' + translation.translate_and + '</li><li class="add_or">' + translation.translate_or + '</li></ul></span></span>');
		if(size == "large")
			$("#keyword_filter").append('<span id="demo_plus" class="demo_bubble demo_drop demo_hit_me"><span class="demo_hit_me">+</spam><span class="demo_options"><ul><li class="add_message_contains">' + translation.translate_message_contains + '</li><li class="add_message_no_contains" class="demo_doesntcontain">' + translation.translate_message_doesnt_contain + '</li><li class="add_author_is">' + translation.translate_author_is + '</li><li class="add_author_is_not">' + translation.translate_author_is_not + '</li><li class="add_country_is">' + translation.translate_country_is + '</li><li class="add_country_is_not">' + translation.translate_country_is_not + '</li><li class="add_language_is">' + translation.translate_language_is + '</li><li class="add_language_is_not">' + translation.translate_language_is_not + '</li><li class="add_group">' + translation.translate_group + '</li></ul></span></span>');
	},

	'formulaElement' : function(e){
		
		//Default values - ID, countries, values
		rand_id = this.getRandomInt(1,999);

		var account = Cloudwalkers.Session.getAccount();

		var filters = account.attributes.filteroptions;

		countries = filters.countries;

		languages = filters.languages;

		var languageslist = "";
		for(n in languages)
		{
			languageslist += '<li class="demo_change_val" data-value="'+languages[n].token+'">'+languages[n].name+'</li>'
		}

		var countrieslist = "";
		for(n in countries)
		{
			countrieslist += '<option value="'+countries[n].token+'">'+countries[n].name+'</option>'
		}
		

		if(e == "or")
			$("#keyword_filter").append('<span  id="' + rand_id + '" class="demo_bubble demo_drop demo_or" data-value="or " ><span class="sel_value">' + translation.translate_or + '</span><i class="demo_hit_me icon-sort-down"></i><span class="demo_options"><ul><li class="demo_change_val" data-value="or" data-text="' + translation.translate_or + '">' + translation.translate_or + '</li><li class="demo_change_val" data-value="and" data-text="' + translation.translate_and + '">' + translation.translate_and + '</li></ul></span><i class="demo_remove_filter icon-remove"></i></span>');

		if(e == "and")
			$("#keyword_filter").append('<span  id="' + rand_id + '" data-string="sel_value" class="demo_bubble demo_drop demo_and" data-value="and " ><span class="sel_value">' + translation.translate_and + '</span><i class="demo_hit_me icon-sort-down"></i><span class="demo_options"><ul><li class="demo_change_val" data-value="and" data-text="' + translation.translate_and + '">' + translation.translate_and + '</li><li class="demo_change_val" data-value="or" data-text="' + translation.translate_or + '">' + translation.translate_or + '</li></ul></span><i class="demo_remove_filter icon-remove"></i></span>');

		if(e == "(")
			$("#keyword_filter").append('<span  id="' + rand_id + '" class="demo_bubble  demo_group" data-option="("><span class="sel_value">' + translation.translate_group + '</span><i class="demo_remove_filter icon-remove"></i></span>');

		if(e == ")")
			$("#keyword_filter").append('<span  id="' + rand_id + '" class="demo_bubble  demo_end_group" data-option=")"><span class="sel_value">' + translation.translate_end_group + '</span><i class="demo_remove_filter icon-remove"></i></span>');

		// Generate language bubble
		if(e.indexOf('language') != -1){
			splitValue = e.split(' ');
			splitValue[2] = splitValue[2].replace(/'/g, "");

			for(n in languages)
			{
				if(languages[n].token == splitValue[2])
					textValue = languages[n].name
			}

			if(splitValue[1] == '!='){
				$("#keyword_filter").append('<span id="' + rand_id + '" class="demo_bubble demo_contains" data-option="language != " data-value="' + splitValue[2] + '">' + translation.translate_language_is_not + '<span class="demo_drop demo_bubble_text"><span class="sel_value">' + textValue + '</span><i class="demo_hit_me icon-sort-down"></i><span class="demo_options" id="languages"><ul>' + languageslist + '</ul></span></span><i class="demo_remove_filter icon-remove"></i></span>');
			} else {				
				$("#keyword_filter").append('<span id="' + rand_id + '" class="demo_bubble demo_contains" data-option="language = " data-value="' + splitValue[2] + '">' + translation.translate_language_is + '<span class="demo_drop demo_bubble_text"><span class="sel_value">' + textValue + '</span><i class="demo_hit_me icon-sort-down"></i><span class="demo_options" id="languages"><ul>' + languageslist + '</ul></span></span><i class="demo_remove_filter icon-remove"></i></span>');
			}
		}

		// Generate country bubble
		if(e.indexOf('country') != -1){
			splitValue = e.split(' ');
			splitValue[2] = splitValue[2].replace(/'/g, "");

			for(n in countries)
			{
				if(countries[n].token == splitValue[2])
					tokenValue = countries[n].token
			}

			if(splitValue[1] == '!='){
				$("#keyword_filter").append('<span id="' + rand_id + '" class="demo_bubble demo_contains" data-option="country != " data-value="' + splitValue[2] + '">' + translation.translate_country_is_not + '<span class="demo_drop demo_bubble_text"><select class="demo_options" id="countries">' + countrieslist + '</select></span><i class="demo_remove_filter icon-remove"></i></span>');
			} else {
				$("#keyword_filter").append('<span id="' + rand_id + '" class="demo_bubble demo_contains" data-option="country = " data-value="' + splitValue[2] + '">' + translation.translate_country_is + '<span class="demo_drop demo_bubble_text"><select class="demo_options" id="countries">' + countrieslist + '</select></span><i class="demo_remove_filter icon-remove"></i></span>');
			}
			$('#keyword_filter select').val(tokenValue).trigger('change');
		}

		// Generate message bubble
		if(e.indexOf('message') != -1){
			//get text
			splitValue = e.split("'");
			textValue = splitValue[1];

			splitValue = e.split(' ');
			splitValue[2] = splitValue[2].replace(/'/g, "");

			if(splitValue[1] == '!contains'){
				$("#keyword_filter").append('<span id="'+ rand_id +'" class="demo_bubble demo_contains" data-option="message !contains ">' + translation.translate_message_doesnt_contain + '<span class="demo_hit_me demo_input_text demo_bubble_text"><span class="text">' + textValue + '</span><span class="demo_options"><input type="text" name="lname" value=""><br><div class="modal-footer toload"><button data-option="save" class="btn" onclick="return false;">' + translation.translate_save + '</button><button data-option="cancel" class="btn btn-primary" onclick="return false;">' + translation.translate_cancel + '</button></div></span></span><i class="demo_remove_filter icon-remove"></i></span>');
			} else {
				$("#keyword_filter").append('<span id="'+ rand_id +'" class="demo_bubble demo_contains" data-option="message contains ">' + translation.translate_message_contains + '<span class="demo_hit_me demo_input_text demo_bubble_text"><span class="text">' + textValue + '</span><span class="demo_options"><input type="text" name="lname" value=""><br><div class="modal-footer toload"><button data-option="save" class="btn" onclick="return false;">' + translation.translate_save + '</button><button data-option="cancel" class="btn btn-primary" onclick="return false;">' + translation.translate_cancel + '</button></div></span></span><i class="demo_remove_filter icon-remove"></i></span>');
			}
		}

		// Generate author bubble
		if(e.indexOf('author') != -1){
			//get text
			splitValue = e.split("'");
			textValue = splitValue[1];

			splitValue = e.split(' ');
			splitValue[2] = splitValue[2].replace(/'/g, "");

			if(splitValue[1] == '!='){
				$("#keyword_filter").append('<span id="'+ rand_id +'" class="demo_bubble demo_contains" data-option="author != ">' + translation.translate_author_is_not + '<span class="demo_hit_me demo_input_text demo_bubble_text"><span class="text">' + textValue + '</span><span class="demo_options"><input type="text" name="lname" value=""><br><div class="modal-footer toload"><button data-option="save" class="btn" onclick="return false;">' + translation.translate_save + '</button><button data-option="cancel" class="btn btn-primary" onclick="return false;">' + translation.translate_cancel + '</button></div></span></span><i class="demo_remove_filter icon-remove"></i></span>');
			} else {
				$("#keyword_filter").append('<span id="'+ rand_id +'" class="demo_bubble demo_contains" data-option="author = ">' + translation.translate_author_is + '<span class="demo_hit_me demo_input_text demo_bubble_text"><span class="text">' + textValue + '</span><span class="demo_options"><input type="text" name="lname" value=""><br><div class="modal-footer toload"><button data-option="save" class="btn" onclick="return false;">' + translation.translate_save + '</button><button data-option="cancel" class="btn btn-primary" onclick="return false;">' + translation.translate_cancel + '</button></div></span></span><i class="demo_remove_filter icon-remove"></i></span>');
			}
		}
	},

	'getRandomInt' : function (min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
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

	'resetFilter':function()
	{
		Cloudwalkers.RootView.confirm 
		(
			this.translateString('are_you_sure_you_want_to_reset_this_filter'), 
			function () 
			{
				$("#keyword_filter").html('');
				this.addPlus('large');
			}.bind(this)
		)
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
			"author_is",
			"author_is_not",
			"country_is",
			"language_is",
			"country_is_not",
			"language_is_not",
			"group",
			"end_group",
			"save",
			"insert_text",
			"insert_author",
			"there_are",
			"groups_left_open_please_close_them_and_resubmit",
			"formula_is_not_valid_add_more_parameters",
			"choose_language",
			"choose_country",
			"and",
			"or",
			"reset",
			"are_you_sure_you_want_to_reset_this_filter",
			"manage_keyword"
		];

		this.translated = [];

		for(k in this.original)
		{
			this.translated[k] = this.translateString(this.original[k]);
			translatelocation["translate_" + this.original[k]] = this.translated[k];
		}
	}
});