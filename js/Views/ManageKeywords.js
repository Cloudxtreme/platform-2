Cloudwalkers.Views.ManageKeywords = Backbone.View.extend({

	'events' : {

		'submit form[data-add-category]' : 'createCategory',
		'submit form[data-edit-category-id]' : 'editCategory',
		'submit form[data-add-keyword]' : 'addKeyword',
		'click i[data-edit-category-id]' : 'showEditCategory',
		'click i[data-delete-category-id]' : 'deleteCategory',
		'click li[data-edit-keyword-id]' : 'showEditKeyword',
		'click i[data-delete-keyword-id]' : 'deleteKeyword'
	},

	'render' : function ()
	{
		
		var channel = Cloudwalkers.Session.getChannels().findWhere({type: "monitoring"});
		var data = {categories: channel.get("channels")};
		
		this.$el.html (Mustache.render (Templates.managekeywords, data));
		
		Cloudwalkers.Net.get('wizard/monitoring/list', {account: Cloudwalkers.Session.getAccount().id}, this.fill.bind(this));
		
		Cloudwalkers.Net.get('wizard/monitoring/values/countries', {account: Cloudwalkers.Session.getAccount().id}, this.fillFilter.bind(this, "countries"));
		Cloudwalkers.Net.get('wizard/monitoring/values/languages', {account: Cloudwalkers.Session.getAccount().id}, this.fillFilter.bind(this, "countries"));
		
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
			keywords = keywords.concat(category.keywords);
		
		}.bind(this));
		
		this.keywords = keywords;
		
		// Go trough all messages
		/*var type = (this.options.type == "news" || this.options.type == "profiles")? "trending": this.options.type; 
		
		collection.each (function (message)
		{
			var data = {
				'model' : message,
				'template' : 'smallentry',
				'type' : type
			};
			
			if(this.options.link) message.link = this.options.link;
			
			var messageView = new Cloudwalkers.Views.Entry (data);
			
			$container.append(messageView.render().el);
		}.bind(this));
		*/

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
	
	'showEditKeyword' : function (e)
	{
		//var id = $(e.target).attr('data-edit-category-id');
		//$('.category-'+ id +'-name').toggle().next().toggle();
		
		this.$el.find(".add-keyword").addClass("inactive");
		this.$el.find(".edit-keyword").removeClass("inactive");
		
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