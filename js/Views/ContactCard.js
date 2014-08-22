Cloudwalkers.Views.ContactCard = Backbone.View.extend({

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
			Cloudwalkers.RootView.viewContact({model: this.contact});
	}

});