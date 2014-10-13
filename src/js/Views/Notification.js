define(
	['Views/Entry', 'mustache', 'Collections/Actions', 'Views/ActionParameters'],
	function (EntryView, Mustache, Actions, ActionParametersView)
	{
		var Notification = EntryView.extend({
	
			template: 'message',
	
			events : {
				'mouseover' : 'toggleactions',
				'mouseout' : 'toggleactions',
				'click *[data-notification-action]' : 'action',
				'click .viewcommentcontact': 'togglecommentcontact'
			},

			render : function ()
			{
				// Parameters
				$.extend(this.parameters, this.model.attributes);
				
				if(this.model.get("objectType")) this.parameters.actions = this.model.filterActions();
				
				// Visualize
				this.$el.html (Mustache.render (Templates[this.template], this.parameters));
				
				return this;
			},
			
			action : function (e)
			{
				// Action token
				var token = $(e.currentTarget).data ('notification-action');
				
				this.model.trigger("action", token);
			},
			
			toggleaction : function (token, newaction)
			{
				
				var current = this.$el.find('div[data-notification-action="' + token + '"]');
				var clone = current.clone();
				
				// new Action edits
				clone.attr("data-notification-action", newaction.token).find("i").attr("class", "").addClass("icon-" + newaction.icon);
				
				// Remove old Action
				current.before(clone).remove();	

			},
			
			toggleactions : function(e)
			{
				var out = e.originalEvent.type == "mouseout";
				
				this.$el.find(".message-actions")[out? "addClass": "removeClass"]("hidden");
				this.$el.find(".comment-info")[out? "removeClass": "addClass"]("hidden");	
			},
			
			markasread : function()
			{
				// Send update
				this.model.save({read: 1}, {patch: true, wait: true});
				
				// Mark stream
				if (this.model.get("stream"))
					Cloudwalkers.Session.getStreams().outdated(this.model.get("stream"));
			},

			togglecommentcontact : function()
			{
				var contact = this.model.attributes.from ? this.model.attributes.from[0] : null;
				if(contact)	Cloudwalkers.RootView.viewContact({model: contact});
			}
			
		});

		return Notification;
});