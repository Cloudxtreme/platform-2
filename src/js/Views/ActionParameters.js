define(
	['backbone'],
	function (Backbone)
	{
		var ActionParameters = Backbone.View.extend({

			'events' : 
			{
				'submit form' : 'submit'
			},

			'render' : function ()
			{
				this.$el.html (Templates['action-parameters']);

				var action = this.options.action;
				var message = this.options.message;

				// Popup!
				var data = {};

				data.action = action;
				data.title = action.name;

				data.input = {};

				jQuery.each (action.parameters, function (i, v)
				{
					if (typeof (data.input[v.type]) == 'undefined')
					{
						data.input[v.type] = [];
					}

					if (typeof (v.value) != 'undefined' && v.value != "")
					{
						v.value = Cloudwalkers.Utilities.Parser.parseFromMessage (v.value, message);
					}

					data.input[v.type] = v;
				});

				this.$el.html (Mustache.render(Templates['action-parameters'], data));

				return this;
			},

			'submit' : function (e)
			{
				e.preventDefault ();

				var form = $(e.currentTarget);

				var parameters = {};
				var serialized = form.serializeArray ();

				for (var i = 0; i < serialized.length; i ++)
				{
					parameters[serialized[i].name] = serialized[i].value;
				}
				
				this.options.message.act (this.options.action, parameters);

				// Trigger that we want to close the popup
				this.trigger ('popup:close');
			}

		});
	
		return ActionParameters;
});