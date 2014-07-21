Cloudwalkers.Views.Settings.GroupDetails = Backbone.View.extend({

	'tagName' : 'div',

	'events' : 
	{
		'submit .add-group-user' : 'addUser',
		'click [data-delete-group-user-id]' : 'deleteUser',
		'change select.alluser-list' : 'listentouserdropdown'
	},
	
	'initialize' : function ()
	{
		// Collect all Account Users
		this.users = new Cloudwalkers.Collections.Users();
		this.listenTo(this.users, 'seed', this.fillUsersDropdown);

		this.groups = new Cloudwalkers.Collections.Groups({modelstring:'user', parenttype:'group', typestring: 'users'});
		this.listenTo(this.groups, 'seed', this.fillGroups);

		var selecteduser = "";
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
		this.users.touch({});

		this.groups.touch({groupid: this.model.id});

		return this;
	},

	// Get Group Users
	'fillGroups' : function (models)
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

	/* Get Account Users Dropdown */
	'fillUsersDropdown' : function (models)
	{	
		var $container = this.$el.find(".alluser-list").eq(-1);
		
		for (n in models)
		{	
			var view = new Cloudwalkers.Views.Settings.UserDropdown ({ 'model' : models[n] });
			$container.append(view.render().el);
		}

		this.$el.find(".alluser-list").chosen({width: "100%"});
	},

	'listentouserdropdown' : function (e)
	{
		// Message id
		selecteduser = $(e.currentTarget).val();
	},

	'addUser' : function (){
		var data = {id: selecteduser}
		var url = 'groups/' + this.model.id + '/users';

		Cloudwalkers.Net.post (url, {}, data, function(resp){
			if(resp.error){
				Cloudwalkers.RootView.growl('Oops', "Something went wrong.");
			} else {
				Cloudwalkers.RootView.growl('Group Management', "User added.");
				this.groups.touch(null, {all: 1});
			}
		}.bind(this));
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