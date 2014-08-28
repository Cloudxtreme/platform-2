(function($){

	this.init = function(options){
		this.translations = {};

		if(options){ //Apply custom options
			$.extend(this.translations, options);
		}

		$('html').mouseup(function(e)
		{
			e.stopPropagation();

			if(e.target.className == "no-js"){
				return;	
			}

			// Search for demo_bubble. Get ID and 2nd class which defines type
			var el_ref = $(e.target).closest(".demo_bubble");
			var el_ref_id = el_ref.attr('id');
			if(el_ref.attr('class')){
				var el_ref_type = el_ref.attr('class').split(' ');
					el_ref_type =  el_ref_type[1];
			}
			var el_ref_class = e.target.classList;
			var el_ref_hit =  el_ref_class[0];
			var el_ref_hit_3 =  el_ref_class[2];
			var el_parent_ref = e.target.parentElement.classList;
			el_parent_ref = el_parent_ref[0];

			//console.log("id:" + el_ref_id + "ref:" + el_parent_ref + " type:" + el_ref_type + " and hit:" + el_ref_hit + " and ref_hit_3:" + el_ref_hit_3);
			
			// Validate data. If group is left open either is closed or removed
			if(($(e.target).attr("data-option") == "submit") || ($(e.target).attr("data-option") == "update")){

				var valid_formula = false;
				var open_groups = $('#keyword_filter .demo_group').length - $('#keyword_filter .demo_end_group').length;
				var result = "";

				// detect groups left open
				// if the filter has enough size
				//if($("#keyword_filter").children().length > 3)
				if($("#keyword_filter").children().length > 1)
				{
					if($('#keyword_filter').children().eq(-2).is('.demo_drop') == true)
					{
						$('#keyword_filter').children().eq(-2).remove();
						$("#keyword_filter #demo_plus").remove();
						addPlus("small");
					}
					valid_formula = true;

		   			if(open_groups > 1)
		   			{

		   				addWarning(this.translations.there_are + ' ' + open_groups + ' ' + this.translations.groups_left_open_please_close_them_and_resubmit);
		   				
		   				var valid_formula = false;
		   			} else if(open_groups == 1)
		   			{
		   				// detect if open group is small (erase it) or big (close it)
		   				// check if small 
		   				var small_group = false;

		   				if($('#keyword_filter').children().eq(-2).is('.demo_group') == true)
		   					small_group = $('#keyword_filter').children().eq(-2).attr('id');
		   				if($('#keyword_filter').children().eq(-3).is('.demo_group') == true)
		   					small_group = $('#keyword_filter').children().eq(-3).attr('id');
		   				if($('#keyword_filter').children().eq(-4).is('.demo_group') == true)
		   					small_group = $('#keyword_filter').children().eq(-4).attr('id');

		   				if(small_group != false)
		   				{
		   					// Delete group
		   					$('#'+small_group).prev().remove();
		   					$('#'+small_group).nextAll().remove();
			   				$('#'+small_group).remove();
			   				$("#keyword_filter #demo_plus").remove();
							addPlus("small");
		   				} else {
		   					// Close group

		   					var rand_id = "filter_" + getRandomInt(1,999);
							$("#keyword_filter #demo_plus").remove();
							$("#keyword_filter").append('<span  id="' + rand_id + '" class="demo_bubble  demo_end_group" data-option=")"><span class="sel_value">' + this.translations.end_group + '</span><i class="demo_remove_filter icon-remove"></i></span>');
							addPlus("small");
		   				}	
		   			}
				} else {
					addWarning(this.translations.formula_is_not_valid_add_more_parameters);
					valid_formula = false;
				}
					
					// check if there are and/or before end 
				$("#keyword_filter").children().each(function()
		    	{
		    		if(($("#"+this.id).hasClass("demo_end_group")) && ($("#"+this.id).prev().hasClass("demo_drop")))
		    		{
		    			$("#"+this.id).prev().remove();
		    		}
		    	});

				//if(($("#keyword_filter").children().length > 3) || $("#keyword_filter").children().length < 2){
				if(($("#keyword_filter").children().length > 1) || $("#keyword_filter").children().length < 2){
					if($('#keyword_filter').children().eq(-2).is('.demo_drop') == true){
						$('#keyword_filter').children().eq(-2).remove();
						$("#keyword_filter #demo_plus").remove();
						addPlus("small");
					}
				} else {
					addWarning(this.translations.formula_is_not_valid_add_more_parameters);
					valid_formula = false;
				}
					
				
				if(valid_formula == true)
				{
					// if filter is valid fill it
					var filter_src = $("#keyword_filter").children();
		    		filter_src.each(function()
		    		{
			    		if(this.id != "demo_plus"){
					    	var value_to_insert = "";
					    	var filter_data = "";
				    		if($("#" + $(this).attr('id')).attr("data-option")){
				    			filter_data = $("#" + $(this).attr('id')).attr("data-option");
				    		}
				    		if(($("#" + $(this).attr('id')).attr("data-value") == "and ") || ($("#" + $(this).attr('id')).attr("data-value") == "or ")){
				    			value_to_insert = $("#" + $(this).attr('id')).attr("data-value");
				    		} else if($("#" + $(this).attr('id') + " .sel_value").text() != "")
					    	{
					    		if((filter_data == "(") || (filter_data == ")")){
									value_to_insert = filter_data + " ";
					    		} else if((filter_data == "and ") || (filter_data == "or ")){
					    			value_to_insert = filter_data + " ";
					    		} else {
					    			value_to_insert = filter_data + "'" + $("#" + $(this).attr('id') + " .sel_value").text() + "' ";
					    		}
					    	} else if((filter_data == "country = ") || (filter_data == "country != ")){
				    			value_to_insert = filter_data + "'"  + $("#" + $(this).attr('id') + " #countries").val() + "' ";
					    	} else if((filter_data == "language = ") || (filter_data == "language != ")){
				    			value_to_insert = filter_data + "'"  + $("#" + $(this).attr('id') + " #languages").val() + "' ";
					    	} else {
					    		value_to_insert = filter_data + "'" +  $("#" + $(this).attr('id') + " .text").text() + "' ";
					    	}
					    	result += value_to_insert;	
			    		}
					});
					// send the result
					removeWarning();
			    	options.success(result);
			    } else {
			    	// If formula is invalid empty the result
			    	result = "";
			    	options.success(result);
			    }
			}
			if((el_ref_type == "demo_contains") || (el_ref_type == "demo_drop") || (el_ref_type == "demo_plus")){
				if((el_parent_ref == "demo_options") || (el_ref_hit == "demo_options")){
					return false;
				} else if($("#" + el_ref_id + " .demo_options").is(":visible")){
					// Close popups
					if(!$(e.target).is("input")){
						$(".demo_options").hide('fast');
					}
				} else {
					// Close popups and Show one
					if((el_ref_hit == "demo_hit_me") || (el_ref_hit == "text") || (el_ref_hit_3 == "demo_hit_me")){
						$(".demo_options").hide('fast');
						$("#" + el_ref_id + " .demo_options").toggle('fast');
					}
				}		
			} else {
				if($(".demo_options:visible").length != 0){
					$(".demo_options").hide('fast');
				};
			}
			// Change 
			if(el_ref_type == "demo_contains"){
				if(el_ref_hit != "btn"){
					if($("#" + el_ref_id + " .demo_options").is(":visible")){
						var text = $("#" + el_ref_id + " .text").html();
						$("#" + el_ref_id + " .demo_options input").val(text);
					}				
				} else {
					if($(e.target).attr("data-option") == "save"){
						// Set text
						var text = $("#" + el_ref_id + " .demo_options input").val();

						$("#" + el_ref_id + " .text ").html(text);
						// Close popups
						$(".demo_options").hide('fast');
						//$("#" + el_ref_id + " .demo_options").toggle('fast')
					} else if($(e.target).attr("data-option") == "cancel"){
						// Close popups
						$(".demo_options").hide('fast');
					}
				}	
			}
			// Change option and color if needed
			if(el_ref_class == "demo_change_val"){
				var text = $(e.target).attr("data-value");
				var text_full = $(e.target).html();
				var option = $("#" + el_ref_id).attr("data-option");
				if((text == "and") || (text == "or")){
					if($("#" + el_ref_id).hasClass("demo_and")){
						$("#" + el_ref_id).removeClass("demo_and");
					}
					if($("#" + el_ref_id).hasClass("demo_or")){
						$("#" + el_ref_id).removeClass("demo_or");
					}
					$("#" + el_ref_id).addClass("demo_" + text);
				} else if((option == "language = ") || (option == "country = ") || (option == "language != ") || (option == "country != ")){
					$("#" + el_ref_id).attr("data-value",text);
					$("#" + el_ref_id + " .sel_value").html(text_full);
				}

				if($("#" + el_ref_id).hasClass("demo_drop")){
					var datavalue = $(e.target).attr("data-value");
					var text = $(e.target).attr("data-text");
					$("#" + el_ref_id).attr("data-value",datavalue+" ");
				}
				if((option != "language = ") && (option != "country = ") && (option != "language != ") && (option != "country != ")){
					$("#" + el_ref_id + " .sel_value ").html(text);
				}
			}
			// Add message contains
			if(el_ref_hit == "add_message_contains"){
				var rand_id = "filter_" + getRandomInt(1,999);
				$("#keyword_filter #demo_plus").remove();
				$("#keyword_filter").append('<span id="'+ rand_id +'" class="demo_bubble demo_contains" data-option="message contains ">' + this.translations.message_contains + '<span class="demo_hit_me demo_input_text demo_bubble_text"><span class="text">' + this.translations.insert_text + '</span><span class="demo_options"><input type="text" name="lname" value=""><br><div class="modal-footer toload"><button data-option="save" class="btn" onclick="return false;">' + this.translations.save + '</button><button data-option="cancel" class="btn btn-primary" onclick="return false;">' + this.translations.cancel + '</button></div></span></span><i class="demo_remove_filter icon-remove"></i></span>');
				addPlus("small",rand_id);
			}
			// Add message does not contain
			if(el_ref_hit == "add_message_no_contains"){
				var rand_id = "filter_" + getRandomInt(1,999);
				$("#keyword_filter #demo_plus").remove();
				$("#keyword_filter").append('<span id="'+ rand_id +'" class="demo_bubble demo_contains" data-option="message !contains ">' + this.translations.message_doesnt_contain + '<span class="demo_hit_me demo_input_text demo_bubble_text"><span class="text">' + this.translations.insert_text + '</span><span class="demo_options"><input type="text" name="lname" value=""><br><div class="modal-footer toload"><button data-option="save" class="btn" onclick="return false;">' + this.translations.save + '</button><button data-option="cancel" class="btn btn-primary" onclick="return false;">' + this.translations.cancel + '</button></div></span></span><i class="demo_remove_filter icon-remove"></i></span>');
				addPlus("small",rand_id);
			}
			// Add author is
			if(el_ref_hit == "add_author_is"){
				var rand_id = "filter_" + getRandomInt(1,999);
				$("#keyword_filter #demo_plus").remove();
				$("#keyword_filter").append('<span id="'+ rand_id +'" class="demo_bubble demo_contains" data-option="author = ">' + this.translations.author_is + '<span class="demo_hit_me demo_input_text demo_bubble_text"><span class="text">' + this.translations.insert_author + '</span><span class="demo_options"><input type="text" name="lname" value=""><br><div class="modal-footer toload"><button data-option="save" class="btn" onclick="return false;">' + this.translations.save + '</button><button data-option="cancel" class="btn btn-primary" onclick="return false;">' + this.translations.cancel + '</button></div></span></span><i class="demo_remove_filter icon-remove"></i></span>');
				addPlus("small",rand_id);
			}
			// Add author is not
			if(el_ref_hit == "add_author_is_not"){
				var rand_id = "filter_" + getRandomInt(1,999);
				$("#keyword_filter #demo_plus").remove();
				$("#keyword_filter").append('<span id="'+ rand_id +'" class="demo_bubble demo_contains" data-option="author != ">' + this.translations.author_is_not + '<span class="demo_hit_me demo_input_text demo_bubble_text"><span class="text">' + this.translations.insert_author + '</span><span class="demo_options"><input type="text" name="lname" value=""><br><div class="modal-footer toload"><button data-option="save" class="btn" onclick="return false;">' + this.translations.save + '</button><button data-option="cancel" class="btn btn-primary" onclick="return false;">' + this.translations.cancel + '</button></div></span></span><i class="demo_remove_filter icon-remove"></i></span>');
				addPlus("small",rand_id);
			}
			// Add country is
			if(el_ref_hit == "add_country_is"){
				var rand_id = "filter_" + getRandomInt(1,999);
				$("#keyword_filter #demo_plus").remove();
				$("#keyword_filter").append('<span id="' + rand_id + '" class="demo_bubble demo_contains" data-option="country = ">' + this.translations.country_is + '<span class="demo_drop demo_bubble_text"><select class="demo_options" id="countries"></select></span><i class="demo_remove_filter icon-remove"></i></span>');
				addPlus("small",rand_id);
				fillcountries();
			}
			// Add country isn't
			if(el_ref_hit == "add_country_is_not"){
				var rand_id = "filter_" + getRandomInt(1,999);
				$("#keyword_filter #demo_plus").remove();
				$("#keyword_filter").append('<span id="' + rand_id + '" class="demo_bubble demo_contains" data-option="country != ">' + this.translations.country_is_not + '<span class="demo_drop demo_bubble_text"><select class="demo_options" id="countries"></select></span><i class="demo_remove_filter icon-remove"></i></span>');
				addPlus("small",rand_id);
				fillcountries();
			}
			// Add language is
			if(el_ref_hit == "add_language_is"){
				var rand_id = "filter_" + getRandomInt(1,999);
				$("#keyword_filter #demo_plus").remove();
				$("#keyword_filter").append('<span id="' + rand_id + '" class="demo_bubble demo_contains" data-option="language = ">' + this.translations.language_is + '<span class="demo_drop demo_bubble_text"><select class="demo_options" id="languages"></select></span><i class="demo_remove_filter icon-remove"></i></span>');
				addPlus("small",rand_id);
				filllanguages();
			}
			// Add language isn't
			if(el_ref_hit == "add_language_is_not"){
				var rand_id = "filter_" + getRandomInt(1,999);
				$("#keyword_filter #demo_plus").remove();
				$("#keyword_filter").append('<span id="' + rand_id + '" class="demo_bubble demo_contains" data-option="language != ">' + this.translations.language_is_not + '<span class="demo_drop demo_bubble_text"><select class="demo_options" id="languages"></select></span><i class="demo_remove_filter icon-remove"></i></span>');
				addPlus("small",rand_id);
				filllanguages();
			}
			// Add and
			if(el_ref_hit == "add_and"){
				var rand_id = "filter_" + getRandomInt(1,999);
				$("#keyword_filter #demo_plus").remove();
				$("#keyword_filter").append('<span  id="' + rand_id + '" data-string="sel_value" class="demo_bubble demo_drop demo_and" data-value="and " ><span class="sel_value">' + this.translations.and + '</span><i class="demo_hit_me icon-sort-down"></i><span class="demo_options"><ul><li class="demo_change_val" data-value="and" data-text="' + this.translations.and + '">' + this.translations.and + '</li><li class="demo_change_val" data-value="or" data-text="' + this.translations.or + '">' + this.translations.or + '</li></ul></span><i class="demo_remove_filter icon-remove"></i></span>');
				addPlus("large",rand_id);
			}
			// Add or
			if(el_ref_hit == "add_or"){
				var rand_id = "filter_" + getRandomInt(1,999);
				$("#keyword_filter #demo_plus").remove();
				$("#keyword_filter").append('<span  id="' + rand_id + '" class="demo_bubble demo_drop demo_or" data-value="or " ><span class="sel_value">' + this.translations.or + '</span><i class="demo_hit_me icon-sort-down"></i><span class="demo_options"><ul><li class="demo_change_val" data-value="or" data-text="' + this.translations.or + '">' + this.translations.or + '</li><li class="demo_change_val" data-value="and" data-text="' + this.translations.and + '">' + this.translations.and + '</li></ul></span><i class="demo_remove_filter icon-remove"></i></span>');
				addPlus("large",rand_id);
			}
			// Add group
			if(el_ref_hit == "add_group"){
				var rand_id = "filter_" + getRandomInt(1,999);
				$("#keyword_filter #demo_plus").remove();
				$("#keyword_filter").append('<span  id="' + rand_id + '" class="demo_bubble  demo_group" data-option="("><span class="sel_value">' + this.translations.group + '</span><i class="demo_remove_filter icon-remove"></i></span>');

				addPlus("large",rand_id);
				$(".demo_options").hide('fast');
			}
			// Add end group
			if(el_ref_hit == "add_end_group"){
				var rand_id = "filter_" + getRandomInt(1,999);
				$("#keyword_filter #demo_plus").remove();
				$("#keyword_filter").append('<span  id="' + rand_id + '" class="demo_bubble  demo_end_group" data-option=")"><span class="sel_value">' + this.translations.end_group + '</span><i class="demo_remove_filter icon-remove"></i></span>');
				addPlus("small",rand_id);
				$(".demo_options").hide('fast');
			}
			
			// Remove filter
			if(el_ref_hit == "demo_remove_filter"){

				// If it's a drop down, remove it and parameter after it
				if($("#" + el_ref_id).hasClass("demo_drop")){

					// If parameter after it is group, remove it
					if($("#" + el_ref_id).next().hasClass("demo_group")){

						$("#" + el_ref_id).nextUntil(".demo_end_group").remove();
						$("#" + el_ref_id).nextAll(".demo_end_group").remove();

					} else {
						
						$("#" + el_ref_id).next().remove();

					}

					$("#" + el_ref_id).remove();

				} // If it's a group start
				else if($("#" + el_ref_id).hasClass("demo_group")){

					$("#" + el_ref_id).nextAll(".demo_end_group").next().remove();
					$("#" + el_ref_id).nextUntil(".demo_end_group").remove();
					$("#" + el_ref_id).nextAll(".demo_end_group").remove();
					$("#" + el_ref_id).remove();

				} // If it's a group end
				else if($("#" + el_ref_id).hasClass("demo_end_group")){

					$("#" + el_ref_id).remove();

				} else {
					// parameter was alone inside group
					if(($("#" + el_ref_id ).prev().hasClass("demo_group")) && ($("#" + el_ref_id ).next().hasClass("demo_end_group")))
					{
						$("#" + el_ref_id ).prev().remove();
						$("#" + el_ref_id ).next().remove();
						if($("#" + el_ref_id ).prev().hasClass('demo_drop'))
						{
							$("#" + el_ref_id ).prev().remove();
						}
					} else if($("#" + el_ref_id ).next().attr('id') != "demo_plus")
					{
						if($("#" + el_ref_id ).prev().hasClass('demo_drop'))
						{
							if($("#" + el_ref_id ).next().next().hasClass('demo_drop')){
								$("#" + el_ref_id).nextAll(".demo_end_group").next().remove();
							}
						}
						$("#" + el_ref_id ).next().remove();
					}
					$("#" + el_ref_id ).remove();		
					
				}

				// delete Plus sign
				$("#keyword_filter #demo_plus").remove();

				// if last element is dropdown add small plus
				if($("#keyword_filter span:last-child").hasClass('demo_drop') == true){
					plus_size = "large"	
				} // if filter is empty
				else if($("#keyword_filter").children().length == 0){
					plus_size = "large";
				} else {
					plus_size = "small"
				}
				addPlus(plus_size);
			}
		}.bind(this));
	
		function fillcountries()
		{	
			//<li class="demo_change_val" data-value="en">en</li>
			for(n in options.countries)
			{
				var li = '<option value="'+options.countries[n].token+'">'+options.countries[n].name+'</option>'
				$("#keyword_filter #countries").append(li);
			}
			$("#keyword_filter #countries").chosen({width: "100%"});
		}

		function filllanguages()
		{	
			//<li class="demo_change_val" data-value="en">en</li>
			for(n in options.languages)
			{
				var li = '<option value="'+options.languages[n].token+'">'+options.languages[n].name+'</option>'
				$("#keyword_filter #languages").append(li);
			}
			$("#keyword_filter #languages").chosen({width: "100%"});
		}

		// Random number for IDs
		function getRandomInt(min, max) {
		    return Math.floor(Math.random() * (max - min + 1)) + min;
		}

		// Add Plus
		function addPlus (size,id){
			var open_groups = $('#keyword_filter .demo_group').length - $('#keyword_filter .demo_end_group').length;

			if(open_groups > 0){				
				$("#keyword_filter").append(eval("bot_plus_" + size + "_end_group"));
			} else {
				$("#keyword_filter").append(eval("bot_plus_" + size));
			}
			$(".demo_options").hide('fast');
		}
		// Add warning
		function addWarning(message){
			var box = '<div class="alert alert-info" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span></button>'+ message +'</div>';
			removeWarning();
			$("#keyword_warning").append(box);
		}
		function removeWarning(){
			$("#keyword_warning .alert").remove();
		}

		// Large plus button
		var bot_plus_large = '<span id="demo_plus" class="demo_bubble demo_drop demo_hit_me"><span class="demo_hit_me">+</spam><span class="demo_options"><ul><li class="add_message_contains">' + this.translations.message_contains + '</li><li class="add_message_no_contains">' + this.translations.message_doesnt_contain + '</li><li class="add_author_is">' + this.translations.author_is + '</li><li class="add_author_is_not">' + this.translations.author_is_not + '</li><li class="add_country_is">' + this.translations.country_is + '</li><li class="add_country_is_not">' + this.translations.country_is_not + '</li><li class="add_language_is">' + this.translations.language_is + '</li><li class="add_language_is_not">' + this.translations.language_is_not + '</li><li class="add_group">' + this.translations.group + '</li></ul></span></span>';
		// Large plus button with end group
		var bot_plus_large_end_group = '<span id="demo_plus" class="demo_bubble demo_drop demo_hit_me"><span class="demo_hit_me">+</spam><span class="demo_options"><ul><li class="add_message_contains">' + this.translations.message_contains + '</li><li class="add_message_no_contains">' + this.translations.message_doesnt_contain + '</li><li class="add_author_is">' + this.translations.author_is + '</li><li class="add_author_is_not">' + this.translations.author_is_not + '</li><li class="add_country_is">' + this.translations.country_is + '</li><li class="add_country_is_not">' + this.translations.country_is_not + '</li><li class="add_language_is">' + this.translations.language_is + '</li><li class="add_language_is_not">' + this.translations.language_is_not + '</li><li class="add_group">' + this.translations.group + '</li><li class="add_end_group">' + this.translations.end_group + '</li></ul></span></span>';
		// Small plus button
		var bot_plus_small = '<span id="demo_plus" class="demo_bubble demo_drop demo_hit_me"><span class="demo_hit_me">+</spam><span class="demo_options"><ul><li class="add_and">' + this.translations.and + '</li><li class="add_or">' + this.translations.or + '</li></ul></span></span>';
		// Small plus button with end group
		var bot_plus_small_end_group = '<span id="demo_plus" class="demo_bubble demo_drop demo_hit_me"><span class="demo_hit_me">+</spam><span class="demo_options"><ul><li class="add_and">' + this.translations.and + '</li><li class="add_or">' + this.translations.or + '</li><li class="add_end_group">' + this.translations.end_group + '</li></ul></span></span>';
	
	}
	// initialize
	$.fn.keywordfilterscript = function(){
		return init.apply(this, arguments);
	}
	$.fn.keywordfilterdestroy = function () {
		$('html').unbind('mouseup')
	};

})(jQuery);