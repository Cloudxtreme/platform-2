Cloudwalkers.Views.Settings.ManageUserGroups = Backbone.View.extend({

	'events' : {
		'submit .create-group' : 'createGroup',
		'click [data-edit-group-id]' : 'fetchDetails',
	},

	'class' : 'section',
	'collections' : [],
	
	'initialize' : function ()
	{
		
		this.collection = new Cloudwalkers.Collections.UserGroups();
		
		// listen to model
		
		this.listenTo(this.collection, 'seed', this.fillGroups);
		this.listenTo(this.collection, 'request', this.showloading);
		this.listenTo(this.collection, 'sync', this.hideloading);
		
		this.loadListeners(this.collection, ['request', 'sync'], true);
	},
	
	'render' : function ()
	{
		//var account = Cloudwalkers.Session.getAccount();
		var data = {};

		//Mustache Translate Render
		this.mustacheTranslateRender(data);

		// Apply role permissions to template data
		Cloudwalkers.Session.censuretemplate(data);
		
		this.$el.html (Mustache.render (Templates.settings.manageusergroups, data));
		
		//account.users.hook({success: this.fill.bind(this), error: this.fail});
		
		this.$el.find(".collapse-closed, .collapse-open").each(this.negotiateFunctionalities);
		
		// Load users
		this.collection.touch();
	
		this.$container = this.$el.find('.toload');
		
		return this;
	},
	
	
	'fillGroups' : function (models)
	{	
		var $container = this.$el.find(".group-container").eq(-1);
		
		/* Clean and Populate */
		$container.empty();
		
		for (n in models)
		{	
			var view = new Cloudwalkers.Views.Settings.Group ({ 'model' : models[n] });
			$container.append(view.render().el);
		}

	},

	'createGroup' : function ()
	{
		
		var data = {name: $('input[name=group-name]').val()}

		var url = 'accounts/' + Cloudwalkers.Session.getAccount().get('id') + '/groups';
		
		Cloudwalkers.Net.post (url, {}, data, function(resp){
			if(resp.error){
				Cloudwalkers.RootView.growl('Oops', "Something went wrong.");
			} else {
				Cloudwalkers.RootView.growl('Group Management', "Group created.");
				$('input[name=group-name]').val('');
				this.collection.touch(null, {all: 1});
			}
		}.bind(this));
	},

	'fetchDetails' : function(e)
	{

		console.log("fetchDetails");

		$('.group-container > *').removeClass("active");
		$(e.currentTarget).closest('tr').addClass("active");

		var groupid = $(e.currentTarget).data("edit-group-id");

		//fetch

	},

	'fillDetails' : function(group){

		console.log("fillDetails");

		var options = {model: group, template: 'manageusergroups_details'}
		var group_details;

		group_details = new Cloudwalkers.Views.Settings.GroupDetails(options);
		this.$el.find('.group-details-container').append(group_details.render().el);

	},

	/* on it's way to be deprecated */
	'negotiateFunctionalities' : function(el)
	{
		// Check collapse option
		$(this).find('.portlet-title').on('click', function(){ $(this).parents(".collapse-closed, .collapse-open").toggleClass("collapse-closed collapse-open"); });
	},
	
	'fail' : function ()
	{
		Cloudwalkers.RootView.growl ("Oops", "Something went sideways, please reload the page.");
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
			"user_groups",
			"create_new_group",
			"name",
			"add",
			"user_list",
			"streams",
			"keyword_monitoring_category"
		];

		this.translated = [];

		for(k in this.original)
		{
			this.translated[k] = this.translateString(this.original[k]);
			translatelocation["translate_" + this.original[k]] = this.translated[k];
		}
	}

});