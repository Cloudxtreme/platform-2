define(
	['backbone', 'mustache'],

	function (Backbone, Mustache)
	{
		var ContactView = Backbone.View.extend({
	
			tagName : 'li',
			template: 'contactentry',
			notifications : [],
			parameters : {},
			
			events : 
			{
				'click .contact-delete' : 'unfollow'
				/*'click [data-notifications]' : 'loadNotifications',
				'click [data-youtube]' : 'loadYoutube',
				'click *[data-action]' : 'action',
				'click' : 'toggle'*/
			},
			
			initialize : function (options)
			{
				// HACK!
				this.parameters = {};
				
				if(options) $.extend(this, options);
				
				//console.log(this.model)
				
				this.listenTo(this.model, 'change', this.render);
				//this.listenTo(this.model, 'action:toggle', this.toggleaction);
				this.listenTo(this.model, 'destroy', this.remove);
			},

			render : function ()
			{
				
				// Parameters
				$.extend(this.parameters, this.model.attributes);
				
				//if(this.type == "full" && this.model.get("objectType")) this.parameters.actions = this.model.filterActions();
				
				// Visualize
				this.$el.html (Mustache.render (Templates[this.template], this.parameters)); //this.model.filterData(this.type, this.parameters)
				
				if (this.model.get("objectType"))
					this.$el.addClass(this.parameters.network.token);
				
				//if(this.$el.find("[data-date]")) this.time();
				
				//if(this.checkunread && this.model.get("objectType")) this.checkUnread();
				
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

	return ContactView;
});