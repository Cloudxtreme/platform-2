Cloudwalkers.Views.Settings.GroupDetails = Backbone.View.extend({

	'tagName' : 'div',

	'events' : 
	{
		'submit .add-group-user' : 'addUser',
		'change select.all-user-list' : 'listentouserdropdown'
	},
	
	'initialize' : function ()
	{
		// Collect all Account Users
		this.users = new Cloudwalkers.Collections.Users({modelstring:'user'});
		this.listenTo(this.users, 'seed', this.fillUsersDropdown);

		// Collect Group Users
		this.groupusers = new Cloudwalkers.Collections.Groups({modelstring:'user', parenttype:'group', typestring: 'users'});
		this.listenTo(this.groupusers, 'seed', this.fillGroupItems);


		// Collect all Account Streams
		//this.streams = new Cloudwalkers.Collections.Streams({modelstring:'stream'});
		//this.listenTo(this.streams, 'seed', this.fillUsersDropdown);

		// Collect Group Streams
		//this.groupusers = new Cloudwalkers.Collections.Groups({modelstring:'user', parenttype:'group', typestring: 'users'});
		//this.listenTo(this.groupusers, 'seed', this.fillGroupItems);


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

		// Load all users
		this.users.touch(Cloudwalkers.Session.getAccount(), {records: 100});
		// Load group users
		this.groupusers.touch({groupid: this.model.id});

		// Load all streams
		//this.streams.touch({});

		return this;
	},

	// Get Group Users
	'fillGroupItems' : function (models)
	{	
		var $container = this.$el.find("." + models[0].collection.parenttype + "-" + models[0].collection.typestring + "-container").eq(-1);
		
		/* Clean and Populate */
		$container.empty();
		
		for (n in models)
		{	
			var view = new Cloudwalkers.Views.Settings.GroupItem ({ 'model' : models[n] , 'type' : models[0].collection.parenttype + '-' + models[0].collection.modelstring});
			$container.append(view.render().el);
		}

	},

	// Get Account Users Dropdown
	'fillUsersDropdown' : function (models)
	{	
		var $container = this.$el.find(".all-" + models[0].collection.modelstring + "-list").eq(-1);

		for (n in models)
		{	
			var view = new Cloudwalkers.Views.Settings.UserDropdown ({ 'model' : models[n] });
			$container.append(view.render().el);
		}

		this.$el.find(".all-" + models[0].collection.modelstring + "-list").chosen({width: "100%"});
	},

	'listentouserdropdown' : function (e)
	{
		// Message id
		selecteduser = {
			id: $(e.currentTarget).val(),
			name: $(e.currentTarget).get(0).textContent
		}
	},

	'addUser' : function (){

		var url = 'groups/' + this.model.id + '/users';

		Cloudwalkers.Net.post (url, {}, selecteduser, function(resp){
			if(resp.error){
				Cloudwalkers.RootView.growl('Oops', this.translateString("something_went_wrong"));
			} else {
				Cloudwalkers.RootView.growl(this.translateString("group_management"), this.translateString("user_added"));
				this.groupusers.touch({groupid: this.model.id});
				
				// Clear Dropdown selection
				$('option').prop('selected', false);
				$('.portlet-body form *').trigger('chosen:updated');

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
			"add",
			"add_stream",
			"add_keyword_monitoring_category"
		];

		this.translated = [];

		for(k in this.original)
		{
			this.translated[k] = this.translateString(this.original[k]);
			translatelocation["translate_" + this.original[k]] = this.translated[k];
		}
	}
	
});