Cloudwalkers.Views.Comment = Backbone.View.extend({

	'className' : 'comments-row',

	'render' : function ()
	{
		var data = {};

		//console.log (this.model.attributes);

		data.comment = this.model.attributes;
		data.comment.humandate = this.model.humandate ();

		$(this.el).html (Mustache.render (Templates.comment, data));

		return this;
	}

});