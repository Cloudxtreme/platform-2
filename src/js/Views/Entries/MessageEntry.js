/* 
 *	Entry for a full entry (one that can have sub entries like notes, comments, notification, etc.)
 *	eg: an Inbox message
 */

define(
	['Views/Entries/BaseEntry', 'mustache', 'Views/Entries/Actions/Actions', 'Views/Modals/SimpleCompose', 'Views/Entries/SmallNoteEntry', 'Views/Entries/SmallNotificationEntry'],

	function (BaseEntry, Mustache, ActionsView, SimpleComposeView, NoteEntryWidget, NotificationView)
	{
		var MessageEntry = BaseEntry.extend({

			render : function ()
			{
				// Parameters
				$.extend(this.parameters, this.model.attributes);
				
				// Apply role permissions to template data
				Cloudwalkers.Session.censuretemplate(this.parameters);
				
				this.$el.html (Mustache.render (Templates[this.template], this.parameters)); //this.model.filterData(this.type, this.parameters)
				
				//MessageEntry always has actions (unless the user has no permissions)
				this.renderactions();

				if (Cloudwalkers.Session.isAuthorized('ACCOUNT_NOTES_VIEW'))
					this.loadnoteui();
				
				// MIGRATION -> Temporarily disable image/video plugin
				//this.$el.find(".youtube-video").colorbox({iframe:true, innerWidth:640, innerHeight:390, opacity: 0.7});
				
				return this;
			},
					
			renderactions : function()
			{
				this.actions = new ActionsView({message: this.model});
				
				this.$el.find('.message-actions').html(this.actions.render().el)

				this.loadedlists = [];
			},

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

			editnote : function()
			{	
				var composenote = new SimpleComposeView({model: this.model});

				//Prevent auto re-render on save
				this.stopListening(this.model);

				this.listenTo(composenote, 'edit:cancel', this.canceledit);
				this.listenTo(composenote, 'save:success', this.saved);

				this.$el.find('.message-body').addClass('note-content').html(composenote.render().el);
				this.$el.find('.message-actions').addClass('hidden');

				// Anything to hide
				this.$el.find('.toggle-note-actions').toggle();
			},

			showtagedit : function()
			{	
				this.$el.find('.message-tags').toggleClass("enabled");
				this.$el.find('.message-tags .edit').toggleClass("inactive");
			},

			canceledit : function(collapse)
			{	
				this.loadmylisteners();
				this.$el.find('.message-actions').removeClass('hidden');

				if(collapse){
					this.toggleactions('note', 'note');
					this.$el.find('.note-content .modal-body textarea').val('');
				}
				else{
					this.$el.find('.message-body').removeClass('note-content').html(this.model.get("text"));
					
					// Anything to show
					this.$el.find('.toggle-note-actions').toggle();
				}
			},

			saved : function()
			{
				setTimeout(function(){
					this.canceledit();
					this.loadmylisteners();
				}.bind(this),200)
			},

			toggleactions : function(action, token, element)
			{	
				if(element && $(element.currentTarget).hasClass('noresults'))	return;

				//Buttons
				var clickedbutton = this.$el.find('[data-action='+action+'][data-token='+token+']');
				
				if(!clickedbutton.hasClass('inactive'))
					this.processaction('open', action, token);

				else if(clickedbutton.hasClass('inactive'))
					this.processaction('close');
			},

			processaction : function(operation, action, token)
			{	
				var clickedbutton = this.$el.find('[data-action='+action+'][data-token='+token+']');
				var inactivebuttons = this.$el.find('.actionvalue.inactive');
				var inactivebuttonss = this.$el.find('.actionname.inactive');
				var lists = this.$el.find('.action-list');
				var notecontent = this.$el.find('.note-content');

				var delay = false;

				//Is there a delay needed in the animation?
				if(lists.is(':visible') || notecontent.is(':visible'))
					delay = true;

				// Buttons
				inactivebuttons.removeClass('inactive');
				inactivebuttonss.removeClass('inactive');

				//Lists or other things
				this.$el.find('.action-list').slideUp('fast');
				this.$el.find('.note-content').slideUp('fast');

				if(operation == 'close')
					return;

				// Expand lists & stuff //

				setTimeout(function()
				{
					clickedbutton.addClass('inactive');	

					if(action == 'action-list')
						this.expandlist(token);

					// Composenote
					else if(action == 'note')
						notecontent.slideDown();

				}.bind(this),delay? 200: 1);

			},

			expandlist : function(token)
			{
				var list = token+'list';
				
				//Check if list has been fetched already
				if(this.loadedlists.indexOf(list) < 0)
					return this.fetchactions(token)		
				
				this.$el.find('.action-list.'+token+'-list').slideDown();

			},

			fetchactions : function(token)
			{	
				//Temporarily, only notes or notifications
				var collection = token == 'note'? this.model.notes: this.model.notifications;
				var params = { records: 999 };

				collection.reset();

				if(token != 'notes')
					params.markasread = true;

				collection.parentmodel = this.model;
				collection.parenttype = 'message';
				this.listenTo(collection,'seed', this.fillactions.bind(this, token));

				collection.touch(this.model, params);
				
				this.loadedlists.push(token+'list');
			},

			fillactions : function(token, actions, update)
			{	
				// Create the list div
				var listclass = token+'-list';

				if(!actions.length)
					return this.$el.find('.action-list li').html('No actions found')

				this.$el.find('.'+listclass).remove();
				
				var container = this.$el.find('.action-lists').append('<ul class="action-list '+listclass+'"></ul>');

				// Fill it
				for (var n in actions)
				{	
					this.addaction(actions[n], token);
				}
			},

			addaction : function(action, token)
			{	
				var options = {model: action, template: token == 'note'? 'messagenote': 'timelinecomment'}
				var listclass = token+'-list';

				if(this.newaction)	options.isnew = true;

				if(token == 'note'){
					action = new NoteEntryWidget(options);	
				}
					
				else
					action = new NotificationView(options);

				this.$el.find('.'+listclass).append(action.render().el);

				this.newaction = false;
			},
			
			toggleaction : function (token, newaction)
			{
				if(!newaction)	return;

				var current = this.$el.find('[data-action="' + token + '"]');
				var clone = current.clone().attr("data-action", newaction.token);
				
				// new Action edits
				if(current.is("a"))	clone.html("<i class='icon-" + newaction.icon + "'></i> " + newaction.name);
				else 				clone.find("i").attr("class", "").addClass("icon-" + newaction.icon);
				
				// Remove old Action
				current.before(clone).remove();
			},
			
			toggle : function() { this.trigger("toggle", this); },
			
			checkUnread : function()
			{
				if(!this.model.get("read")) this.$el.addClass("unread");
				else						this.$el.removeClass("unread");
			},
			
			/*loadNotifications : function()
			{
				// Collapse if open
				if(this.$el.find(".timeline-comments li").size())
					
					return this.$el.find(".timeline-comments li").remove();
				
				// Load notifications
				this.listenTo(this.model.notifications, 'seed', this.fillNotifications);
				
				this.model.notifications.touch(this.model, {records: 50, markasread: true});
				
			},
			
			fillNotifications : function (list)
			{		
				// Clean load
				$.each(this.notifications, function(n, entry){ entry.remove()});
				this.notifications = [];
				
				// Create array if collection
				if(list.models) list = list.models;
				
				// Clear comments list
				var $container = this.$el.find(".timeline-comments").eq(0).html("");

				// Add models to view
				for (var n in list)
				{
					var view = new NotificationView ({model: list[n], template: 'timelinecomment'});
					this.notifications.push (view);
					
					$container.append(view.render().el);
				}
			},
			*/
			loadYoutube : function ()
			{	
				// Get container
				var $container = this.$el.find(".timeline-video").eq(0);
				var url = $container.data("youtube");
				
				// Activate container
				$container.attr("data-youtube", "").removeClass("inactive");

				// Add youtube to view
				$container.html (Mustache.render (Templates.youtube, {url: url}));
			},

			//Note textarea
			loadnoteui : function()
			{	
				var composenote = new SimpleComposeView({parent: this.model, persistent: true});
				this.composenote = composenote;

				//this.listenTo(composenote.model, 'sync', this.noteadded);
				this.listenTo(composenote, 'save:success', this.noteadded);
				this.listenTo(composenote, 'edit:cancel', this.canceledit.bind(this, true));

				this.$el.find('.note-content').append(composenote.render().el);		
			},

			fetchnotes : function()
			{		
				this.model.notes.parentmodel = this.model;
				this.model.notes.parenttype = 'message';
				this.listenTo(this.model.notes,'seed', this.fillnotes);

				this.model.notes.touch(this.model);

				this.loadednotes = true;
			},

			//Notes list
			fillnotes : function(notes)
			{	
				if(!notes.length)	this.$el.find('.note-list li').html(trans("No Notes found"))
				else				this.$el.find('.note-list').empty();

				for (var n in notes)
				{	
					this.addnote(notes[n]);
				}
			},

			addnote : function(newnote)
			{	
				var options = {model: newnote, template: 'messagenote'};
				var note;

				if(this.newnote)	options.isnew = true;

				note = new NoteEntryWidget(options);
				this.$el.find('.note-list').append(note.render().el);

				this.newnote = false;
			},

			noteadded : function(note)
			{	
				//this.addnote(note, true);
				this.toggleactions('action-list', 'note');
				this.newnote = true;
				this.fetchactions('note');
				
				this.trigger('note:added');

				this.composenote.remove();
				this.loadnoteui();
			}
		});

		return MessageEntry;
});