Cloudwalkers.Views.Entry = Backbone.View.extend({
	
	'tagName' : 'li',
	'template': 'messageentry',
	
	'events' : 
	{
		'remove' : 'destroy',
		'click *[data-action]' : 'action',
		'click' : 'toggle',
	},
	
	'initialize' : function ()
	{
		if(this.options.template) this.template = this.options.template;
		
		this.listenTo(this.model, 'change', this.render);
	},

	'render' : function ()
	{
		this.$el.html (Mustache.render (Templates[this.template], this.options.model.filterData(this.options.type)));
		
		if(this.$el.find("[data-date]")) this.time();
		
		if(this.options.type == "inbox" && this.model.get("objectType")) this.checkUnread();
		
		return this;
	},
	
	'toggle' : function() { this.trigger("toggle", this); },
	
	'checkUnread' : function()
	{
		if(!this.model.get("read")) this.$el.addClass("unread");
		else						this.$el.removeClass("unread");
	},
	
	'action' : function (element)
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
	},
	
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