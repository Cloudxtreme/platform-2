Cloudwalkers.Views.Users = Backbone.View.extend({

	'events' : {
		'click .add-user' : 'addUser'
	},

	'class' : 'section',
	'collections' : [],

	'render' : function ()
	{
		var self = this;

		var administrators = new Cloudwalkers.Collections.Users ([], { 'filters' : { 'level' : 10 }});
		var users = new Cloudwalkers.Collections.Users ([], { 'filters' : { 'level' : 0 }});

		this.collections.push (administrators);
		this.collections.push (users);

		this.$el.append ('<div class="button-row"><a href="javascript:void(0);" class="add-user"><span>Add new user</span></a></div>');

		this.addUserContainer ('Administrators', administrators);
		this.addUserContainer ('Co-Workers', users);

		return this;
	},

	'addUserContainer' : function (title, collection)
	{
		var self = this;

		var data = {};
		data.title = title;

		var html = $(Mustache.render (Templates.users, data));

		collection.on ('reset', function ()
		{
			html.find ('.message-container').html ('');
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
			html.find ('.message-container').append (view.render ().el);
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
	}
});