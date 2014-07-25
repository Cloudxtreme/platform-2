Cloudwalkers.Views.Widgets.DashboardWrite = Cloudwalkers.Views.Widgets.MessageContainer.extend({

	'template' : 'dashboardmessagecontainer',
	'messagetemplate' : 'dashboardmessage',
	'entries' : [],
	
	'initialize' : function(options)
	{
		if (options) $.extend(this, options); 
	},

	'render' : function ()
	{
		this.$el.html (Mustache.render (Templates.dashboardmessagecontainer, this.options));
		this.$container = this.$el.find ('.messages-container');
		this.$loadercontainer = this.$el.find ('.portlet-body');

		var options = {
			'id' : "compose",
			'className' : "note",
			'thanks' : true,
			'close' : true,
			'parent' : this.parent,
			'model' : this.model,
			'type' : this.type
		}

		var view = new Cloudwalkers.Views.SimpleCompose(options);
		this.$container.append(view.render().el);
		
		this.$el.find('.portlet-body').removeClass('toload');

		return this;
	},
	
	'fail' : function ()
	{
		Cloudwalkers.RootView.growl ("Oops", "Something went sideways, please reload the page.");
	}

});