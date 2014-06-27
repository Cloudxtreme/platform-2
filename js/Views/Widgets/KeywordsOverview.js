/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.KeywordsOverview = Cloudwalkers.Views.Widgets.Widget.extend({

	'id' : 'monitorparent',
	'entries' : [],

	'events' : {
		'submit form' : 'editCategory',
		'click .edit-toggler' : 'toggleEditCategory',
		'click .delete-category' : 'deleteCategory',
		'click .delete-keyword' : 'deleteKeyword',
		'click [data-keyword]' : 'toggleEditKeyword'
	},

	'initialize' : function ()
	{
		this.channel = Cloudwalkers.Session.getChannel("monitoring");
		
		this.editor = this.options.editor;
		
		// Listen to channel changes
		this.listenTo(Cloudwalkers.Session.getChannels(), 'sync', this.render);
	},

	'render' : function ()
	{	
		categories = this.channel.channels.map(function(cat){ return {id: cat.id, name: cat.get("name"), keywords: cat.channels.models}});

		var data = {categories: categories};
		//Mustache translations
		data.translate_categories_overview = this.translateString("categories_overview");
		data.translate_change_name = this.translateString("change_name");
		
		this.$el.html (Mustache.render (Templates.keywordsoverview, data));
		
		return this;
	},

	'toggleEditCategory' : function (e)
	{
		e.stopPropagation();
		
		$(e.target).closest('[data-category]').find('.category-name, .category-edit').toggle();
	},

	'editCategory' : function (e)
	{
		e.stopPropagation();

		var $cat = $(e.target).closest('[data-category]');
		var name = $cat.find('[name="name"]').val();
		
		Cloudwalkers.Session.getChannel(Number($cat.attr('data-category'))).save({name: name});
		
		$cat.find('h4').html(name);
		
		return false;
	},

	'deleteCategory' : function (e)
	{
		e.stopPropagation();
		
		var $cat = $(e.target).closest('[data-category]');
		
		Cloudwalkers.Session.getChannel(Number($cat.attr('data-category'))).destroy();
		
		$cat.next().remove();
		$cat.remove();
	},

	'toggleEditKeyword' : function (e)
	{
		e.stopPropagation();

		var id = Number($(e.target).closest('[data-keyword]').data('keyword'));
		
		this.editor.fillKeyword(id, e);
	},

	'deleteKeyword' : function (e)
	{
		e.stopPropagation();
		
		var id = Number($(e.target).closest('[data-keyword]').attr('data-keyword'));
		
		Cloudwalkers.Session.getChannel(id).destroy();
		
		$(e.target).parent().remove();
	},
	'translateString' : function(translatedata)
	{	
		// Translate String
		return Cloudwalkers.Session.polyglot.t(translatedata);
	}

	/*
	'editKeyword' : function (e)
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
	},
	
	'toggleToCreateKeyword' : function (e)
	{
		e.preventDefault ();
		
		this.$el.find("[data-keyword] input, [data-keyword] select").val('');
		this.$el.find("[data-keyword] select").val(0);
		this.$el.find("[data-keyword] .keyword-filter, .edit-keyword").addClass("inactive");
		
		this.$el.find(".add-keyword").removeClass("inactive");
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
	*/
});



