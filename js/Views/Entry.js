Cloudwalkers.Views.Entry = Backbone.View.extend({
	
	'tagName' : 'li',
	'template': 'messageentry',
	'notifications' : [],
	'parameters' : {},
	
	'events' : 
	{
		'remove' : 'destroy',
		'click [data-notifications]' : 'loadNotifications',
		'click [data-youtube]' : 'loadYoutube',
		'click *[data-action]' : 'action',
		'click' : 'toggle',
	},
	
	'initialize' : function (options)
	{
		// HACK!
		this.parameters = {};
		
		if(options) $.extend(this, options);

		this.loadmylisteners();
		
	},

	'loadmylisteners' : function()
	{
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'action:toggle', this.toggleaction);
		this.listenTo(this.model, 'destroy', this.remove);

	},

	'render' : function ()
	{
		// Parameters
		$.extend(this.parameters, this.model.attributes);
		
		if(this.type == "full" && this.model.get("objectType")) this.parameters.actions = this.model.filterActions();
		
		// Apply role permissions to template data
		Cloudwalkers.Session.censuretemplate(this.parameters);

		// Visualize
		for(n in this.parameters.actions)
			this.parameters.actions[n].name_translated = this.translateString(this.parameters.actions[n].name)

		if(this.parameters.actions && !this.parameters.actions.length)
			this.parameters.hasactions = false;
		else
			this.parameters.hasactions = true;

		for(n in this.parameters.statistics)
			this.parameters.statistics[n].name_translated = this.translateString(this.parameters.statistics[n].name)
		
		this.mustacheTranslateRender(this.parameters);
		
		this.$el.html (Mustache.render (Templates[this.template], this.parameters)); //this.model.filterData(this.type, this.parameters)
		
		if(this.$el.find("[data-date]")) this.time();
		
		if(this.checkunread && this.model.get("objectType")) this.checkUnread();

		if (Cloudwalkers.Session.isAuthorized('ACCOUNT_NOTES_VIEW')){

			//Load default note
			this.$el.find('.note-list').html('<li>'+Mustache.render (Templates.messagenote)+'</li>');
				
			//Load note composer
			this.loadnoteui();
		}	

		return this;
	},
	
	'action' : function (element)
	{
		// Action token
		var token = $(element.currentTarget).data ('action');
		
		if(token == 'note-content' || token == 'note-list'){
			this.togglenoteaction(token);
		}else if(token == 'note-edit'){
			this.editnote();
		}else if(token == 'tag-showedit'){
			this.showtagedit();
		}else if(token == 'tag-add'){
			var tag = $(element.currentTarget).siblings( "input" ).val();
			if(tag) {
				this.submittag(tag);
				$(element.currentTarget).siblings( "input" ).val('');
			}
		}else if(token == 'viewcontact'){

			//We are inside viewcontact modal
			if(this.parent)	return;

			var contact = this.model.attributes.from ? this.model.attributes.from[0] : null;
			if(contact)	Cloudwalkers.RootView.viewContact({model: contact});
			
		}else
			this.model.trigger("action", token);
	},

	'editnote' : function()
	{	
		var composenote = new Cloudwalkers.Views.ComposeNote({note: this.model});

		//Prevent auto re-render on save
		this.stopListening(this.model);

		this.listenTo(composenote, 'edit:cancel', this.canceledit);
		this.listenTo(composenote, 'save:success', this.saved);

		this.$el.find('.message-body').addClass('note-content').html(composenote.render().el);
		this.$el.find('.message-actions').addClass('hidden');

		// Anything to hide
		this.$el.find('.toggle-note-actions').toggle();
	},
	'showtagedit' : function()
	{	
		this.$el.find('.message-tags').toggleClass("enabled");
		this.$el.find('.message-tags .edit').toggleClass("inactive");
	},

	'canceledit' : function(collapse)
	{	
		this.loadmylisteners();
		this.$el.find('.message-actions').removeClass('hidden');

		if(collapse)
			this.togglenoteaction('note-content');
		else{
			this.$el.find('.message-body').removeClass('note-content').html(this.model.get("text"));
			
			// Anything to show
			this.$el.find('.toggle-note-actions').toggle();
		}
	},

	'saved' : function()
	{
		setTimeout(function(){
			this.canceledit();
			this.loadmylisteners();
		}.bind(this),200)
	},

	'togglenoteaction' : function(token)
	{
		var other = token == 'note-list'? 'note-content': 'note-list';
		var container = this.$el.find('.message-notes');
		var element = this.$el.find('.'+token);

		var clicked = this.$el.find('[data-action='+token+']');
		var otherbutton = this.$el.find('[data-action='+other+']');

		other = this.$el.find('.'+other);
		
		if(!container.is(':visible') && !clicked.hasClass('inactive'))
		{	
			this.$el.find('.message-notes').slideDown();
			element.slideDown();
			clicked.addClass('inactive');
		}
		else if(container.is(':visible') && !clicked.hasClass('inactive'))
		{	
			other.slideUp('fast');
			otherbutton.removeClass('inactive');
			element.slideDown();
			clicked.addClass('inactive');
		}
		else if(container.is(':visible') && clicked.hasClass('inactive'))
		{
			this.$el.find('.message-notes').slideUp();
			clicked.removeClass('inactive');
			other.slideUp();
			element.slideUp();
		}
		
		if(token == 'note-list' && !this.loadednotes)
			this.fetchnotes();

	},
	
	'toggleaction' : function (token, newaction)
	{

		var current = this.$el.find('[data-action="' + token + '"]');
		var clone = current.clone().attr("data-action", newaction.token);
		
		// new Action edits
		if(current.is("a"))	clone.html("<i class='icon-" + newaction.icon + "'></i> " + newaction.name);
		else 				clone.find("i").attr("class", "").addClass("icon-" + newaction.icon);
		
		// Remove old Action
		current.before(clone).remove();
	},
	
	'toggle' : function() { this.trigger("toggle", this); },
	
	'checkUnread' : function()
	{
		if(!this.model.get("read")) this.$el.addClass("unread");
		else						this.$el.removeClass("unread");
	},
	
	'loadNotifications' : function()
	{
		
		// Collapse if open
		if(this.$el.find(".timeline-comments li").size())
			
			return this.$el.find(".timeline-comments li").remove();
		
		
		/*// Does collection exist?
		if(!this.model.notifications)
			this.model.notifications = new Cloudwalkers.Collections.Notifications();
		
		console.log(this.model.notifications)*/
		
		// Load notifications
		this.listenTo(this.model.notifications, 'seed', this.fillNotifications);
		
		this.model.notifications.touch(this.model, {records: 50, markasread: true});
		
	},
	
	'fillNotifications' : function (list)
	{		
		// Clean load
		$.each(this.notifications, function(n, entry){ entry.remove()});
		this.notifications = [];
		
		// Create array if collection
		if(list.models) list = list.models;
		
		// Clear comments list
		var $container = this.$el.find(".timeline-comments").eq(0).html("");

		// Add models to view
		for (n in list)
		{
			var view = new Cloudwalkers.Views.Notification ({model: list[n], template: 'timelinecomment'});
			this.notifications.push (view);
			
			$container.append(view.render().el);
		}
	},
	
	'loadYoutube' : function ()
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
	'loadnoteui' : function()
	{	
		var composenote = new Cloudwalkers.Views.ComposeNote({model: this.model, persistent: true});
		this.composenote = composenote;

		this.listenTo(composenote.note, 'sync', this.noteadded);
		this.listenTo(composenote, 'edit:cancel', this.canceledit.bind(this, true));

		this.$el.find('.note-content').append(composenote.render().el);		
	},

	'fetchnotes' : function()
	{	
		var notes = new Cloudwalkers.Collections.Notes();		
		notes.parentmodel = this.model;
		notes.parenttype = 'message';
		this.listenTo(notes,'seed', this.fillnotes);

		notes.touch(this.model);

		this.loadednotes = true;
	},

	//Notes list
	'fillnotes' : function(notes)
	{	
		if(!notes.length)	this.$el.find('.note-list li').html('No notes found')
		else				this.$el.find('.note-list').empty();

		for(n in notes)
		{	
			this.addnote(notes[n]);
		}
	},

	'addnote' : function(newnote)
	{	
		var options = {model: newnote, template: 'messagenote'}
		var note;

		if(this.newnote)	options.isnew = true;

		note = new Cloudwalkers.Views.Widgets.NoteEntry(options);
		this.$el.find('.note-list').append(note.render().el);

		this.newnote = false;
	},

	'noteadded' : function(note)
	{	
		//this.addnote(note, true);
		this.togglenoteaction('note-list');
		this.newnote = true;
		this.fetchnotes();

		this.composenote.remove();
		this.loadnoteui();
	},

	/* Tags */
	'loadtagui' : function()
	{
		this.fetchtags();
	},

	'fetchtags' : function()
	{	
		var tags = new Cloudwalkers.Collections.Tags();	
		tags.parentmodel = this.model;
		tags.parenttype = 'message';
		this.listenTo(tags,"seed", this.rendertag);

		tags.touch(this.model);
		this.loadedtags = true;
	},
	'rendertag' : function(tags){

				
		if(!tags.length)	this.$el.find('.tag-list').html(this.translateString("no_tags_found"));
		else				this.$el.find('.tag-list').empty();
		this.$el.find('.tag-list').empty();
		for(n in tags)
		{
			this.addtag(tags[n]);
		}
	},
	'submittag' : function(newtag)
	{	
		// Update Tags - POST
		this.tag = new Cloudwalkers.Models.Tag();

		if(this.model)
			this.tag.parent = this.model;

		this.tag.save({'name': newtag}, {success: this.addtag.bind(this)});
	},
	'addtag' : function(newtag)
	{
		var options = {model: newtag, parent: this.model, template: 'messagetag'}
		var tag;

		tag = new Cloudwalkers.Views.Widgets.TagEntry(options);
		this.$el.find('.tag-list').append(tag.render().el);
	},
	'entertag' : function(e)
	{
		if ( e.which === 13 ) {
			var tag = $(e.target).val();
			if(tag) {
				this.submittag(tag);
				$(e.target).val('');
			}
	    }
	},
	
	/*'action' : function (element)
	{
		if ($(element.currentTarget).is ('[data-action]'))
		{
			var actiontoken = $(element.currentTarget).attr ('data-action');
		}
		else if ($(element.target).is ('[data-action]'))
		{
			var actiontoken = $(element.target).attr ('data-action');	
		}
		else
		{
			var actiontoken = $(element.target).parent ('[data-action]').attr ('data-action');	
		}
		
		action = this.model.getAction (actiontoken);

		if (action == null)
		{
			console.log ('No action found: ' + actiontoken);
			return;
		}

		var targetmodel = this.model;
		if (typeof (action.target) != 'undefined')
		{
			targetmodel = action.target;

			if (typeof (action.originalaction) != 'undefined')
			{
				action = action.originalaction;
			}
		}

		if (typeof (action.callback) != 'undefined')
		{
			action.callback (targetmodel);
		}
		else
		{
			if (action)
			{
				if (action.type == 'dialog')
				{
					var view = new Cloudwalkers.Views.ActionParameters ({
						'message' : targetmodel,
						'action' : action
					});
					Cloudwalkers.RootView.popup (view);
				}
				else if (action.type == 'simple')
				{
					targetmodel.act (action, {}, function (){});
				}

				else if (action.type == 'write')
				{
					Cloudwalkers.RootView.writeDialog 
					(
						targetmodel,
						action
					);
				}
			}
		}
	},*/
	
	'time' : function ()
	{
		var now = new Date;
		var date = new Date(this.$el.find("[data-date]").attr("data-date"));
		var diff = Math.round((now.getTime()-date.getTime()) *.001);
		var human;
		
		if(diff < 60)			human = "now";
		else if(diff < 3600)	human = Math.round(diff/60) + "m";
		else if(diff < 86400)	human = Math.round(diff/3600) + "h";
		else if(diff < 2592000)	human = Math.round(diff/86400) + "d";
		else					human = Math.round(diff/2592000) + "mo";
		
		this.$el.find("[data-date]").html(human);
		
		this.tm = setTimeout(this.time.bind(this), 60000);
	},
	
	'destroy' : function ()
    {
		// To-do:
		//this.model.notifications.trigger("destroy");
		
		window.clearTimeout(this.tm);
    },

    'translateString' : function(translatedata)
	{	
		// Translate String
		return Cloudwalkers.Session.polyglot.t(translatedata);
	},

	'mustacheTranslateRender' : function(translatelocation)
	{
		// Translate array
		this.original  = [
			"comments"
		];

		this.translated = [];

		for(k in this.original)
		{
			this.translated[k] = this.translateString(this.original[k]);
			translatelocation["translate_" + this.original[k]] = this.translated[k];
		}
	},

});