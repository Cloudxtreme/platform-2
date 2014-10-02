define(
	['backbone', 'Views/Root'],
	function (Backbone, RootView)
	{
		var ContactCard = Backbone.View.extend({

			'events' : {
				'click' : 'viewcontact'
			},	
			
			'initialize' : function(options)
			{
				$.extend(this, options);
			},

			'render' : function()
			{
				this.$el.html(Mustache.render(Templates.singlecontact, this.contact));

				return this;
			},

			'viewcontact' : function()
			{	
				if(this.contact)
					RootView.viewContact({model: this.contact});
			}

		});

		return ContactCard;
});