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
		var data = this.model.attributes;
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

		if (typeof (this.model.attributes.parent) != 'undefined')
		{
			data.parent = new Cloudwalkers.Models.Message (this.model.attributes.parent);
			//console.log (data.parent);
		}

		// Stream information
		if (this.model.getStream ())
		{
			data.stream = this.model.getStream ().attributes;
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

		console.log (data);

		if (typeof (this.options.template) != 'undefined')
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
			var parentview = new Cloudwalkers.Views.OriginalMessage ({ 'model' : data.parent });
			this.$el.find ('.parent-message-view').html (parentview.render().el);
		}

		return this;
	},

	'messageAction' : function (element)
	{
		var action = $(element.currentTarget).attr ('data-action');
		
		action = this.model.getAction (action);

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
					Cloudwalkers.RootView.popup 
					(
						new Cloudwalkers.Views.Write 
						(
							{ 
								'model' : this.model.clone (), 
								'clone' : true, 
								'actionparameters' : action.parameters 
							}
						)
					);
				}
			}
		}
	},

	'afterRender' : function ()
	{

	},

	'showchildren' : function ()
	{
		if (this.commentsVisible)
		{
			this.commentsVisible = false;

			// Hide
			this.$el.find ('.comment-container').hide ();
		}
		else
		{
			this.commentsVisible = true;

			var view = new Cloudwalkers.Views.Comments ({ 'parent' : this.model });
			this.$el.find ('.comment-container').html (view.render ().el).show ();
		}
	}

});