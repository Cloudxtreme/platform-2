/* 
 *	Specific message entry for inbox messages:

 *	Related Messages;
 *	Mark as read;
 */

define(
	['Views/Entries/MessageEntry', 'mustache', 'Collections/Related', 'Views/Entries/Actions/Actions', 'Views/Entries/SubNotificationEntry'],
	function (MessageEntryView, Mustache, Related, ActionsView, NotificationView)
	{
		var InboxMessage = MessageEntryView.extend({
	
			tagName : 'div',
			template : 'inboxmessage',
			related : [],
			messageview : [],
			notifications : [],
			
			events : 
			{
				'remove' : 'destroy',
				'click *[data-youtube]' : 'loadYoutube',
				'click *[data-action]' : 'action',
				'keyup #tags' : 'entertag'
			},
			
			loading : function(show)
			{
				 if(show)	$(".inbox").addClass("loading");
				 else		$(".inbox").removeClass("loading");
			},
			
			showrelated : function()
			{	
				// Show loading
				this.loading(true);
				
				// Create & append related container
				this.$related = $('<ul></ul>');
				this.$prelated = $('<ul></ul>');
				
				this.$el.before(this.$prelated.addClass("related-messagess"));
				this.$el.after(this.$related.addClass("related-messages"));
				
				// Create related collection
				if(!this.model.related)
					this.model.related = new Related();
				
				// Listen to collection
				this.listenTo(this.model.related, 'seed', this.updateCounters);
				this.listenTo(this.model.related, 'seed', this.fillrelated);
				this.listenTo(this.model.related, 'all', this.sendtriggers);

				// check if read or not
				var markread_val = false;
				if(this.model.get("read") != "1")
					markread_val = true;

				// Load messages
				this.model.related.touch(this.model, {records: 20, markasread: markread_val});
				
			},

			fillrelated : function(models)
			{
				
				// Clean load or add
				if(this.incremental) this.incremental = false;
				else
				{
					$.each(this.related, function(n, entry){ entry.remove()});
					this.related = [];
				}
				
				// Filter out existing model
				var append = false;
				models = models.filter(function(model)
				{
					if(model.id == this.model.id) append = true;
					model.append = append;
					
					return model.id != this.model.id
				
				}.bind(this));

				// Add models to view
				for (var n in models)
				{	
					var view = new MessageEntryView ({model: models[n], template: 'inboxrelatedmessage', type: 'full', parameters: {notes: this.notes}});
					
					this.related.push (view);
					
					this[models[n].append? "$related": "$prelated"].append(view.render().el);
				}

				// Hide loading
				this.loading(false);
			},	

			sendtriggers : function(trigger){
				this.trigger(trigger);
			},
			
			markasread : function()
			{
				
				// Send update
				this.model.save({read: 1}, {patch: true, wait: true});
				
				// Mark stream
				Cloudwalkers.Session.getStreams().outdated(this.model.get("stream"));
			},

			/*'viewcontact' : function(e)
			{
				// e.currentTarget = contactid
				Cloudwalkers.RootView.viewContact();
			},*/
			
			destroy : function()
			{
				$.each(this.modelview, function(n, entry){ entry.remove()});
				$.each(this.notifications, function(n, entry){ entry.remove()});
				$.each(this.related, function(n, entry){ entry.remove()});
			}
		});

		return InboxMessage;
});