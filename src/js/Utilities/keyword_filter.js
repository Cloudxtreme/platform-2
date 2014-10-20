(function($){

	this.init = function(options){
		
		var $target = $("#keyword_filter");
		
		var actions =
		{
			message_contains : "message contains",
			message_no_contains : "message doesnt contain",
		/*	author_is : "author_is",*/
		/*	author_is_not : "author_is_not",*/
			country_is : "country is",
			country_is_not : "country is not",
			language_is : "language is",
			language_is_not : "language is not",
			group : "group"
		}
		
		$('html').mouseup(function(e)
		{
			e.stopPropagation();

			if(e.target.className == "no-js"){
				return;	
			}

			var el_ref_type, text;
			
			// Search for demo_bubble. Get ID and 2nd class which defines type
			var el_ref = $(e.target).closest(".demo_bubble");
			var el_ref_id = el_ref.attr('id');
			
			if(el_ref.attr('class')){
				el_ref_type = el_ref.attr('class').split(' ');
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
					if($('#keyword_filter').children().eq(-2).is('.demo_drop') === true)
					{
						$('#keyword_filter').children().eq(-2).remove();
						$("#keyword_filter #demo_plus").remove();
						addPlus("small");
					}
					valid_formula = true;

		   			if(open_groups > 1)
		   			{

		   				addWarning(trans ("there are") + ' ' + open_groups + ' ' + trans ("groups left open please close them and resubmit"));
		   				
		   				valid_formula = false;
		   			} else if(open_groups == 1)
		   			{
		   				// detect if open group is small (erase it) or big (close it)
		   				// check if small 
		   				var small_group = false;

		   				if($('#keyword_filter').children().eq(-2).is('.demo_group') === true)
		   					small_group = $('#keyword_filter').children().eq(-2).attr('id');
		   				if($('#keyword_filter').children().eq(-3).is('.demo_group') === true)
		   					small_group = $('#keyword_filter').children().eq(-3).attr('id');
		   				if($('#keyword_filter').children().eq(-4).is('.demo_group') === true)
		   					small_group = $('#keyword_filter').children().eq(-4).attr('id');

		   				if(small_group !== false)
		   				{
		   					// Delete group
		   					$('#'+small_group).prev().remove();
		   					$('#'+small_group).nextAll().remove();
			   				$('#'+small_group).remove();
			   				$("#keyword_filter #demo_plus").remove();
							addPlus("small");
		   				} else {
		   					// Close group

		   					rand_id = "filter_" + rand ();
							$("#keyword_filter #demo_plus").remove();
							$("#keyword_filter").append('<span  id="' + rand_id + '" class="demo_bubble  demo_end_group" data-option=")"><span class="sel_value">' + trans ("end group") + '</span>' + remove_filter + '</span>');
							addPlus("small");
		   				}	
		   			}
				} else {
					addWarning(trans ("formula is not valid add more parameters"));
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
					if($('#keyword_filter').children().eq(-2).is('.demo_drop') === true){
						$('#keyword_filter').children().eq(-2).remove();
						$("#keyword_filter #demo_plus").remove();
						addPlus("small");
					}
				} else {
					addWarning(trans ("formula is not valid add more parameters"));
					valid_formula = false;
				}
					
				
				if(valid_formula === true)
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
				    		} else if($("#" + $(this).attr('id') + " .sel_value").text() !== "")
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
			
			if((el_ref_type == "demo_contains") || (el_ref_type == "demo_drop") || (el_ref_type == "demo_plus"))
			{
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
				if($(".demo_options:visible").length !== 0){
					$(".demo_options").hide('fast');
				}
			}
			// Change 
			if(el_ref_type == "demo_contains"){
				if(el_ref_hit != "btn"){
					/*if($("#" + el_ref_id + " .demo_options").is(":visible")){
						text = $("#" + el_ref_id + " .text").html();
						$("#" + el_ref_id + " .demo_options input").val(text);
					}*/				
				} else {
					if($(e.target).attr("data-option") == "save"){
						// Set text
						text = $("#" + el_ref_id + " .demo_options input").val();

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
				text = $(e.target).attr("data-value");
				text_full = $(e.target).html();
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
					text = $(e.target).attr("data-text");
					$("#" + el_ref_id).attr("data-value",datavalue+" ");
				}
				if((option != "language = ") && (option != "country = ") && (option != "language != ") && (option != "country != ")){
					$("#" + el_ref_id + " .sel_value ").html(text);
				}
			}
			
			// HTML chunks
			var modal_footer = '<br><div class="modal-footer toload"><button data-option="save" class="btn" onclick="return false;">' + trans ("save") + '</button><button data-option="cancel" class="btn btn-primary" onclick="return false;">' + trans ("cancel") + '</button></div>';
			var remove_filter = '<i class="demo_remove_filter icon-remove"></i>';
			var rand_id = "filter_" + rand ();
			
			// Add message contains
			if(el_ref_hit == "add_message_contains")
			{	
				$("#keyword_filter #demo_plus").remove();
				$("#keyword_filter").append('<span id="'+ rand_id +'" class="demo_bubble demo_contains" data-option="message contains ">' + trans ("message contains") + '<span class="demo_hit_me demo_input_text demo_bubble_text"><span class="text">' + trans ("insert text") + '</span><span class="demo_options"><input type="text" name="lname" value="">' + modal_footer + '</span></span></span>');
				addPlus("small",rand_id);
			}
			// Add message does not contain
			if(el_ref_hit == "add_message_no_contains")
			{
				$("#keyword_filter #demo_plus").remove();
				$("#keyword_filter").append('<span id="'+ rand_id +'" class="demo_bubble demo_contains" data-option="message !contains ">' + trans ("message doesn't contain") + '<span class="demo_hit_me demo_input_text demo_bubble_text"><span class="text">' + trans ("insert text") + '</span><span class="demo_options"><input type="text" name="lname" value="">' + modal_footer + '</span></span>' + remove_filter + '</span>');
				addPlus("small",rand_id);
			}
			// Add author is
			if(el_ref_hit == "add_author_is")
			{
				$("#keyword_filter #demo_plus").remove();
				$("#keyword_filter").append('<span id="'+ rand_id +'" class="demo_bubble demo_contains" data-option="author = ">' + trans ("author is") + '<span class="demo_hit_me demo_input_text demo_bubble_text"><span class="text">' + trans ("insert author") + '</span><span class="demo_options"><input type="text" name="lname" value="">' + modal_footer + '</span></span>' + remove_filter + '</span>');
				addPlus("small",rand_id);
			}
			// Add author is not
			if(el_ref_hit == "add_author_is_not")
			{
				$("#keyword_filter #demo_plus").remove();
				$("#keyword_filter").append('<span id="'+ rand_id +'" class="demo_bubble demo_contains" data-option="author != ">' + trans ("author is not") + '<span class="demo_hit_me demo_input_text demo_bubble_text"><span class="text">' + trans ("insert author") + '</span><span class="demo_options"><input type="text" name="lname" value="">' + modal_footer + '</span></span>' + remove_filter + '</span>');
				addPlus("small",rand_id);
			}
			// Add country is
			if(el_ref_hit == "add_country_is")
			{
				$("#keyword_filter #demo_plus").remove();
				$("#keyword_filter").append('<span id="' + rand_id + '" class="demo_bubble demo_contains" data-option="country = ">' + trans ("country_is") + '<span class="demo_drop demo_bubble_text"><select class="demo_options" id="countries"></select></span>' + remove_filter + '</span>');
				addPlus("small",rand_id);
				fillcountries();
			}
			// Add country isn't
			if(el_ref_hit == "add_country_is_not")
			{
				$("#keyword_filter #demo_plus").remove();
				$("#keyword_filter").append('<span id="' + rand_id + '" class="demo_bubble demo_contains" data-option="country != ">' + trans ("country_is_not") + '<span class="demo_drop demo_bubble_text"><select class="demo_options" id="countries"></select></span>' + remove_filter + '</span>');
				addPlus("small",rand_id);
				fillcountries();
			}
			// Add language is
			if(el_ref_hit == "add_language_is")
			{
				$("#keyword_filter #demo_plus").remove();
				$("#keyword_filter").append('<span id="' + rand_id + '" class="demo_bubble demo_contains" data-option="language = ">' + trans ("language_is") + '<span class="demo_drop demo_bubble_text"><select class="demo_options" id="languages"></select></span>' + remove_filter + '</span>');
				addPlus("small",rand_id);
				filllanguages();
			}
			// Add language isn't
			if(el_ref_hit == "add_language_is_not")
			{
				$("#keyword_filter #demo_plus").remove();
				$("#keyword_filter").append('<span id="' + rand_id + '" class="demo_bubble demo_contains" data-option="language != ">' + trans ("language_is_not") + '<span class="demo_drop demo_bubble_text"><select class="demo_options" id="languages"></select></span>' + remove_filter + '</span>');
				addPlus("small",rand_id);
				filllanguages();
			}
			// Add and
			if(el_ref_hit == "add_and")
			{
				$("#keyword_filter #demo_plus").remove();
				$("#keyword_filter").append('<span  id="' + rand_id + '" data-string="sel_value" class="demo_bubble demo_drop demo_and" data-value="and " ><span class="sel_value">' + trans ("and") + '</span><i class="demo_hit_me icon-sort-down"></i><span class="demo_options"><ul><li class="demo_change_val" data-value="and" data-text="' + trans ("and") + '">' + trans ("and") + '</li><li class="demo_change_val" data-value="or" data-text="' + trans ("or") + '">' + trans ("or") + '</li></ul></span>' + remove_filter + '</span>');
				addPlus("large",rand_id);
			}
			// Add or
			if(el_ref_hit == "add_or")
			{
				$("#keyword_filter #demo_plus").remove();
				$("#keyword_filter").append('<span  id="' + rand_id + '" class="demo_bubble demo_drop demo_or" data-value="or " ><span class="sel_value">' + trans ("or") + '</span><i class="demo_hit_me icon-sort-down"></i><span class="demo_options"><ul><li class="demo_change_val" data-value="or" data-text="' + trans ("or") + '">' + trans ("or") + '</li><li class="demo_change_val" data-value="and" data-text="' + trans ("and") + '">' + trans ("and") + '</li></ul></span>' + remove_filter + '</span>');
				addPlus("large",rand_id);
			}
			// Add group
			if(el_ref_hit == "add_group")
			{
				$("#keyword_filter #demo_plus").remove();
				$("#keyword_filter").append('<span  id="' + rand_id + '" class="demo_bubble  demo_group" data-option="("><span class="sel_value">' + trans ("group") + '</span>' + remove_filter + '</span>');

				addPlus("large",rand_id);
				$(".demo_options").hide('fast');
			}
			// Add end group
			if(el_ref_hit == "add_end_group")
			{
				$("#keyword_filter #demo_plus").remove();
				$("#keyword_filter").append('<span  id="' + rand_id + '" class="demo_bubble  demo_end_group" data-option=")"><span class="sel_value">' + trans ("end_group") + '</span>' + remove_filter + '</span>');
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
				if($("#keyword_filter span:last-child").hasClass('demo_drop') === true){
					plus_size = "large"	
				} // if filter is empty
				else if($("#keyword_filter").children().length === 0){
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
			for (var n in options.countries)
			{
				var li = '<option value="'+options.countries[n].token+'">'+options.countries[n].name+'</option>'
				$("#keyword_filter #countries").append(li);
			}
			$("#keyword_filter #countries").chosen({width: "100%"});
		}

		function filllanguages()
		{	
			//<li class="demo_change_val" data-value="en">en</li>
			for (var n in options.languages)
			{
				var li = '<option value="'+options.languages[n].token+'">'+options.languages[n].name+'</option>'
				$("#keyword_filter #languages").append(li);
			}
			$("#keyword_filter #languages").chosen({width: "100%"});
		}

		// Random number for IDs
		function rand ()
		{
		    return Math.round (Math.random() * Date.now ());
		}
		
		// jQuery tagbuilder
		function tag (el, attributes)
		{
		    return $('<' + el + ' />', attributes || {});
		}

		// Add Plus
		function addPlus (size,id)
		{
			// Open groups?
			var open_groups = $target.find('.demo_group, .demo_end_group').size () % 2;
			
			// Dropdown
			var selected = (size == 'large')? actions: {and : "and", or: "or"};

			var options = tag ('span').addClass ('demo_options')
							.append (tag ('ul')
								.append (Object.keys (open_groups? $.extend(selected, {end_group: "end group"}): selected)
									.map (function (key) { return tag('li', {text: trans (actions[key])}).addClass ('add_' + action)})
								)
							);
							
			// Add the Plus
			$target.append (tag ('span', {id: 'demo_plus'}).addClass ('demo_bubble demo_drop demo_hit_me').append (
			[
				tag ('span', {text: '+'}).addClass ('demo_hit_me'),
				options
			]));
			
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
	
	}
	// initialize
	$.fn.keywordfilterscript = function(){
		return init.apply(this, arguments);
	}
	$.fn.keywordfilterdestroy = function() {
		$('html').unbind('mouseup')
	};

})(jQuery);