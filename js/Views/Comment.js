Cloudwalkers.Views.Comment = Backbone.View.extend({

	'className' : 'comment-row',

	'render' : function ()
	{
		var data = {};

		console.log (this.model.attributes);

		data.comment = this.model.attributes;

		$(this.el).html (Mustache.render (Templates.comment, data));

		return this;
	}

});