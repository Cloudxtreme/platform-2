/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.LoadMore = Backbone.View.extend({

	'events' : {
		'click' : 'more'
	},

	'initialize' : function(options)
	{
		$.extend(this, options)
	},

	'loadmylisteners' : function()
	{
		this.loadListeners(this.list, ['request', 'sync', 'ready'], true);
	},

	'render' : function()
	{	
		this.$el.html(Mustache.render(Templates.loadmore));

		this.$container = this.$el.find ('.load-more-wrap');
		this.$loadercontainer = this.$el.find ('.load-more-wrap');

		this.loadmylisteners();
		this.trigger("rendered");

		return this;
	},

	'more' : function()
	{
		this.$el.find('.btn.load-more').addClass('hidden');
		this.$el.find('.load-more-wrap').addClass('inner-loading');

		var maxheight = this.parentcontainer.outerHeight();
		this.parentcontainer.css('max-height', maxheight);
	}

});