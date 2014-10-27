define(
	['Views/Panels/Panel', 'mustache', 'Utilities/keyword_filter'],
	function (Panel, Mustache, keywordfilterscript)
	{
		var KeywordsEditor = Panel.extend ({

			events : {
				'submit form[data-add-category]' : 'addCategory',
				'click button.add-keyword' : 'addKeyword',
				'click button.update-keyword' : 'updateKeyword',
				'click .cancel-edit-keyword' : 'render',
				'click .reset-keyword' : 'resetFilter',
				'click button[data-keyword-filter]' : 'toggleFilter'
			},

			options : {},
			
			initialize : function (options)
			{
				if(options)	$.extend(this.options, options);
				
				this.channel = Cloudwalkers.Session.getChannel("monitoring");
				
				// Listen to channel changes
				this.listenTo(Cloudwalkers.Session.getChannels(), 'sync', this.render);
				this.listenTo(Cloudwalkers.Session.getChannels(), 'remove', this.render);
				this.listenTo(Cloudwalkers.Session.getAccount(), 'sync', this.showFilter);
			},

			render : function (e)
			{
				// Prevent "cancel" page reload
				if(e && e.preventDefault) e.preventDefault();				
				
				var account = Cloudwalkers.Session.getAccount();
				var filters = account.attributes.filteroptions;
			
				// Check presets
				if(!filters) account.fetch({endpoint: "filteroptions", success: this.render.bind(this)})

				// Data
				var data = {filteroptions: filters, categories: this.channel.channels.models};

				//if filters are filled
				if(filters && !this.scriptloaded){
					this.$el.find ('#keywordseditor').keywordfilterdestroy();
					this.$el.find ('#keywordseditor').keywordfilterscript({
						update : trans("Update"),
						cancel: trans("Cancel"),
						message_contains: trans("message contains"),
						message_doesnt_contain: trans("message doesn't contain"),
						author_is: trans("author is"),
						author_is_not: trans("author is not"),
						country_is: trans("country is"),
						language_is: trans("language is"),
						country_is_not: trans("country is not"),
						language_is_not: trans("language is not"),
						group: trans("group"),
						end_group: trans("end group"),
						and: trans("and"),
						or: trans("or"),
						save: trans("Save"),
						there_are: trans("There are"),
						groups_left_open_please_close_them_and_resubmit: trans("groups left open. Please close them and resubmit"),
						formula_is_not_valid_add_more_parameters: trans("Formula is not valid. Add more parameters"),
						choose_language: trans("Choose language"),
						choose_country: trans("Choose country"),
						insert_text: trans("insert text"),
						insert_author: trans("insert author"),
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

			showFilter : function(){
				this.$el.find('#keyword_filter').removeClass("hidden");
				this.$el.find('.container-loading').addClass("hidden");
			},

			addCategory : function (e)
			{
				e.preventDefault ();
				
				var object = {
					name: $("#category_create_name").val(),
					remember: $("#category_create_remember").val()
				};
				
				this.channel.channels.create(object, {parent: this.channel.id, wait: true});

				this.$el.find(".addcategory .icon-cloud-upload").show();
			},
			
			addKeyword : function (e)
			{
				e.preventDefault ();
				
				var catid = Number($("#keyword_manage_category").val())
				
				// Clear infos
				$("#keywordsfilter * .alert").remove();
				
				// Check Category
				if(!catid) return Cloudwalkers.RootView.alert(trans("Don't forget to select a category."));
				
				var category = Cloudwalkers.Session.getChannel(catid);

				// Check Name
				if(!this.keywordFormula().name) return Cloudwalkers.RootView.alert(trans("Don't forget to fill the keyword name"));

				// Check Formula
				if(!this.keywordFormula().settings.formula) return Cloudwalkers.RootView.alert(trans("Please add a filter to your keyword."));
				
				//category.channels.create(this.keywordParameters(), {parent: catid, wait: true, error: function(){
				category.channels.create(this.keywordFormula(), {
					parent: catid,
					wait: true,
					error: function(){
						Cloudwalkers.RootView.information (trans("Not saved"), trans("Something went wrong"), this.$el.find(".manage-keyword"));
						this.$el.find(".managekeyword .icon-cloud-upload").hide();
					}.bind(this),
					success: function (){
						Cloudwalkers.RootView.growl (trans("Manage Keywords"), trans("Keyword filter has been successfully added"))
					}.bind(this)
				});
				this.$el.find(".managekeyword .icon-cloud-upload").show();
			},

			updateKeyword : function (e)
			{
				e.preventDefault ();
				
				// Check Name
				if(!this.keywordFormula().name) return Cloudwalkers.RootView.alert(trans("Don't forget to fill the keyword name"));
				
				// Check Formula
				if(this.keywordFormula().settings.formula){

					this.editing.endpoint = '';

					this.editing.save(
						this.keywordFormula(),
						{	
							success:  function(){
								Cloudwalkers.RootView.growl (trans("Manage Keywords"), trans("Keyword filter has been updated"))
							}.bind(this),
							error: function(){
								Cloudwalkers.RootView.growl (trans("Not saved"), trans("Something went wrong"));
							}.bind(this)
						}
					);
				}

				this.$el.find(".managekeyword .icon-cloud-upload").show();

			},
			
			fillKeyword : function (id, e)
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
				
				for (var n in stringFormula)
				{
					stringFormula[n] = stringFormula[n].trim();
				}
				
				var stringFormulaClean = $.map(stringFormula, function (el)
				{
				    return el !== '' ? el : null;
				});

				for (var m in stringFormulaClean)
				{
					this.formulaElement(stringFormulaClean[m]);
					this.$el.find("select").chosen({width: "100%"});
				}
				
				$("#keyword_filter #demo_plus").remove();
				this.addPlus('small');


				// Update chosen
				this.$el.find("#keyword_manage_category").trigger('chosen:updated');

				// Deprecated
				/*$('#filter_include').val(filters.include? filters.include.join(", "): "");
				$('#filter_exclude').val(filters.exclude? filters.exclude.join(", "): "");
				
				for (var n in filters.languages) $('#filter_languages option[value="' + filters.languages[n] + '"]').attr("selected", "selected");
				for (var n in filters.countries) $('#filter_countries option[value="' + filters.countries[n] + '"]').attr("selected", "selected");*/
				// End deprecated
				
			},

			addPlus : function (size){
				
				if(size == "small")
					$("#keyword_filter").append('<span id="demo_plus" class="demo_bubble demo_drop demo_hit_me"><span class="demo_hit_me">+</spam><span class="demo_options"><ul><li class="add_and">' + trans('and') + '</li><li class="add_or">' + trans("or") + '</li></ul></span></span>');
				if(size == "large")
					$("#keyword_filter").append('<span id="demo_plus" class="demo_bubble demo_drop demo_hit_me"><span class="demo_hit_me">+</spam><span class="demo_options"><ul><li class="add_message_contains">' + trans('message contains') + '</li><li class="add_message_no_contains" class="demo_doesntcontain">' + trans('message doesnt containt') + '</li><li class="add_author_is hidden">' + trans('author is') + '</li><li class="add_author_is_not hidden">' + trans('author is not') + '</li><li class="add_country_is">' + trans('country is') + '</li><li class="add_country_is_not">' + trans('country is not') + '</li><li class="add_language_is">' + trans('language is') + '</li><li class="add_language_is_not">' + trans('language is not') + '</li><li class="add_group">' + trans('group') + '</li></ul></span></span>');
			},

			formulaElement : function(e){
				
				//Default values - ID, countries, values
				rand_id = this.getRandomInt(1,999);

				var account = Cloudwalkers.Session.getAccount();

				var filters = account.attributes.filteroptions;

				countries = filters.countries;

				languages = filters.languages;

				var languageslist = "";
				for (var n in languages)
				{
					languageslist += '<option value="'+languages[n].token+'">'+languages[n].name+'</option>'
				}

				var countrieslist = "";
				for (var m in countries)
				{
					countrieslist += '<option value="'+countries[m].token+'">'+countries[m].name+'</option>'
				}
				

				if(e == "or")
					$("#keyword_filter").append('<span  id="' + rand_id + '" class="demo_bubble demo_drop demo_or" data-value="or " ><span class="sel_value">' + trans('or') + '</span><i class="demo_hit_me icon-sort-down"></i><span class="demo_options"><ul><li class="demo_change_val" data-value="or" data-text="' + trans('or') + '">' + trans('or') + '</li><li class="demo_change_val" data-value="and" data-text="' + trans('and') + '">' + trans('and') + '</li></ul></span><i class="demo_remove_filter icon-remove"></i></span>');

				if(e == "and")
					$("#keyword_filter").append('<span  id="' + rand_id + '" data-string="sel_value" class="demo_bubble demo_drop demo_and" data-value="and " ><span class="sel_value">' + trans('and') + '</span><i class="demo_hit_me icon-sort-down"></i><span class="demo_options"><ul><li class="demo_change_val" data-value="and" data-text="' + trans('and') + '">' + trans('and') + '</li><li class="demo_change_val" data-value="or" data-text="' + trans('or') + '">' + trans('or') + '</li></ul></span><i class="demo_remove_filter icon-remove"></i></span>');

				if(e == "(")
					$("#keyword_filter").append('<span  id="' + rand_id + '" class="demo_bubble  demo_group" data-option="("><span class="sel_value">' + trans('group') + '</span><i class="demo_remove_filter icon-remove"></i></span>');

				if(e == ")")
					$("#keyword_filter").append('<span  id="' + rand_id + '" class="demo_bubble  demo_end_group" data-option=")"><span class="sel_value">' + trans('end group') + '</span><i class="demo_remove_filter icon-remove"></i></span>');

				// Generate language bubble
				if(e.indexOf('language') != -1){
					splitValue = e.split(' ');
					splitValue[2] = splitValue[2].replace(/'/g, "");

					for (var l in languages)
					{
						if(languages[l].token.toLowerCase() == splitValue[2].toLowerCase())
							tokenValue = languages[l].token.toLowerCase();
					}

					if(tokenValue){
						if(splitValue[1] == '!='){
							$("#keyword_filter").append('<span id="' + rand_id + '" class="demo_bubble demo_contains" data-option="language != " data-value="' + splitValue[2] + '">' + trans('language is not') + '<span class="demo_drop demo_bubble_text"><select class="demo_options" id="languages">' + languageslist + '</select></span><i class="demo_remove_filter icon-remove"></i></span>');
						} else {
							$("#keyword_filter").append('<span id="' + rand_id + '" class="demo_bubble demo_contains" data-option="language = " data-value="' + splitValue[2] + '">' + trans('language is') + '<span class="demo_drop demo_bubble_text"><select class="demo_options" id="languages">' + languageslist + '</select></span><i class="demo_remove_filter icon-remove"></i></span>');
						}
						// Update chosen
						$('#' + rand_id + ' select').val(tokenValue).trigger('change');
					}
				}

				// Generate country bubble
				if(e.indexOf('country') != -1){
					splitValue = e.split(' ');
					splitValue[2] = splitValue[2].replace(/'/g, "");

					for (var c in countries)
					{
						if(countries[c].token.toUpperCase() == splitValue[2].toUpperCase())
							tokenValue = countries[c].token.toUpperCase();
					}

					if(tokenValue){
						if(splitValue[1] == '!='){
							$("#keyword_filter").append('<span id="' + rand_id + '" class="demo_bubble demo_contains" data-option="country != " data-value="' + splitValue[2] + '">' + trans('country is not') + '<span class="demo_drop demo_bubble_text"><select class="demo_options" id="countries">' + countrieslist + '</select></span><i class="demo_remove_filter icon-remove"></i></span>');
						} else {
							$("#keyword_filter").append('<span id="' + rand_id + '" class="demo_bubble demo_contains" data-option="country = " data-value="' + splitValue[2] + '">' + trans('country is') + '<span class="demo_drop demo_bubble_text"><select class="demo_options" id="countries">' + countrieslist + '</select></span><i class="demo_remove_filter icon-remove"></i></span>');
						}
						// Update chosen
						$('#' + rand_id + ' select').val(tokenValue).trigger('change');
					}
				}

				// Generate message bubble
				if(e.indexOf('message') != -1){
					//get text
					splitValue = e.split("'");
					textValue = splitValue[1];

					splitValue = e.split(' ');
					splitValue[2] = splitValue[2].replace(/'/g, "");

					if(splitValue[1] == '!contains'){
						$("#keyword_filter").append('<span id="'+ rand_id +'" class="demo_bubble demo_contains" data-option="message !contains ">' + trans('message doesnt containt') + '<span class="demo_hit_me demo_input_text demo_bubble_text"><span class="text">' + textValue + '</span><span class="demo_options"><input type="text" name="lname" value=""><br><div class="modal-footer toload"><button data-option="save" class="btn" onclick="return false;">' + trans('save') + '</button><button data-option="cancel" class="btn btn-primary" onclick="return false;">' + trans('cancel') + '</button></div></span></span><i class="demo_remove_filter icon-remove"></i></span>');
					} else {
						$("#keyword_filter").append('<span id="'+ rand_id +'" class="demo_bubble demo_contains" data-option="message contains ">' + trans('message contains') + '<span class="demo_hit_me demo_input_text demo_bubble_text"><span class="text">' + textValue + '</span><span class="demo_options"><input type="text" name="lname" value=""><br><div class="modal-footer toload"><button data-option="save" class="btn" onclick="return false;">' + trans('save') + '</button><button data-option="cancel" class="btn btn-primary" onclick="return false;">' + trans('cancel') + '</button></div></span></span><i class="demo_remove_filter icon-remove"></i></span>');
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
						$("#keyword_filter").append('<span id="'+ rand_id +'" class="demo_bubble demo_contains" data-option="author != ">' + trans('author is not') + '<span class="demo_hit_me demo_input_text demo_bubble_text"><span class="text">' + textValue + '</span><span class="demo_options"><input type="text" name="lname" value=""><br><div class="modal-footer toload"><button data-option="save" class="btn" onclick="return false;">' + trans('save') + '</button><button data-option="cancel" class="btn btn-primary" onclick="return false;">' + trans('cancel') + '</button></div></span></span><i class="demo_remove_filter icon-remove"></i></span>');
					} else {
						$("#keyword_filter").append('<span id="'+ rand_id +'" class="demo_bubble demo_contains" data-option="author = ">' + trans('author is') + '<span class="demo_hit_me demo_input_text demo_bubble_text"><span class="text">' + textValue + '</span><span class="demo_options"><input type="text" name="lname" value=""><br><div class="modal-footer toload"><button data-option="save" class="btn" onclick="return false;">' + trans('save') + '</button><button data-option="cancel" class="btn btn-primary" onclick="return false;">' + trans('cancel') + '</button></div></span></span><i class="demo_remove_filter icon-remove"></i></span>');
					}
				}
			},

			getRandomInt : function (min, max) {
			    return Math.floor(Math.random() * (max - min + 1)) + min;
			},

			keywordFormula : function()
			{	
				var object = {name: $("#keyword_manage_name").val(), settings: {}};

				object.settings.formula = "";
				object.settings.formula = this.formula;

				return object;
			},
			
			keywordParameters : function()
			{
				var object = {name: $("#keyword_manage_name").val(), settings: {}};
				
				if ($("#filter_formula").val()) object.settings.formula = $("#filter_formula").val();
				
				// Deprecated
				if($("#filter_include").val()) object.settings.include = $("#filter_include").val().split(",");
				if($("#filter_exclude").val()) object.settings.exclude = $("#filter_exclude").val().split(",");
				
				if (object.settings.include && object.settings.include.length)
					for (var n in object.settings.include) object.settings.include[i] = object.settings.include[n].trim();
					
				if (object.settings.exclude && object.settings.exclude.length)
					for (var m in object.settings.exclude) object.settings.exclude[j] = object.settings.exclude[m].trim();
				
				object.settings.languages = $("#filter_languages").val();
				object.settings.countries = $("#filter_countries").val();
				// End Deprecated
				
				return object;
			},

			resetFilter :function()
			{
				Cloudwalkers.RootView.confirm 
				(
					trans("Are you sure you want to reset this filter?"), 
					function () 
					{
						$("#keyword_filter").html('');
						this.addPlus('large');
					}.bind(this)
				)
			},

			toggleFilter : function (e)
			{
				e.preventDefault ();
				
				var filter = $(e.target).attr("data-keyword-filter");
				
				this.$el.find("div[data-keyword-filter=" + filter + "]").toggleClass("inactive");
			}
		});

		return KeywordsEditor;
});