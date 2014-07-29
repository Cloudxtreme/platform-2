Cloudwalkers.Collections.Actions = Backbone.Collection.extend({
	
	'model' : Cloudwalkers.Models.Action,
	'typestring' : "actions",
	'modelstring' : "action",
	'token' : "",
	'templates' :
	{
		'share' : {name: "Share", icon: 'share-alt', token: 'share', type: 'write', maxsize: {'twitter': 140}, clone: true, redirect: false},
		'delete' : {name: "Delete", icon: 'remove', token: 'delete', type: 'confirm'},
		'edit' : {name: "Edit", icon: 'edit', token: 'edit', type: 'edit', redirect: false},
		'note' : {name: "Note", icon: 'edit', token: 'note', type: 'note'},
		'tag' : {name: "tag", icon: 'edit', token: 'tag', type: 'tag'},
		
		// Hack!
		'reply' : {name: "Reply", icon: 'comments-alt', token: 'reply', type: 'write', clone: true, parameters: [{"token":"message","name":"Message", type:"string", required:false, value:"@{{from.name}} "}]},
		'dm' : {name: "DM", icon: 'comments-alt', token: 'dm', type: 'dialog', clone: true, parameters: [{"token":"message","name":"Message","type":"string","required":false,"value":""}]},
		
		// Hack!
		'comment' : {name: "Comment", icon: 'comment', token: 'comment', type: 'dialog', clone: true, maxsize: {'twitter': 140}, parameters: [{"token":"message","name":"Message","type":"string","required":false,"value":""}]},
		
		'retweet' : {name: "Retweet", icon: 'retweet', token: 'retweet', type: 'options'},
		'like' : {name: "Like", icon: 'thumbs-up', token: 'like', type: 'options', toggle: 'unlike'},
		'unlike' : {name: "Unlike", icon: 'thumbs-down', token: 'unlike', type: 'growl', toggle: 'like', actiontype: 'like'},
		'favorite' : {name: "Favorite", icon: 'star', token: 'favorite', type: 'options', toggle: 'unfavorite'},
		'unfavorite' : {name: "Unfavorite", icon: 'star-empty', token: 'unfavorite', type: 'growl', toggle: 'favorite', actiontype: 'favorite'},
		'plusone' : {name: "Unfavorite", icon: 'google-plus-sign', token: 'plusone', type: 'options', toggle: 'unplusone'},
		'unplusone' : {name: "Unfavorite", icon: 'google-plus-sign', token: 'unplusone', type: 'growl', toggle: 'plusone', actiontype: 'plusone'}
	},

	/*'blocked' : {
		'comment' : ['campaign'],
		'reply' : ['campaign'],
		'dm' : ['campaign'],
		'retweet' : ['campaign'],
		'like' : ['campaign', 'repeat'],
		'unlike' : ['campaign'],
		'favorite' : ['campaign'],
		'unfavorite' : ['campaign'],
		'plusone' : ['campaign'],
		'unplusone' : ['campaign'],
	},*/
	
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
		
		// Admin only
		//if(!Cloudwalkers.Session.getUser().level) return [];
		
		return tokens.map(function(token)
			{ return this.templates[token] }.bind(this));
	},
	
	'startaction' : function (token)
	{
		// Triggered action
		var action = this.templates[token];

		// Toggle
		if (action.toggle) this.parent.trigger("action:toggle", token, this.templates[action.toggle]);
		
		// Confirm modal
		if (action.type == 'confirm')
		{
			this[token] (this.parent);
			return;
		}
		
		// Show growl
		else if (action.type == 'growl')
		{
			Cloudwalkers.RootView.growl (action.name, "The " + token + " is planned with success.");
			
			action.id = 1;
			action.parent = this.parent;
			
			return new Cloudwalkers.Models.Action(action).destroy();
		}
		
		// Show note
		else if (action.type == 'note')	Cloudwalkers.RootView.writeNote(this.parent);		
		
		// Call Compose modal
		else if (action.type == 'edit')	var params = {model: this.parent};
		else							var params = {reference: this.parent, action: new Cloudwalkers.Models.Action(action)} 
		
		Cloudwalkers.RootView.compose(params);

		return;

	},
	
	'delete' : function (model)
	{
		model.deleteMessage ();
	},
	
/*	'startaction' : function (token)
	{
		// Triggered action
		var action = this.templates[token];

		// BRAND NEW WAY!
		if (action.type == 'confirm')
		{
			this[token] (this.parent);
			return;
		}

		else if (action.type == 'options')
		{
			// Create Action
			var actionModel = this.create(action);

			// Toggle
			if(action.toggle) this.parent.trigger("action:toggle", token, this.templates[action.toggle]);

			// Notify action (temp)
			Cloudwalkers.RootView.growl (action.name, "The " + token + " is planned with success.");

			return;
		}

		// No? Fallback to old system.
		this.parent.messageAction (action);

		return;

	},*/
	
	
	
	'like' : function ()
	{
		
	}
});