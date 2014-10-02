define(
	['backbone'],
	function (Backbone)
	{
		var Error = Backbone.View.extend({

			'render' : function ()
			{
				var data = {};

				data.error = this.options.error;

				$(this.el).html (Mustache.render (Templates.error, data));

				return this;
			}

		});

		return Error;
});