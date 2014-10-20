/* 
 *	Base entry, only mapps the actions and base backbone things
 *	Entries should be divided into list entry, small entry, and the actual entry view
 */

define(
	['backbone', 'mustache'],

	function (Backbone, Mustache)
	{		
		var Entry = Backbone.View.extend({
	
			tagName : 'li',
			template: 'messageentry',
			tokenmap : {
				'favorite' : 'favourites',
				'retweet' : 'retweets',
				'like' : 'likes'
			},

			events : 
			{
				'remove' : 'destroy',
				'click [data-notifications]' : 'loadNotifications',
				'click *[data-action]' : 'action',
				'click' : 'toggle',
			},

			options : {},
			
			initialize : function (options)
			{	
				// HACK!
				this.parameters = {};
				
				if(options) $.extend(this, options);
				if(options) $.extend(this.options, options);

				this.loadmylisteners();
			},

			loadmylisteners : function()
			{
				this.listenTo(this.model, 'change', this.render);
				this.listenTo(this.model, 'action:toggle', this.toggleaction);
				this.listenTo(this.model, 'destroyed', this.remove);
			},

			render : function ()
			{
				// Parameters
				$.extend(this.parameters, this.model.attributes);
				
				// Apply role permissions to template data
				Cloudwalkers.Session.censuretemplate(this.parameters);

				this.$el.html (Mustache.render (Templates[this.template], this.parameters));
				
				if(this.$el.find("[data-date]")) this.time();
				
				if(this.checkunread && this.model.get("objectType")) this.checkUnread();

				if(this.model.get("status") && this.model.get("status") == 'FAILED'){
					this.$el.addClass('failed');
					this.model.attributes.failed = 'failed';
				}
				
				return this;
			},
			
			// Make this entry specific			
			action : function (element)
			{
				// Action token
				var action = $(element.currentTarget).data ('action');
				
				if(action == 'note' || action == 'action-list')
				{	

					var token = $(element.currentTarget).data ('token');

					this.toggleactions(action, token, element);
				}
				else if(action == 'note-edit')
				{
					this.editnote();
				}
				else if(action == 'tag-showedit')
				{
					this.showtagedit();
				}
				else if(action == 'tag-add')
				{
					var tag = $(element.currentTarget).siblings( "input" ).val();
					if(tag) {
						this.submittag(tag);
						$(element.currentTarget).siblings( "input" ).val('');
					}
				}
				else if(action == 'viewcontact')
				{

					//We are inside viewcontact modal
					if(this.parent)	return;

					var contact = this.model.attributes.from ? this.model.attributes.from[0] : null;
					if(contact)	Cloudwalkers.RootView.viewContact({model: contact});
					
				}
				else
					this.model.trigger("action", action);
			},
			
			toggle : function() { this.trigger("toggle", this); },
			
			checkUnread : function()
			{
				if(!this.model.get("read")) this.$el.addClass("unread");
				else						this.$el.removeClass("unread");
			},
			
			time : function ()
			{	// Upgrade this to moment()
				var now = new Date();
				var date = new Date(this.$el.find("[data-date]").attr("data-date"));
				var diff = Math.round((now.getTime()-date.getTime()) *0.001);
				var human;
				
				if(diff < 60)			human = "now";
				else if(diff < 3600)	human = Math.round(diff/60) + "m";
				else if(diff < 86400)	human = Math.round(diff/3600) + "h";
				else if(diff < 2592000)	human = Math.round(diff/86400) + "d";
				else					human = Math.round(diff/2592000) + "mo";
				
				this.$el.find("[data-date]").html(human);
				
				this.tm = setTimeout(this.time.bind(this), 60000);
			},
			
			destroy : function ()
		    {
				// To-do:
				//this.model.notifications.trigger("destroy");
				
				window.clearTimeout(this.tm);
		    }
		});

		return Entry;
});