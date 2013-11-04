/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.DashboardMessageList = Cloudwalkers.Views.Widgets.MessageContainer.extend({

	'template' : 'dashboardmessagecontainer',
	'messagetemplate' : 'dashboardmessage',

	

	'render' : function ()
	{
		
		this.innerRender (this.$el);
		return this;
	}

});