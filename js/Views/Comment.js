Cloudwalkers.Views.Comment = Cloudwalkers.Views.Message.extend({

	'initialize' : function ()
	{
		this.options.template = 'comment';
	},

	'className' : 'comments-row',
	//'template' : 'comment',

	'tagName' : 'li',

	'additionalData' : function (data)
	{
		data.parent = false;
		return data;
	}

	/*
	'render' : function ()
	{
		var data = {};

		//console.log (this.model.attributes);

		data.comment = this.model.attributes;
		data.comment.humandate = this.model.humandate ();

		$(this.el).html (Mustache.render (Templates.comment, data));

		return this;
	}
	*/

});