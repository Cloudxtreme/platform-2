/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.DashboardMessageList = Cloudwalkers.Views.Widgets.MessageContainer.extend({

	'template' : 'dashboardmessagecontainer',
	'messagetemplate' : 'dashboardmessage',

	'events' : {
		'click .tools .expand' : 'expand',
		'click .tools .collapse' : 'collapse'
	},

	'render' : function ()
	{
		this.innerRender (this.$el);
		return this;
	}

});