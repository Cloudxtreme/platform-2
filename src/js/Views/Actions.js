define(
	['backbone', 'mustache', 'Views/Action'],
	function (Backbone, Mustache, ActionView)
	{
		var Actions = Backbone.View.extend({

			className : 'message-actions-wrapper',

			actionsright : [],
			actionsleft : [],
			compounds : [],

			initialize : function(options)
			{
				$.extend(this, options);
				
				this.listenTo(this.message.notes, 'ready', this.updateactions.bind(this, "notes"));
				this.listenTo(this.message.notes, 'destroy', this.updateactions.bind(this, "notes"));
				this.listenTo(this.message.actions, 'sync', this.updateactions);
				this.listenTo(this.message.actions, 'destroy', this.updateactions);
			},

			render : function(token)
			{	
				this.selected = this.$el.find('.inactive').data('token');

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

			fillactions : function(token)
			{	
				var actions;
				var compound;
				var action;
				var inactive;

				if(this.message)	actions = this.message.filterActions(token);
				else				return;
				
				this.reorderactions(actions);
				
				for (var n in actions)
				{	
					compound = actions[n].compound? this.getcompoundactions(actions, actions[n]): null;

					// prevent duplicates on complex compounds
					if(compound && compound.length)
						if(this.compounds.indexOf(compound[0].compound) >= 0)
							continue;
						else
							this.compounds.push(compound[0].compound)

					if(this.selected){
						if(compound && (compound[0].token == this.selected))
							inactive = 'inactive';

						else if(!compound && actions[n].token == this.selected)
							inactive = 'inactive';

						else
							inactive = false;
					}

					action = new ActionView({action: compound || actions[n], inactive: inactive})

					this['actions'+action.position].push(action)
				}
			},

			getcompoundactions : function(actions, action)
			{
				actions.filter(
					function(a){
						return a.compound == action.compound
					});

				return actions;
			},

			reorderactions : function(actions)
			{	
				var del;

				for (var n in actions){
					if (actions[n].token == 'delete')
						del = actions.splice(n,1);
				}

				if(del)
					actions.push(del[0]);
				
			},

			updateactions : function(token)
			{	
				this.render(token);
				this.trigger("actions:update")
			},

			renderactions : function(position, actions)
			{	
				var container = this.$el.find('.actions-'+position);
				
				for (var n in actions){
					container.append(actions[n].render().el);
				}

			},

			incrementaction : function(token)
			{	
				var action = this.actionsright.filter(function(act){ return act.action.token == token});

				if (!action)
					action = this.actionsleft.filter(function(act){ return act.action.token == token});

				if (action)	
					action[0].increment();
			}
		});

		return Actions;
});