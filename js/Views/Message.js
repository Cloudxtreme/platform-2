Cloudwalkers.Views.Message = Backbone.View.extend({

	'events' : 
	{
		'click [data-action]' : 'messageAction',
		'click .children-button.message-children' : 'showchildren'
	},

	'className' : 'message-view',

	'template' : 'message',
	'tagName' : 'tr',

	'commentsVisible' : false,
	'commentsView' : null,

	'childrencontainer' : 'comment-container',

	'initialize' : function ()
	{
		var self = this;
		this.model.on ('change', function ()
		{
			self.render ();	
		});
	},

	'prepareData' : function ()
	{
		var self = this;
		var data = jQuery.extend(true, {}, this.model.attributes);

		data.humandate = this.model.humandate();
		data.dateonly = this.model.shortdate ();
		data.time = this.model.time ();

		data.sortedattachments = {};

		// Go trough all attachments and put them in groups
		var attachments = this.model.getProcessedAttachments ();

		if (attachments.length > 0)
		{
			for (var i = 0; i < attachments.length; i ++)
			{
				if (typeof (data.sortedattachments[data.attachments[i].type]) == 'undefined')
				{
					data.sortedattachments[attachments[i].type] = [];
				}
				data.sortedattachments[attachments[i].type].push(attachments[i]);
			}
		}

		//console.log (this.model);

		// Stream information
		if (this.model.getStream ())
		{
			data.stream = this.model.getStream ().attributes;
		}

		if (this.model.collection)
		{
			data.channel = this.model.collection.id;
		}

		return this.additionalData (data);
	},

	'additionalData' : function (data)
	{
		if (this.model.get ('type') == 'OUTGOING')
		{
			data.scheduledate = this.model.scheduledate ();
		}

		return data;
	},

	'render' : function ()
	{
		var data = this.prepareData ();
		var self = this;

		if (typeof (data.parentmodel) != 'undefined' && typeof (this.options.childtemplate) != 'undefined')
		{
			$(this.el).html (Mustache.render (Templates[this.options.childtemplate], data));	
		}

		else if (typeof (this.options.template) != 'undefined')
		{
			$(this.el).html (Mustache.render (Templates[this.options.template], data));		
		}

		else if (typeof (data.parentmodel) != 'undefined')
		{
			$(this.el).html (Mustache.render (Templates.messagecomment, data));	
		}

		else
		{
			$(this.el).html (Mustache.render (Templates[this.template], data));
		}

		updateTimers ();

		//console.log (this.model.attributes);
		if (data.parentmodel)
		{
			//console.log (data.parent);

			var parameters = { 'model' : data.parentmodel };

			if (typeof (this.options.originaltemplate) != 'undefined')
			{
				parameters.template = this.options.originaltemplate;
			}

			var parentview = new Cloudwalkers.Views.OriginalMessage (parameters);
			this.$el.find ('.parent-message-view').html (parentview.render().el);
		}

		this.$el.find ('.actions.dropdown').on ('click', function (e)
		{
			e.stopPropagation ();

			self.$el.find ('.dropdown-menu').dropdown ('toggle');

			self.$el.find ('[data-action]').unbind('click').click (function (e)
			{
				//alert ('yues');
				self.messageAction (e);
			})
		});

		if (this.commentsVisible || this.options.showcomments)
		{
			this.showchildrenexec ();
		}

		this.afterRender ();

		return this;
	},

	'messageAction' : function (element)
	{
		//element.stopPropagation ();
		//element.preventDefault ();

		console.log (element);

		if ($(element.currentTarget).is ('[data-action]'))
		{
			var action = $(element.currentTarget).attr ('data-action');
		}
		else if ($(element.target).is ('[data-action]'))
		{
			var action = $(element.target).attr ('data-action');	
		}
		else
		{
			var action = $(element.target).parent ('[data-action]').attr ('data-action');	
		}
		action = this.model.getAction (action);

		var targetmodel = this.model;
		if (typeof (action.target) != 'undefined')
		{
			targetmodel = action.target;

			if (typeof (action.originalaction) != 'undefined')
			{
				action = action.originalaction;
			}
		}

		if (action == null)
		{
			return;
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
					targetmodel.act (action, {});
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

	'afterRender' : function ()
	{

	},

	'showchildren' : function (e)
	{
		e.stopPropagation ();
		e.preventDefault ();

		if (this.commentsVisible)
		{
			this.commentsVisible = false;

			this.$el.find ('.comment-label').html ('Show comments');

			// Hide
			this.$el.find ('.' + this.childrencontainer).hide ();
		}
		else
		{
			this.showchildrenexec ();
		}
	},

	'showchildrenexec' : function ()
	{
		if (this.commentsView == null)
		{
			var params = {};

			params.parent = this.model;

			if (typeof (this.options.selectedchild) != 'undefined')
			{
				params.selectedchild = this.options.selectedchild;
			}

			this.commentsView = new Cloudwalkers.Views.Comments (params)
			this.commentsView.render ();
		}

		this.commentsVisible = true;
		this.$el.find ('.comment-label').html ('Hide comments');
		this.$el.find ('.' + this.childrencontainer).html (this.commentsView.el).show ();
	}

});