Cloudwalkers.Views.Widgets.DashboardWebcare = Cloudwalkers.Views.Widgets.Widget.extend ({

	'template' : 'reportwebcare',
	'typestring' : 'accounts',

	'initialize' : function(options)
	{
		this.messages = new Cloudwalkers.Collections.Messages()
		this.messages.models = this.options.model
		this.listenTo(this.messages, 'seed', this.fill);
	},

	'render' : function ()
	{

		console.log(this.messages)

		this.messages.parenttype = 'accounts';
		this.messages.id = Cloudwalkers.Session.getAccount().id;

		// Preset template
		this.$el.html (Mustache.render (Templates[this.template], this.options));	

		this.loadListeners(this.messages, ['request', 'sync', 'ready'], true);

		this.messages.touch(this.messages, { assigned: this.options.subject } );

		return this;
	},
	
	'fill' : function ()
	{	
		console.log("ok")

	},
	
	'fail' : function ()
	{
		Cloudwalkers.RootView.growl ("Oops", "Something went sideways, please reload the page.");
	}
});