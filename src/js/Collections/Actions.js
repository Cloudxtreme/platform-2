define(
	['backbone', 'Session', 'Models/Action', 'Views/Root'],
	function (Backbone, Session, Action, RootView)
	{
		var Actions = Backbone.Collection.extend({
	
			model : Action,
			typestring : "actions",
			modelstring : "action",
			token : "",
			templates :
			{
				'share' : {name: "Share", icon: 'share-alt', token: 'share', type: 'write', maxsize: {'twitter': 140}, clone: true, redirect: false, valuetag: 'shares'},
				'delete' : {name: "Delete", icon: 'remove', token: 'delete', type: 'confirm'},
				'edit' : {name: "Edit", icon: 'edit', token: 'edit', type: 'edit', redirect: false},
				'note_view' : {name: "Note", icon: 'edit', token: 'note', type: 'note', compound: 'note', valuetag: 'notes', hidemetoken: 'hidden'}, //I was desperate
				'note_manage' : {name: "Add note", icon: 'edit', token: 'note', type: 'note', compound: 'note'},
				'tag' : {name: "tag", icon: 'edit', token: 'tag', type: 'tag'},
				'resend' : {name: "Resend", icon: 'arrow-up', token: 'resend', type: 'write'},
				
				// Hack!
				'reply' : {name: "Reply", icon: 'comments-alt', token: 'reply', type: 'write', clone: true, parameters: [{"token":"message","name":"Message", type:"string", required:false, value:"@{{from.name}} "}]},
				'dm' : {name: "DM", icon: 'comments-alt', token: 'dm', type: 'dialog', clone: true, parameters: [{"token":"message","name":"Message","type":"string","required":false,"value":""}]},
				
				// Hack!
				'comment' : {name: "Comment", icon: 'comment', token: 'comment', type: 'dialog', clone: true, compound: 'comment', valuetag: 'comments', tokenview: 'comment-list', maxsize: {'twitter': 140}, parameters: [{"token":"message","name":"Message","type":"string","required":false,"value":""}]},
				
				'retweet' : {name: "Retweet", icon: 'retweet', token: 'retweet', type: 'options', valuetag: 'retweets'},
				'like' : {name: "Like", icon: 'thumbs-up', token: 'like', type: 'options', toggle: 'unlike', valuetag: 'likes'},
				'unlike' : {name: "Unlike", icon: 'thumbs-down', token: 'unlike', type: 'growl', toggle: 'like', actiontype: 'like'},
				'favorite' : {name: "Favorite", icon: 'star', token: 'favorite', type: 'options', toggle: 'unfavorite', valuetag: 'favourites'},
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
			
			initialize : function(models, options)
			{
				if(options) $.extend(this, options);
			
				// Listen to action
				this.listenTo( this.parent, "action", this.startaction);		
			},
			
			parse : function(data)
			{
				return data;
			},
			
			url : function ()
			{	
				// Parent and parameters
				var param = this.parameters? "?" + $.param (this.parameters): "";
				var parent = this.parent? this.parent.get("objectType") + "s/" + this.parent.id: "";
				
				return Session.api + '/' + parent + '/actions' + param;
				// return CONFIG_BASE_URL + 'json/' + parent + '/actions' + param;
			},
			
			rendertokens : function (tokens)
			{	
				var action;
				var renderedtokens = [];
				var stats = this.parent.get("stats");

				if(!tokens)
					tokens = this.parent.get("actiontokens");

				for(n in tokens)
				{	
					token = tokens[n];
					action = this.templates[token];

					if(!action)	continue;

					if(stats)	action = this.appendstat(token);
					
					renderedtokens.push(action);
				}
				
				return renderedtokens;
			},

			appendstat : function(token)
			{	
				if(!this.templates[token])	return;

				var action = {};
				var valuetag = this.templates[token].valuetag || null;

				$.extend(action, this.templates[token]);
				
				if(valuetag && this.parent.get("stats").hasOwnProperty(valuetag))
					action.value = this.parent.get("stats")[valuetag];

				return action;
			},
			
			startaction : function (token)
			{	
				// Triggered action
				var action = this.templates[token];
				// Toggle
				
				this.listenTo(RootView, token.concat(':success'), this.toggleAction);
				
				// Confirm modal
				if (action.type == 'confirm')
				{
					this[token] (this.parent);
					return;
				}
				
				// Show growl
				else if (action.type == 'growl')
				{
					RootView.growl (action.name, this.translateString("the") + " " + action.token + " " + this.translateString("is_planned_with_success"));
					
					action.id = 1;
					action.parent = this.parent;
					
					return new Action(action).destroy();
				}
				
				// Show note
				else if (action.type == 'note')	RootView.writeNote(this.parent);		
				
				// Call Compose modal
				else if (action.type == 'edit')	var params = {model: this.parent};
				else							var params = {reference: this.parent, action: new Action(action)} 
				
				var compose = RootView.compose(params);

				//Uncomment when CLOUD-793 is fixed
				//this.listenTo(compose, 'action:success', function(a){this.parent.updateactions(a)}.bind(this));

				return;

			},
			
			delete : function (model)
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
					RootView.growl (action.name, "The " + token + " is planned with success.");

					return;
				}

				// No? Fallback to old system.
				this.parent.messageAction (action);

				return;

			},*/
			
			
			
			like : function ()
			{
			},

			toggleAction: function (token)
			{
				var action = this.templates[token];
				this.parent.trigger("action:toggle", token, this.templates[action.toggle]);
			},

			translateString : function(translatedata)
			{	
				// Translate String
				return Session.polyglot.t(translatedata);
			}
		});
		
		return Actions;
});