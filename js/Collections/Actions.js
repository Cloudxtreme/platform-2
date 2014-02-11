Cloudwalkers.Collections.Actions = Backbone.Collection.extend({
	
	'model' : Cloudwalkers.Models.Action,
	'typestring' : "actions",
	'modelstring' : "action",
	'token' : "",
	'templates' :
	{
		'share' : {name: "Share", icon: 'share-alt', token: 'share', type: 'write', maxsize: {'twitter': 140}, clone: true, redirect: false},
		'delete' : {name: "Delete", icon: 'remove', token: 'delete', type: 'confirm'},
		'edit' : {name: "Edit", icon: 'edit', token: 'delete', type: 'write', redirect: false},
		'reply' : {name: "Reply", icon: 'comment', token: 'reply', type: 'dialog'},
		'comment' : {name: "Comment", icon: 'comment', token: 'comment', type: 'write', maxsize: {'twitter': 140}},
		'retweet' : {name: "Retweet", icon: 'retweet', token: 'retweet', type: 'options'},
		'like' : {name: "Like", icon: 'thumbs-up', token: 'like', type: 'options'},
		'unlike' : {name: "Unlike", icon: 'thumbs-down', token: 'unlike', type: 'options'},
		'favorite' : {name: "Favorite", icon: 'star', token: 'favorite', type: 'options'},
		'unfavorite' : {name: "Unfavorite", icon: 'star-empty', token: 'unfavorite', type: 'options'},
		'plusone' : {name: "Unfavorite", icon: 'google-plus-sign', token: 'plusone', type: 'options'},
		'unplusone' : {name: "Unfavorite", icon: 'google-plus-sign', token: 'unplusone', type: 'options'}
	},
	
	'initialize' : function(models, options)
	{
		if(options) $.extend(this, options);
		
		// Listen to action
		this.listenTo( this.parent, "action", this.startaction);
		
	},
	
	'parse' : function(data)
	{
		return data;
	},
	
	'url' : function ()
	{	
		// Parent and parameters
		var param = this.parameters? "?" + $.param (this.parameters): "";
		var parent = this.parent? this.parent.get("objectType") + "s/" + this.parent.id: "";
		
		return CONFIG_BASE_URL + 'json/' + parent + '/actions' + param;
	},
	
	'startaction' : function (token)
	{
		// Triggered action
		var action = this.templates[token];
		

		// Activate action
		if (action.type == 'write')
		{
			action.model = this.parent;
			Cloudwalkers.RootView.popup (new Cloudwalkers.Views.Write (action));
		}
		else if (action.type == 'dialog')
		{
			Cloudwalkers.RootView.popup (new Cloudwalkers.Views.Write (action));
		}
		else if (action.type == 'confirm')
		{
			this[token] (this.parent);
		}
		else if (action.type == 'options')
		{
			// Create Action
			var like = this.create(action);
			
			// Notify action (temp)
			Cloudwalkers.RootView.growl (action.name, "The " + token + " is planned with success.");
		}
	},
	
	'rendertokens' : function (list)
	{
		for(n in list) list[n] = this.templates[list[n]];

		return list;
	},
	
	'delete' : function (model)
	{
		model.deleteMessage ();
	},
	
	'like' : function ()
	{
		
	}
});