define(
	['Views/Message'],
	function (Message)
	{
		var Comment = Message.extend({

			'events' : 
			{
				'click .button-post.action.comment-message-action' : 'messageAction'
			},

			'initialize' : function ()
			{
				var self = this;

				this.options.template = 'comment';

				this.model.on ('change', function ()
				{
					self.render ();	
				});
			},

			'className' : 'comments-row',
			//'template' : 'comment',

			'tagName' : 'li',

			'additionalData' : function (data)
			{
				data.parent = false;
				return data;
			},

			'afterRender' : function ()
			{
				if (this.options.selected)
				{
					this.$el.addClass ('selected');
				}

				this.delegateEvents (this.events);
			}
		});

		return Comment;
});