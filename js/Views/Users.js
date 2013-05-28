Cloudwalkers.Views.Users = Backbone.View.extend({

	'class' : 'section',

	'render' : function ()
	{
		var self = this;

		var administrators = new Cloudwalkers.Collections.Users ([], { 'filters' : { 'level' : 0 }});
		var users = new Cloudwalkers.Collections.Users ([], { 'filters' : { 'level' : 10 }});

		this.addUserContainer ('Administrators', administrators);
		this.addUserContainer ('Co-Workers', users);

		return this;
	},

	'addUserContainer' : function (title, collection)
	{
		var data = {};
		data.title = title;

		var html = $(Mustache.render (Templates.users, data));

		collection.on ('reset', function ()
		{
			//html.find ('.scrollable-area').html ('<p>Currently there are no users in this section.</p>');
			collection.each 
			(
				function (model) {
					var view = new Cloudwalkers.Views.User ({ 'model' : model });
					html.find ('.message-container').append (view.render ().el);
				}
			);
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
	}
});