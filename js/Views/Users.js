Cloudwalkers.Views.Users = Backbone.View.extend({

	'events' : {
		'click .add-user' : 'addUser',
		'submit .edit-user-profile' : 'editUserProfile',
		'click .invite-user' : 'addUser'
	},

	'class' : 'section',
	'collections' : [],

	'render' : function ()
	{
		var self = this;

		var administrators = new Cloudwalkers.Collections.Users ([], {});
		//var users = new Cloudwalkers.Collections.Users ([], { 'filters' : { 'level' : 0 }});

		this.collections.push (administrators);
		//this.collections.push (users);

		//this.$el.append ('<div class="button-row"><a href="javascript:void(0);" class="add-user"><span>Add new user</span></a></div>');

		this.addUserContainer ('Users', administrators);
		//this.addUserContainer ('Co-Workers', users);

		// Enable fileupload plugin
		setTimeout( function(){ console.log($('#user-avatar').fileupload({name: "avatar"})); }, 200);
		
		return this;
	},

	'addUserContainer' : function (title, collection)
	{
		var user = Cloudwalkers.Session.getUser ();

		var self = this;

		var data = {};
		data.title = title;
		data.user = user.attributes;

		var html = $(Mustache.render (Templates.users, data));

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
			var view = new Cloudwalkers.Views.User ({ 'model' : model });
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
		var view = new Cloudwalkers.Views.AddUser ();
		Cloudwalkers.RootView.popup (view);
	},

	'editUserProfile' : function (e)
	{
		var user = Cloudwalkers.Session.getUser ();
		var name = this.$el.find ('[name=name]').val ();

		user.set ('name', name);
		user.save ({}, { 'success' : function () {  }});
	}
});