Cloudwalkers.Views.Message = Backbone.View.extend({

	'events' : 
	{
		'click .button-post.action' : 'messageAction',
		'click .children-button' : 'showchildren'
	},

	'className' : 'message-view',

	'template' : 'message',

	'commentsVisible' : false,

	'prepareData' : function ()
	{
		var data = this.model.attributes;
		data.humandate = this.model.humandate();
		data.sortedattachments = {};

		// Go trough all attachments and put them in groups
		if (typeof (data.attachments) != 'undefined')
		{
			for (var i = 0; i < data.attachments.length; i ++)
			{
				if (typeof (data.sortedattachments[data.attachments[i].type]) == 'undefined')
				{
					data.sortedattachments[data.attachments[i].type] = [];
				}
				data.sortedattachments[data.attachments[i].type].push(data.attachments[i]);
			}
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

		$(this.el).html (Mustache.render (Templates[this.template], data));
		updateTimers ();

		//console.log (this.model.attributes);

		return this;
	},

	'messageAction' : function (element)
	{
		var action = $(element.currentTarget).attr ('data-action');
		
		action = this.model.getAction (action);
		if (action)
		{
			if (action.parameters.length > 0)
			{
				var view = new Cloudwalkers.Views.ActionParameters ({
					'message' : this.model,
					'action' : action
				});
				Cloudwalkers.RootView.popup (view);
			}
			else
			{
				this.model.act (action, {});
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