define(
	['backbone', 'mustache'],
	function (Backbone, Mustache)
	{
		TitleSeparator = Backbone.View.extend({

			className : 'titleseparator',

			initialize : function (options)
			{
				if(options) $.extend(this, options);
				
				this.settings = {};
				this.settings.title = this.title;
			},

			render : function ()
			{	
				this.$el.html (Mustache.render (Templates.titleseparator, this.settings));	

				return this;
			},

			negotiateFunctionalities : function()
			{

			}
			
		});

		return TitleSeparator;
});