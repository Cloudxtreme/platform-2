/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.DashboardMessageList = Cloudwalkers.Views.Widgets.MessageContainer.extend({

	'template' : 'dashboardmessagecontainer',
	'messagetemplate' : 'dashboardmessage',
	
	/*'initialize' : function ()
	{
		var self = this;
		
		if(this.options.stream) this.options.streams = [stream];
		
		$.each(this.options.streams, function(i, stream)
		{
			if(!)
		});

		this.title = this.options.channel.name;
		this.canLoadMore = typeof (this.options.channel.canLoadMore) == 'undefined' ? true : this.options.channel.canLoadMore;

        // Always add this to all your widget initializations
        this.initializeWidget ();
	},*/

	'render' : function ()
	{
		
		this.innerRender (this.$el);
		return this;
	}

});