Cloudwalkers.Views.Message = Backbone.View.extend({

	'events' : 
	{
		'click .button-post.action.message-action' : 'messageAction',
		'click .children-button.message-children' : 'showchildren'
	},

	'className' : 'message-view',

	'template' : 'message',
	'tagName' : 'tr',

	'commentsVisible' : false,
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
		return data;
	},

	'render' : function ()
	{
		var data = this.prepareData ();

		if (typeof (data.parent) != 'undefined' && typeof (this.options.childtemplate) != 'undefined')
		{
			$(this.el).html (Mustache.render (Templates[this.options.childtemplate], data));	
		}

		else if (typeof (this.options.template) != 'undefined')
		{
			$(this.el).html (Mustache.render (Templates[this.options.template], data));		
		}

		else if (typeof (data.parent) != 'undefined')
		{
			$(this.el).html (Mustache.render (Templates.messagecomment, data));	
		}

		else
		{
			$(this.el).html (Mustache.render (Templates[this.template], data));
		}

		updateTimers ();

		//console.log (this.model.attributes);
		if (data.parent)
		{
			var parameters = { 'model' : data.parent };

			if (typeof (this.options.originaltemplate) != 'undefined')
			{
				parameters.template = this.options.originaltemplate;
			}

			var parentview = new Cloudwalkers.Views.OriginalMessage (parameters);
			this.$el.find ('.parent-message-view').html (parentview.render().el);
		}

		this.$el.find ('span.actions').parent ().on ('mouseup', function (e)
		{
			e.stopPropagation ();
		});

		return this;
	},

	'messageAction' : function (element)
	{
		element.stopPropagation ();
		element.preventDefault ();

		var action = $(element.currentTarget).attr ('data-action');
		
		action = this.model.getAction (action);
		if (action == null)
		{
			return;
		}

		if (typeof (action.callback) != 'undefined')
		{
			action.callback (this.model);
		}
		else
		{
			if (action)
			{
				if (action.type == 'dialog')
				{
					var view = new Cloudwalkers.Views.ActionParameters ({
						'message' : this.model,
						'action' : action
					});
					Cloudwalkers.RootView.popup (view);
				}
				else if (action.type == 'simple')
				{
					this.model.act (action, {});
				}

				else if (action.type == 'write')
				{
					Cloudwalkers.RootView.writeDialog 
					(
						this.model,
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
			this.commentsVisible = true;

			this.$el.find ('.comment-label').html ('Hide comments');

			var view = new Cloudwalkers.Views.Comments ({ 'parent' : this.model });
			this.$el.find ('.' + this.childrencontainer).html (view.render ().el).show ();
		}
	}

});