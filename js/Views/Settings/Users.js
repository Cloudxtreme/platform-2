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

	},

	'render' : function ()
	{
		var account = Cloudwalkers.Session.getAccount();
		var data = {};
		
		this.$el.html (Mustache.render (Templates.settings.users, data));
		
		account.users.hook({success: this.fill.bind(this), error: this.fail});
		
		
		
		
		/*
		var administrators = new Cloudwalkers.Collections.Users ([], {});

		this.collections.push (administrators);

		this.addUserContainer ('Users', administrators);

		// Work widgets
		this.$el.find(".collapse-closed, .collapse-open").each( function(){ self.negotiateFunctionalities(this) });*/
		
		return this;
	},
	
	
	'fill' : function (collection)
	{	
		var $container = this.$el.find(".user-container").eq(-1);
		
		console.log(collection);
		
		collection.each (function (user)
		{
			var view = new Cloudwalkers.Views.Settings.User ({ 'model' : user });
			$container.append(view.render().el);
		});
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
	
	'negotiateFunctionalities' : function(el) {
		
		// Check collapse option
		$(el).find('.portlet-title').on('click', function(){ $(this).parents(".collapse-closed, .collapse-open").toggleClass("collapse-closed collapse-open"); });
	},
	
	'fail' : function ()
	{
		Cloudwalkers.RootView.growl ("Oops", "Something went sideways, please reload the page.");
	}

});