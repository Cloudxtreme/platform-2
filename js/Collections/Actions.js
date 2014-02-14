Cloudwalkers.Collections.Actions = Backbone.Collection.extend({
	
	'model' : Cloudwalkers.Models.Action,
	'typestring' : "actions",
	'modelstring' : "action",
	'token' : "",
	'templates' :
	{
		'share' : {name: "Share", icon: 'share-alt', token: 'share', type: 'write', maxsize: {'twitter': 140}, clone: true, redirect: false},
		'delete' : {name: "Delete", icon: 'remove', token: 'delete', type: 'confirm'},
		'edit' : {name: "Edit", icon: 'edit', token: 'edit', type: 'write', redirect: false},
		'reply' : {name: "Reply", icon: 'comments-alt', token: 'reply', type: 'dialog'},
		'comment' : {name: "Comment", icon: 'comment', token: 'comment', type: 'write', maxsize: {'twitter': 140}},
		'retweet' : {name: "Retweet", icon: 'retweet', token: 'retweet', type: 'options'},
		'like' : {name: "Like", icon: 'thumbs-up', token: 'like', type: 'options', toggle: 'unlike'},
		'unlike' : {name: "Unlike", icon: 'thumbs-down', token: 'unlike', type: 'options', toggle: 'like'},
		'favorite' : {name: "Favorite", icon: 'star', token: 'favorite', type: 'options', toggle: 'unfavorite'},
		'unfavorite' : {name: "Unfavorite", icon: 'star-empty', token: 'unfavorite', type: 'options', toggle: 'favorite'},
		'plusone' : {name: "Unfavorite", icon: 'google-plus-sign', token: 'plusone', type: 'options', toggle: 'unplusone'},
		'unplusone' : {name: "Unfavorite", icon: 'google-plus-sign', token: 'unplusone', type: 'options', toggle: 'plusone'}
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
	
	'rendertokens' : function (tokens)
	{
		if(!tokens)
			tokens = this.parent.get("actiontokens");
		
		return tokens.map(function(token)
			{ return this.templates[token] }.bind(this));
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
			
			// Toggle
			if(action.toggle) this.parent.trigger("action:toggle", token, this.templates[action.toggle]); 
			
			// Notify action (temp)
			Cloudwalkers.RootView.growl (action.name, "The " + token + " is planned with success.");
		}
	},
	
	'delete' : function (model)
	{
		model.deleteMessage ();
	},
	
	'like' : function ()
	{
		
	}
});