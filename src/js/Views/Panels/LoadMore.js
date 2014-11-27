/**
* A standard widget
*/
define(
	['Views/BaseView', 'mustache'],
	function (BaseView, Mustache)
	{
		var LoadMore = BaseView.extend({

			events : {
				'click' : 'more'
			},

			initialize : function(options)
			{
				$.extend(this, options)
			},

			loadmylisteners : function()
			{
				this.loadListeners(this.list, ['request', 'sync', 'ready'], true);
				this.trigger("rendered");
			},

			render : function()
			{	
				this.$el.html(Mustache.render(Templates.loadmore));

				this.$container = this.$el.find ('.load-more-wrap');
				this.$loadercontainer = this.$el.find ('.load-more-wrap');

				return this;
			},

			more : function()
			{
				this.$el.find('.btn.load-more').addClass('hidden');
				this.$el.find('.load-more-wrap').addClass('inner-loading');

				var maxheight = this.parentcontainer.outerHeight();
				this.parentcontainer.css('max-height', maxheight);
			}

		});

		return LoadMore;
});