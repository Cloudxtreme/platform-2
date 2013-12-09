Cloudwalkers.Views.ManageKeywords = Backbone.View.extend({

	'events' : {

		'submit form[data-add-category]' : 'createCategory',
		'submit form[data-edit-category-id]' : 'editCategory',
		'click i[data-edit-category-id]' : 'showEditCategory',
		'click i[data-delete-category-id]' : 'deleteCategory',
		'click li[data-edit-keyword-id]' : 'showEditKeyword',
		'click i[data-delete-keyword-id]' : 'deleteKeyword',
		'click button[data-keyword-filter]' : 'toggleFilter',
		'click button.add-keyword' : 'addKeyword',
		'click button.update-edit-keyword' : 'editKeyword',
		'click .cancel-edit-keyword' : 'toggleToCreateKeyword'
	},

	'render' : function ()
	{
		
		var channel = Cloudwalkers.Session.getChannels().findWhere({type: "monitoring"});
		var data = {categories: channel.get("channels")};
		
		this.$el.html (Mustache.render (Templates.managekeywords, data));
		
		Cloudwalkers.Net.get('wizard/monitoring/list', {account: Cloudwalkers.Session.getAccount().id}, this.fill.bind(this));
		
		Cloudwalkers.Net.get('wizard/monitoring/values/countries', {account: Cloudwalkers.Session.getAccount().id}, this.fillFilter.bind(this, "countries"));
		Cloudwalkers.Net.get('wizard/monitoring/values/languages', {account: Cloudwalkers.Session.getAccount().id}, this.fillFilter.bind(this, "languages"));
		
		/*$.ajax (
			CONFIG_BASE_URL + 'json/wizard/monitoring/list?account=' + Cloudwalkers.Session.getAccount ().get ('id'),
			{
				'success' : function (data)
				{
					self.$el.html (Mustache.render (Templates.managekeywords, data));
					self.$el.removeClass("inner-loading");
				}
			}
		)*/

		return this;
	},
	
	'fill' : function (response)
	{	
		
		this.$el.find('.inner-loading').removeClass('inner-loading');
		
		var $container = this.$el.find(".category-list tbody").eq(-1);
		var keywords = [];
		
		$.each (response.categories, function (i, category)
		{
			$container.append(Mustache.render (Templates.categoryentry, category));
			
			$.each(category.keywords, function(n, keyword){ category.keywords[n].category = category.id });
			
			keywords = keywords.concat(category.keywords);
		
		}.bind(this));
		
		this.keywords = keywords;

	},
	
	'fillFilter' : function (filter, response)
	{	
		if(filter == "countries")
		{
			var $select = this.$el.find("#filter_region");
			var list = response.countries;
		
		} else if(filter == "languages")
		{
			var $select = this.$el.find("#filter_locale");
			var list = response.languages;
		}
		
		$.each(list, function(n, entry)
		{
			$select.append("<option value='" + entry.token + "'>" + entry.name + "</option>");	
		});

	},

	'createCategory' : function (e)
	{
		e.preventDefault ();

		var self = this;
		//var data = $(e.target).serialize ();

		var data = {};

		data.name = $(e.target).find ('[name="name"]').val ();

		this.sendData 
		(
			CONFIG_BASE_URL + 'json/wizard/monitoring/createcategory?account=' + Cloudwalkers.Session.getAccount ().get ('id'),
			data,
			function ()
			{
				self.render ();
				Cloudwalkers.Session.refresh ();
			}
		);
	},
	
	'showEditCategory' : function (e)
	{
		var id = $(e.target).attr('data-edit-category-id');
		
		$('.category-'+ id +'-name').toggle().next().toggle();
		
	},

	'editCategory' : function (e)
	{
		e.preventDefault ();

		var self = this;
		//var data = $(e.target).serialize ();

		var data = {};
		
		data.name = $(e.target).find ('[name="name"]').val ();
		data.category = $(e.target).closest('tr').attr('data-category');

		this.sendData 
		(
			CONFIG_BASE_URL + 'json/wizard/monitoring/editcategory?account=' + Cloudwalkers.Session.getAccount ().get ('id'),
			data,
			function ()
			{
				self.render ();
				Cloudwalkers.Session.refresh ();
			}
		);
	},
	
	'deleteCategory' : function (e)
	{
		var self = this;
		
		var data = {};
		data.category = $(e.target).attr ('data-delete-category-id');

		this.sendData 
		(
			CONFIG_BASE_URL + 'json/wizard/monitoring/deletecategory?account=' + Cloudwalkers.Session.getAccount ().get ('id'),
			data,
			function ()
			{
				self.render ();
				Cloudwalkers.Session.refresh ();
			}
		);
	},
	
	'addKeyword' : function (e)
	{
		e.preventDefault ();

		var self = this;
		
		var data = {};
		data.keyword = $('#keyword_create_name').val ();
		data.category = $('#keyword_create_category').val();//.attr ('data-addkeyword-category-id');
		data.locale = 'nl_BE';
		
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
	},

	'showEditKeyword' : function (e)
	{
		this.$el.find(".add-keyword").addClass("inactive");
		this.$el.find(".edit-keyword").removeClass("inactive");
		
		var id = $(e.target).attr("data-edit-keyword-id");
		
		var keyword = this.keywords.filter(function(entry){ return entry.id == id }).shift();
		
		this.$el.find("#keyword_create_category").val(keyword.category);
		this.$el.find("#keyword_create_name").val(keyword.name);

	},
	
	'editKeyword' : function (e)
	{
		
		
		this.toggleToCreateKeyword(e);
	},
	
	'toggleToCreateKeyword' : function (e)
	{
		e.preventDefault ();
		
		this.$el.find("[data-keyword] input, [data-keyword] select").val('');
		this.$el.find("[data-keyword] select").val(0);
		this.$el.find("[data-keyword] .keyword-filter").addClass("inactive");
		
		this.$el.find(".add-keyword, .edit-keyword").toggleClass("inactive");
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
	
	'toggleFilter' : function (e)
	{
		e.preventDefault ();
		
		var filter = $(e.target).attr("data-keyword-filter");
		
		this.$el.find("div[data-keyword-filter=" + filter + "]").toggleClass("inactive");
		
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