Cloudwalkers.Views.Entry = Backbone.View.extend({
	
	'tagName' : 'li',
	'template': 'messageentry',
	'notifications' : [],
	'parameters' : {},
	
	'events' : 
	{
		'remove' : 'destroy',
		'click [data-notifications]' : 'loadNotifications',
		'click [data-youtube]' : 'loadYoutube',
		'click *[data-action]' : 'action',
		'click' : 'toggle'
	},
	
	'initialize' : function (options)
	{
		if(options) $.extend(this, options);
		
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'action:toggle', this.toggleaction);
	},

	'render' : function ()
	{
		// Visualize
		this.$el.html (Mustache.render (Templates[this.template], this.model.filterData(this.type, this.parameters)));
		
		if(this.$el.find("[data-date]")) this.time();
		
		if(this.checkunread && this.model.get("objectType")) this.checkUnread();
		
		return this;
	},
	
	'action' : function (element)
	{
		// Action token
		var token = $(element.currentTarget).data ('action');
		
		this.model.trigger("action", token);
	},
	
	'toggleaction' : function (token, newaction)
	{
		// Action element
		var action = this.$el.find('div[data-action="' + token + '"]').data("action", newaction.token);
		
		action.find("i").attr("class", "").addClass("icon-" + newaction.icon);
	},
	
	'toggle' : function() { this.trigger("toggle", this); },
	
	'checkUnread' : function()
	{
		if(!this.model.get("read")) this.$el.addClass("unread");
		else						this.$el.removeClass("unread");
	},
	
	'loadNotifications' : function()
	{
		
		// Does collection exist?
		if(!this.model.notifications)
			this.model.notifications = new Cloudwalkers.Collections.Notifications();
		
		// Load notifications
		this.listenTo(this.model.notifications, 'seed', this.fillNotifications);
		
		this.model.notifications.touch(this.model, {records: 50});
		
	},
	
	'fillNotifications' : function (list)
	{		
		// Clean load
		$.each(this.notifications, function(n, entry){ entry.remove()});
		this.notifications = [];
		
		// Create array if collection
		if(list.models) list = list.models;
		
		// Clear comments list
		var $container = this.$el.find(".timeline-comments").eq(0).html("");

		// Add models to view
		for (n in list)
		{
			var view = new Cloudwalkers.Views.Notification ({model: list[n], template: 'timelinecomment'});
			this.notifications.push (view);
			
			$container.append(view.render().el);
		}
	},
	
	'loadYoutube' : function ()
	{		
		// Get container
		var $container = this.$el.find(".timeline-video").eq(0);
		var url = $container.data("youtube");
		
		// Activate container
		$container.attr("data-youtube", "").removeClass("inactive");

		// Add youtube to view
		$container.html (Mustache.render (Templates.youtube, {url: url}));
	},
	
	/*'action' : function (element)
	{
		if ($(element.currentTarget).is ('[data-action]'))
		{
			var actiontoken = $(element.currentTarget).attr ('data-action');
		}
		else if ($(element.target).is ('[data-action]'))
		{
			var actiontoken = $(element.target).attr ('data-action');	
		}
		else
		{
			var actiontoken = $(element.target).parent ('[data-action]').attr ('data-action');	
		}
		
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
	},*/
	
	'time' : function ()
	{
		var now = new Date;
		var date = new Date(this.$el.find("[data-date]").attr("data-date"));
		var diff = Math.round((now.getTime()-date.getTime()) *.001);
		var human;
		
		if(diff < 60)			human = "now";
		else if(diff < 3600)	human = Math.round(diff/60) + "m";
		else if(diff < 86400)	human = Math.round(diff/3600) + "h";
		else if(diff < 2592000)	human = Math.round(diff/86400) + "d";
		else					human = Math.round(diff/2592000) + "mo";
		
		this.$el.find("[data-date]").html(human);
		
		this.tm = setTimeout(this.time.bind(this), 60000);
	},
	
	'destroy' : function ()
    {
		window.clearTimeout(this.tm);
    }

});