Cloudwalkers.Views.Notification = Cloudwalkers.Views.Entry.extend({
	
	'template': 'message',
	
	'events' : {
		'mouseover' : 'toggleactions',
		'mouseout' : 'toggleactions',
		'click *[data-notification-action]' : 'action',
		'click .viewcommentcontact': 'togglecommentcontact'
	},
	
	/*'initialize' : function (options)
	{
		// Add options to view
		if (options) $.extend(this, options);
		
		// Get actions
		if(!this.model.actions)
			this.model.actions = new Cloudwalkers.Collections.Actions(false, {parent: this.model});
		
		this.model.on ('change', this.render.bind(this));
		this.listenTo(this.model, 'action:toggle', this.toggleaction);
	},*/

	'render' : function ()
	{
		
		// Parameters
		$.extend(this.parameters, this.model.attributes);
		
		if(this.model.get("objectType")) this.parameters.actions = this.model.filterActions();
		
		// Visualize
		this.$el.html (Mustache.render (Templates[this.template], this.parameters));
		
		/*// Build parameters
		var params = {from: this.model.get("from"), body: this.model.get("body"), attachments: {}};
		
		if (this.model.get("date")) 		params.fulldate = moment(this.model.get("date")).format("DD MMM");
		if (this.model.get("attachments"))	$.each(this.model.get("attachments"), function(n, object){ params.attachments[object.type] = object });
		
		if (this.active) this.$el.addClass("active");
		
		// Get actions
		params.actions = this.model.get("objectType")? this.model.actions.rendertokens(): [];
		
		// Visualize
		this.$el.html (Mustache.render (Templates[this.template], params));
		
		// Mark as read
		if (this.model.get("objectType") && this.model.get("read") === 0) this.markasread();*/
		
		return this;
	},
	
	'action' : function (e)
	{
		// Action token
		var token = $(e.currentTarget).data ('notification-action');
		
		this.model.trigger("action", token);
	},
	
	'toggleaction' : function (token, newaction)
	{
		
		var current = this.$el.find('div[data-notification-action="' + token + '"]');
		var clone = current.clone();
		
		// new Action edits
		clone.attr("data-notification-action", newaction.token).find("i").attr("class", "").addClass("icon-" + newaction.icon);
		
		// Remove old Action
		current.before(clone).remove();	

	},
	
	'toggleactions' : function(e)
	{
		var out = e.originalEvent.type == "mouseout";
		
		this.$el.find(".message-actions")[out? "addClass": "removeClass"]("hidden");
		this.$el.find(".comment-info")[out? "removeClass": "addClass"]("hidden");	
	},
	
	'markasread' : function()
	{
		// Send update
		this.model.save({read: 1}, {patch: true, wait: true});
		
		// Mark stream
		if (this.model.get("stream"))
			Cloudwalkers.Session.getStreams().outdated(this.model.get("stream"));
	},

	'togglecommentcontact' : function()
	{
		var contact = this.model.attributes.from ? this.model.attributes.from[0] : null;
		if(contact)	Cloudwalkers.RootView.viewContact({model: contact});
	}
	
	/*'action' : function (element)
	{
		var actiontoken = $(element.currentTarget).data ('notification-action');
		
		action = this.model.getAction (actiontoken);

		if (action == null)
		{
			console.log ('No action found: ' + actiontoken);
			return;
		}

		var targetmodel = this.model;
		if (typeof (action.target) != 'undefined')
		{
			targetmodel = action.target;

			if (typeof (action.originalaction) != 'undefined')
			{
				action = action.originalaction;
			}
		}

		if (typeof (action.callback) != 'undefined')
		{
			action.callback (targetmodel);
		}
		else
		{
			if (action)
			{
				if (action.type == 'dialog')
				{
					var view = new Cloudwalkers.Views.ActionParameters ({
						'message' : targetmodel,
						'action' : action
					});
					Cloudwalkers.RootView.popup (view);
				}
				else if (action.type == 'simple')
				{
					targetmodel.act (action, {}, function (){});
				}

				else if (action.type == 'write')
				{
					Cloudwalkers.RootView.writeDialog 
					(
						targetmodel,
						action
					);
				}
			}
		}
	}*/
});