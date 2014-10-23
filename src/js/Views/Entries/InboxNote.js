/* 
 *	Specific message entry for inbox notes
 */

define(
	['Views/Entries/InboxMessage', 'Collections/RelatedNotes', 'mustache', 'Views/Entries/NoteEntry', 'Models/Notification'],
	function (InboxMessage, RelatedNotes, Mustache, NoteView, NotificationView)
	{
		var InboxNote = InboxMessage.extend({
	
			tagName : 'div',
			className : "note",
			template : 'inboxnote',
			related : [],
			messageview : [],
			notifications : [],
			
			events : 
			{
				'remove' : 'destroy',
				'click *[data-action]' : 'action',
			},

			render : function ()
			{	
				// Manage loading
				this.loading(!this.model.loaded());				
				
				// Parameters
				var params = {};
				$.extend(params, this.model.attributes);
				
				// Add parent
				if (this.model.loaded("model") && this.model.parent.loaded())
					params[this.model.parent.get("objectType")] = this.model.parent.attributes;

				if(this.model.filterActions)
					$.extend(params, {actions: this.model.filterActions()});
				
				// Meant only for the viewcontact messages demo
				if(this.notes)	params.notes = true;

				// Apply role permissions to template data
				Cloudwalkers.Session.censuretemplate(params);
				
				// Visualize
				this.$el.html (Mustache.render (Templates[this.template], params));
				
				this.time();
				
				// Check if it's an account note
				if (this.model.attributes.ACCOUNT)	this.$el.addClass('nocontext')

				return this;
			},

			getcontext : function()
			{
				return this.model.parent.attributes;
			},
			
			showrelated : function()
			{	
				// Show loading
				this.loading(true);
				
				// Create & append related container
				this.$related = $('<ul></ul>');
				this.$prelated = $('<ul></ul>');
				
				this.$el.before(this.$prelated.addClass("related-messages"));
				this.$el.after(this.$related.addClass("related-messages"));
				
				// Create related collection
				if(!this.model.related)
					this.model.related = new RelatedNotes();
				
				// Listen to collection
				this.listenTo(this.model.related, 'seed', this.fillrelated);
				this.listenTo(this.model.related, 'all', this.sendtriggers)	

				// Load messages
				this.model.related.touch(this.model, {records: 20, markasread: true});
				
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
					var view = new NoteView ({model: models[n], template: 'inboxnote', parameters: {notes: this.notes}});
					
					this.related.push (view);
					
					this[models[n].append? "$related": "$prelated"].append(view.render().el);
				}

				// Hide loading
				this.loading(false);
			}
		});

		return InboxNote;
});