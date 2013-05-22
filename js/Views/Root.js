Cloudwalkers.Views.Root = Backbone.View.extend({

	'view' : null,

	'header' : null,
	'footer' : null,

	'initialize' : function ()
	{
		this.bind ('view:change', this.render, this);

		this.header = new Cloudwalkers.Views.Header ();

		$('#header').html (this.header.render ().el);
	},

	'render' : function ()
	{
		$('#content').html (this.view.render ().el);
	},

	'setView' : function (view, showMenu)
	{
		if (typeof (showMenu) == 'undefined')
		{
			showMenu = true;
		}

		$('#header').toggle (showMenu);
		$('#footer').toggle (showMenu);

		this.view = view;
		this.trigger ('view:change');
	},

	'setAccount' : function (account)
	{
		
	}

});