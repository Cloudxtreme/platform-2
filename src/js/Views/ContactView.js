define(
	['backbone', 'mustache'],
	function (Backbone, Mustache)
	{
		var Contact = Backbone.View.extend({
	
			tagName : 'li',
			template : 'contactentry',
			notifications : [],
			parameters : {},
			
			events : 
			{
				'click .contact-delete' : 'unfollow'
			},
			
			initialize : function (options)
			{
				if(options)	$.extend(this, options)

				// HACK!
				this.parameters = {};
				
				this.listenTo(this.model, 'change', this.render);
				this.listenTo(this.model, 'destroy', this.remove);
			},

			render : function ()
			{
				// Parameters
				$.extend(this.parameters, this.model.attributes);
				
				// Visualize
				this.$el.html (Mustache.render (Templates[this.template], this.parameters)); //this.model.filterData(this.type, this.parameters)
				
				if (this.model.get("objectType"))
					this.$el.addClass(this.parameters.network.token);
				
				return this;
			},
			
			unfollow : function ()
			{	
				this.model.trigger("unfollow", this.model);	
				
				this.model.parent = Cloudwalkers.Session.getAccount();
				this.model.save({following: false}, {patch: true});
				this.remove();
			}

		});

		return Contact;
});