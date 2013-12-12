/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.KeywordsOverview = Cloudwalkers.Views.Widgets.Widget.extend({

	'id' : 'monitorparent',
	'entries' : [],
	
	'events' : {
		'submit form[data-edit-category-id]' : 'editCategory',
		'click i[data-edit-category-id]' : 'showEditCategory',
		'click i[data-delete-category-id]' : 'deleteCategory',
		'click li[data-edit-keyword-id]' : 'showEditKeyword',
		'click i[data-delete-keyword-id]' : 'deleteKeyword',
		
	},
	
	'initialize' : function ()
	{
		this.channel = Cloudwalkers.Session.getChannel("monitoring");
		
		this.$editor = this.options.editor;
		
		// Listen to categories
		this.listenTo(this.channel, 'change:channels', this.render);
	},
	
	'render' : function ()
	{	
		this.$el.html (Mustache.render (Templates.keywordsoverview, {categories: this.channel.get("channels")}));
		
		return this;
	},
	
	'showEditCategory' : function (e)
	{
		var id = $(e.target).attr('data-edit-category-id');
		
		$('.category-'+ id +'-name').toggle().next().toggle();
	},

	'editCategory' : function (e)
	{
		e.preventDefault ();

		var category = Cloudwalkers.Session.getChannel(Number($(e.target).closest('form').attr('data-edit-category-id')));
		
		category.save({name: $(e.target).find('[name="name"]').val()});
	},
	
	'deleteCategory' : function (e)
	{
		var id = Number($(e.target).closest('form').attr('data-edit-category-id'));
		
		var category = Cloudwalkers.Session.getChannel(id);
		
		category.destroy();
		
		$('data-category="'+ id +'", #category-'+ id +'-tags').remove();
	},
	
	/*'addKeyword' : function (e)
	{
		e.preventDefault ();
		
		//console.log($(e.target).attr())

		var self = this;
		
		var data = {};
		data.keyword = $('#keyword_create_name').val ();
		data.category = $('#keyword_create_category').val();//.attr ('data-addkeyword-category-id');
		
		if($('#filter_include').val())
			data.include = $('#filter_include').val();
			
		if($('#filter_exclude').val())
			data.exclude = $('#filter_exclude').val();
			
		if(Number($('#filter_locale').val()) != 0)
			data.languages = [$('#filter_locale').val()];
			
		if(Number($('#filter_region').val()) != 0)
			data.countries = [$('#filter_region').val()];

		this.sendData 
		(
			CONFIG_BASE_URL + 'json/wizard/monitoring/createkeyword?account=' + Cloudwalkers.Session.getAccount ().get ('id'),
			data,
			function ()
			{
				self.render ();
				Cloudwalkers.Session.refresh ();
			}
		);
		
		this.toggleToCreateKeyword();
	},*/

	'showEditKeyword' : function (e)
	{
		/*var $editor = $(".manage-keyword").eq(0);
		var id = $(e.target).attr("data-edit-keyword-id");
		
		$editor.find("[data-keyword] input, [data-keyword] select").val('');
		
		$editor.find("[data-keyword] .keyword-filter, .edit-keyword").addClass("inactive");
		
		$editor.find(".add-keyword").removeClass("inactive");
		
		$editor.find("[data-keyword] select").val(0);*/
		
		console.log(this.$editor);
		
		/*
		this.toggleToCreateKeyword(e);
		
		this.$el.selectedkeywordid = $(e.target).attr("data-edit-keyword-id");
		
		this.$el.find(".add-keyword").addClass("inactive");
		this.$el.find(".edit-keyword").removeClass("inactive");
		
		
		
		var keyword = this.keywords.filter(function(entry){ return entry.id == id }).shift();
		
		this.$el.find("#keyword_create_category").val(keyword.category);
		this.$el.find("#keyword_create_name").val(keyword.name);
		
		if(keyword.include)
			$('#filter_include').val(keyword.include);
			
		if(keyword.exclude)
			 $('#filter_exclude').val(keyword.exclude);
			
		if(keyword.languages.length)
			$('#filter_locale').val(keyword.languages[0]);
			
		if(keyword.countries)
			$('#filter_region').val(keyword.countries[0]);
		*/
	},
	
	/*'editKeyword' : function (e)
	{
		var self = this;
		
		var data = {};
		data.keyword = this.$el.selectedkeywordid;
		data.category = $('#keyword_create_category').val();//.attr ('data-addkeyword-category-id');
		
		if($('#filter_include').val())
			data.include = $('#filter_include').val();
			
		if($('#filter_exclude').val())
			data.exclude = $('#filter_exclude').val();
			
		if(Number($('#filter_locale').val()) != 0)
			data.languages = [$('#filter_locale').val()];
			
		if(Number($('#filter_region').val()) != 0)
			data.countries = [$('#filter_region').val()];

		this.sendData 
		(
			CONFIG_BASE_URL + 'json/wizard/monitoring/editkeyword?account=' + Cloudwalkers.Session.getAccount ().get ('id'),
			data,
			function ()
			{
				self.render ();
				Cloudwalkers.Session.refresh ();
			}
		);
		
		this.toggleToCreateKeyword(e);
	},*/
	
	'toggleToCreateKeyword' : function (e)
	{
		e.preventDefault ();
		
		this.$el.find("[data-keyword] input, [data-keyword] select").val('');
		this.$el.find("[data-keyword] select").val(0);
		this.$el.find("[data-keyword] .keyword-filter, .edit-keyword").addClass("inactive");
		
		this.$el.find(".add-keyword").removeClass("inactive");
	},
	
	'deleteKeyword' : function (e)
	{
		var self = this;

		var data = {};
		data.keyword = $(e.target).attr ('data-delete-keyword-id');

		this.sendData 
		(
			CONFIG_BASE_URL + 'json/wizard/monitoring/deletekeyword?account=' + Cloudwalkers.Session.getAccount ().get ('id'),
			data,
			function ()
			{
				self.render ();
				Cloudwalkers.Session.refresh ();
			}
		);
	},
	

	'sendData' : function (url, data, callback)
	{
		$.ajax (
			url,
			{
				'dataType' : 'json',
				'data' : JSON.stringify (data),
				'processData' : false,
				'cache' : false,
				'type' : 'post',
				'success' : function (data)
				{
					if (typeof (data.error) != 'undefined')
					{
						Cloudwalkers.RootView.alert (data.error.message);
					}
					else
					{
						callback ();
					}
				}
			}
		);
	},
	
	'fail' : function ()
	{
		Cloudwalkers.RootView.growl ("Oops", "Something went sideways, please reload the page.");
	}


});