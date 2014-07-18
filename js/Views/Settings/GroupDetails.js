Cloudwalkers.Views.Settings.GroupDetails = Backbone.View.extend({

	'tagName' : 'div',

	'events' : 
	{
		'submit .add-group-user' : 'addUser',
		'click [data-delete-group-user-id]' : 'deleteUser'
	},
	
	'initialize' : function ()
	{
		this.users = new Cloudwalkers.Collections.Groups();

		this.listenTo(this.users, 'seed', this.fillUsers);
		this.listenTo(this.users, 'request', this.showloading);
		this.listenTo(this.users, 'sync', this.hideloading);
		
		this.loadListeners(this.users, ['request', 'sync'], true);
	},

	'render' : function ()
	{
		
		var data = {};
		
		data = this.model.attributes;

		//Mustache Translate Render
		this.mustacheTranslateRender(data);
		
		// Apply role permissions to template data
		Cloudwalkers.Session.censuretemplate(data);
		
		this.$el.html (Mustache.render (Templates.settings.manageusergroups_details, data));

		// Load group users
		this.users.touch({user: "user"});

		this.$el.find(".canned-list").chosen({width: "100%"});

		return this;

	},

	'fillUsers' : function (models)
	{	
		var $container = this.$el.find(".group-user-container").eq(-1);
		
		/* Clean and Populate */
		$container.empty();
		
		for (n in models)
		{	
			var view = new Cloudwalkers.Views.Settings.GroupItem ({ 'model' : models[n] });
			$container.append(view.render().el);
		}

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
			"add_user",
			"user_list",
			"streams",
			"keyword_monitoring_category",
			"add"
		];

		this.translated = [];

		for(k in this.original)
		{
			this.translated[k] = this.translateString(this.original[k]);
			translatelocation["translate_" + this.original[k]] = this.translated[k];
		}
	}
	
});