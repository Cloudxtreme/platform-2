Cloudwalkers.Views.Settings.Users = Backbone.View.extend({

	'events' : {
		/*'click .add-user' : 'addUser',
		'submit .edit-user-profile' : 'editUserProfile',*/
		'submit .users-invite' : 'addUser'
	},

	'class' : 'section',
	'collections' : [],
	
	'initialize' : function ()
	{
		
		this.collection = new Cloudwalkers.Collections.Users();
		
		//  en to model
		this.listenToOnce(this.collection, 'sync', this.fill);
		this.listenToOnce(this.collection, 'request', this.showloading);
		this.listenToOnce(this.collection, 'sync', this.hideloading);
		
		this.loadListeners(this.collection, ['request', 'sync'], true);
	},

	'render' : function ()
	{
		var account = Cloudwalkers.Session.getAccount();
		var data = {};

		//Mustache Translate Render
		this.mustacheTranslateRender(data);

		// Apply role permissions to template data
		Cloudwalkers.Session.censuretemplate(data);
		
		this.$el.html (Mustache.render (Templates.settings.users, data));
		
		//account.users.hook({success: this.fill.bind(this), error: this.fail});
		
		this.$el.find(".collapse-closed, .collapse-open").each(this.negotiateFunctionalities);
		
		// Load users
		this.collection.parameters = {records: 100}
		this.collection.parentmodel = account;
		this.collection.fetch();
		
		/*
		var administrators = new Cloudwalkers.Collections.Users ([], {});

		this.collections.push (administrators);

		this.addUserContainer ('Users', administrators);

		// Work widgets
		*/
		this.$container = this.$el.find('.toload');
		
		return this;
	},
	
	
	'fill' : function (collection)
	{	
		models = collection.models;
		Cloudwalkers.Session.getAccount().monitorlimit('users', models.length, $(".invite-user"));
		
		var $container = this.$el.find(".user-container").eq(-1);
		
		for (n in models)
		{	
			var view = new Cloudwalkers.Views.Settings.User ({ 'model' : models[n], view: this });
			$container.append(view.render().el);
		}
		
		/*collection.each (function (user)
		{
			var view = new Cloudwalkers.Views.Settings.User ({ 'model' : user });
			$container.append(view.render().el);
		});*/
	},

	'addUserContainer' : function (title, collection)
	{	
		var user = Cloudwalkers.Session.getUser ();

		var self = this;

		var data = {};
		data.title = title;
		data.user = user.attributes;

		var html = $(Mustache.render (Templates.settings.users, data));

		collection.on ('reset', function ()
		{
			html.find ('.user-container').html ('');
		});

		collection.on ('reset:all', function ()
		{
			for (var i = 0; i < self.collections.length; i ++)
			{
				self.collections[i].reset ();
				self.collections[i].fetch ();
			}
		});

		collection.on ('add', function (model)
		{
			var view = new Cloudwalkers.Views.Settings.User ({ 'model' : model });
			html.find ('.user-container').append (view.render ().el);
		});

		html.find ('.loading').show ();

		collection.fetch ({
			'success' : function ()
			{
				html.find ('.loading').hide ();
			}
		});

		this.$el.append (html);

	},

	'addUser' : function ()
	{
		
		var data = {email: $('input[name=invite-email]').val()}
		var url = 'account/' + Cloudwalkers.Session.getAccount().get('id') + '/users';
		
		Cloudwalkers.Net.post (url, {}, data, function(resp){ 
		
			if(resp.error)	Cloudwalkers.RootView.growl('Oops', "There's something fishy about that e-mail address.");
			else			Cloudwalkers.RootView.growl('User Management', "Invitation on it's way.");
		});

	},
	
	'deleteUser' : function ()
	{
		
		//delete /account/ID/users/USER ID	
	},
	
	/* on it's way to be deprecated */
	'negotiateFunctionalities' : function(el) {
	
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
			"edit_user",
			"select_user",
			"invite_new_user",
			"email",
			"invite_user",
			"userlist",
			"name",
			"type"
		];

		this.translated = [];

		for(k in this.original)
		{
			this.translated[k] = this.translateString(this.original[k]);
			translatelocation["translate_" + this.original[k]] = this.translated[k];
		}
	}

});