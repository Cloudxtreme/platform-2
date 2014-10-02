/**
* A standard widget
*/
define(
	['backbone'],
	function (Backbone)
	{
		var LoadMore = Backbone.View.extend({

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
				this.trigger("rendered");
			},

			'render' : function()
			{	
				param = {};

				//Mustache Translate Render
				this.mustacheTranslateRender(param);

				this.$el.html(Mustache.render(Templates.loadmore, param));

				this.$container = this.$el.find ('.load-more-wrap');
				this.$loadercontainer = this.$el.find ('.load-more-wrap');

				//this.loadmylisteners();
				//this.trigger("rendered");

				return this;
			},

			'more' : function()
			{
				this.$el.find('.btn.load-more').addClass('hidden');
				this.$el.find('.load-more-wrap').addClass('inner-loading');

				var maxheight = this.parentcontainer.outerHeight();
				this.parentcontainer.css('max-height', maxheight);
			},

			'translateString' : function(translatedata)
			{	
				// Translate String
				return Session.polyglot.t(translatedata);
			},

			'mustacheTranslateRender' : function(translatelocation)
			{
				// Translate array
				this.original  = [
					"load_more"
				];

				this.translated = [];

				for(k in this.original)
				{
					this.translated[k] = this.translateString(this.original[k]);
					translatelocation["translate_" + this.original[k]] = this.translated[k];
				}
			}

		});

		return LoadMore;
});