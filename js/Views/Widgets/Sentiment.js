Cloudwalkers.Views.Widgets.Sentiment = Backbone.View.extend({
	
	'events' : {
		'mouseover' : 'toggleedit',
		'mouseout' : 'toggleedit',
		'click .notification-action' : 'edit',
		'click .sentiment-edit .sentiment' : 'update'
	},

	'initialize' : function(options)
	{
		$.extend(this, options);
	},

	'render' : function()
	{
		this.$el.html(Mustache.render(Templates.sentiment, {sentiment: this.sentiment}));
		return this;
	},

	'edit' : function()
	{
		this.$el.find('.sentiment-edit')[this.$el.find('.sentiment-edit').hasClass('visible')? "removeClass": "addClass"]("visible");
	},

	'toggleedit' : function(e)
	{
		var out = e.originalEvent.type == "mouseout";

		this.$el.find(".notification-action")[out? "addClass": "removeClass"]("hidden");
	},

	'update' :function(e)
	{
		var sentiment = $(e.currentTarget).attr('data-sentiment');
		
		//Temporary hack, replace with patch
		this.sentiment = sentiment;
		this.render();

	}	

});