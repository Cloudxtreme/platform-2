Cloudwalkers.Views.ManageKeywords = Backbone.View.extend({

	'events' : {

		'submit form[data-add-category]' : 'createCategory',
		'submit form[data-edit-category-id]' : 'editCategory',
		'submit form[data-addkeyword-category-id]' : 'addKeyword',
		'click i[data-edit-category-id]' : 'showEditCategory',
		'click i[data-delete-category-id]' : 'deleteCategory',
		'click i[data-delete-keyword-id]' : 'deleteKeyword'
	},

	'render' : function ()
	{
		var self = this;

		this.$el.html ('<p>Please wait, loading data.</p>');

		$.ajax (
			CONFIG_BASE_URL + 'json/wizard/monitoring/list?account=' + Cloudwalkers.Session.getAccount ().get ('id'),
			{
				'success' : function (data)
				{
					self.$el.html (Mustache.render (Templates.managekeywords, data));
				}
			}
		)

		return this;
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
			}
		);
	},

	'deleteCategory' : function (e)
	{
		var self = this;
		
		
		return console.log(e.target);
		
		var data = {};
		data.category = $(e.target).attr ('data-delete-category-id');

		this.sendData 
		(
			CONFIG_BASE_URL + 'json/wizard/monitoring/deletecategory?account=' + Cloudwalkers.Session.getAccount ().get ('id'),
			data,
			function ()
			{
				self.render ();
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
	}
});