Cloudwalkers.Views.Actions = Backbone.View.extend({

	'actionsright' : [],
	'actionsleft' : [],
	'compounds' : [],

	'initialize' : function(options)
	{
		$.extend(this, options);

		this.listenTo(this.message.notes, 'ready', this.updateactions.bind(this, "notes"));
		this.listenTo(this.message.notes, 'destroy', this.updateactions.bind(this, "notes"));
		this.listenTo(this.message.actions, 'ready', this.updateactions);
		this.listenTo(this.message.actions, 'destroy', this.updateactions);

	},

	'render' : function(token)
	{	
		this.actionsleft = [];
		this.actionsright = [];
		this.compounds = [];

		//Default values
		this.fillactions(token);

		this.$el.html(Mustache.render(Templates.actions));

		this.renderactions('left', this.actionsleft);
		this.renderactions('right', this.actionsright);
		
		return this;
	},

	'fillactions' : function(token)
	{	
		var actions;
		var compound;
		var action;

		if(this.message)	actions = this.message.filterActions(token);
		else				return;
		
		for(n in actions)
		{	
			compound = actions[n].compound? actions.filter(function(a){ return a.compound == actions[n].compound}): null;

			if(compound && compound.length)
				if(this.compounds.indexOf(compound[0].compound) >= 0)
					return;
				else
					this.compounds.push(compound[0].compound)


			var action = new Cloudwalkers.Views.Action({action: compound || actions[n]})

			this['actions'+action.position].push(action)
		}
	},

	'updateactions' : function(token)
	{
		this.render(token);
	},

	'renderactions' : function(position, actions)
	{	
		var container = this.$el.find('.actions-'+position);
		
		for(n in actions){
			container.append(actions[n].render().el);
		}

	},

	'incrementaction' : function(token)
	{	
		var action = this.actionsright.filter(function(act){ return act.action.token == token});

		if (!action)
			action = this.actionsleft.filter(function(act){ return act.action.token == token});

		if (action)	
			action[0].increment();
	}
});