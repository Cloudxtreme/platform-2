Cloudwalkers.Views.Widgets.InboxNotesList = Cloudwalkers.Views.Widgets.InboxMessageList.extend({
	
	'entrytemplate': 'smallentrynote',

	'render' : function ()
	{	
		// Template data
		var param = {streams: [], networks: []};
		
		// Select streams
		this.model.streams.each (function(stream)
		{
			if(stream.get(this.check)) param.streams.push({id: stream.id, icon: stream.get("network").icon, name: stream.get("defaultname"), network: stream.get("network")}); 

		}.bind(this));
		
		// Select networks
		param.networks = this.model.streams.filterNetworks(param.streams, true);
		param.note = this.listtype? true: false;
		
		//Mustache Translate Render
		this.mustacheTranslateRender(param);

		// Get template
		this.$el.html (Mustache.render (Templates.inboxlist, param));
		
		// Set selected streams
		if (this.filters.streams.length)
		{
			this.$el.find("[data-streams], [data-networks], .toggleall").toggleClass("inactive active");
			
			this.$el.find(this.filters.streams.map(function(id){ return '[data-networks~="'+ id +'"],[data-streams="'+ id +'"]'; }).join(",")).toggleClass("inactive active");
		}
		
		this.$container = this.$el.find ('ul.list');
		
		// Load messages
		this.collection.touch(this.model, this.filterparameters());
		this.listenTo(this.collection, 'ready', this.afterrender);
		
		return this;
	},
	
	'fill' : function (models)
	{	
		// Clean load or add
		if(this.incremental) this.incremental = false;
		else
		{
			$.each(this.entries, function(n, entry){ entry.remove()});
			this.entries = [];
		}
		
		// Add models to view
		for (n in models)
		{	
			var view = new Cloudwalkers.Views.NoteEntry ({model: models[n], template: this.entrytemplate, parameters:{inboxview: true}});
			
			this.entries.push (view);
			this.listenTo(view, "toggle", this.toggle);
			
			this.$container.append(view.render().el);
		}
	},

	'afterrender' : function()
	{
		// Toggle first message
		if(this.entries.length) setTimeout(this.toggle.bind(this, this.entries[0]), 1);
		else this.hidemore();
	},
	
	'toggle' : function(view)
	{	
		var options = {model: view.model};
		
		if (this.inboxnote) this.inboxnote.remove();
		
		this.inboxnote = new Cloudwalkers.Views.Widgets.InboxNote(options);
		
		$(".inbox-container").html(this.inboxnote.render().el);
		
		//render the context
		this.rendercontext();

		// Load related messages
		this.inboxnote.showrelated();
		
		this.$el.find(".list .active").removeClass("active");
		view.$el.addClass("active");
	},
	
	'togglefilter' : function(e)
	{

		var button = $(e.currentTarget);
		var toggle = button.data("toggle");
		var selected = button.hasClass("selected");
		
		this.$el.find("[data-toggle].selected").removeClass("selected");
		this.$el.find("[id^=filter_]").addClass("hidden");
		
		if(!selected)
		{
			button.addClass("selected");
			this.$el.find("#filter_" + toggle).removeClass("hidden");
		}
	},

	'rendercontext' : function()
	{
		var context = this.inboxnote.getcontext();
		var contextrender;
	
		//Mustache render the context
		if(context.objectType == 'message')
		{
			var wrapper = $('<div class="message social-box-colors"></div>')
			context.display = true;
			contextrender = Mustache.render(Templates.inboxmessage, context);
			contextrender  = wrapper.append(contextrender)

		}else if(context.objectType == 'contact')
		{	
			var contactcard = new Cloudwalkers.Views.ContactCard({contact: context});
			contextrender = contactcard.render().el;
		}	

		//append the context
		$('.inbox-container').prepend(contextrender);

	},
	
	'comparesuggestions' : function (iscontact)
	{
		var string = this.$el.find("#filter_contacts input").val();
		
		if(!string) return this.hidesuggestions();
		else string = string.toLowerCase();
		
		var contacts = this.model.contacts.filter(this.comparenamefilter.bind(this, string));
		
		
		// On typed, search for more
		if (contacts.length < 5 && !iscontact.cid && string.length > 2) this.requestcontacts(string);

		if (!contacts.length)
		{
			return this.hidesuggestions();
		} 
		else this.showsuggestions(contacts.slice(0,10));
		
	},
	
	'comparenamefilter' : function(string, contact)
	{
		return contact.get("displayname").toLowerCase().indexOf(string) >= 0 || (contact.get("name") && contact.get("name").toLowerCase().indexOf(string) >= 0);
	},
	
	'showsuggestions' : function(contacts)
	{
		this.$el.find("#filter_contacts label").removeClass("hidden");
		this.$el.find("ul.contacts-suggestions").empty();
		
		for (n in contacts)
			this.$el.find("ul.contacts-suggestions").append(Mustache.render (Templates.contactsuggestionentry, contacts[n].attributes));
	},
	
	'hidesuggestions' : function()
	{
		this.$el.find("#filter_contacts label").addClass("hidden");
		this.$el.find("ul.contacts-suggestions").empty();
	},
	
	'requestcontacts' : function(string)
	{
		if(string != this.filters.contacts.string)
		{
			if(!this.model.contacts.processing)
			{
				this.$el.find(".loading-contacts").removeClass("hidden");
				
				this.filters.contacts.string = string;
				this.model.contacts.fetch({remove: false, parameters: {q: string, channels: this.model.id}, success: this.loadedcontacts.bind(this)});
			
			} else this.filters.contacts.buffered = string;
		}
	},
	
	'loadedcontacts' : function()
	{
		this.$el.find(".loading-contacts").addClass("hidden");
		
		
		// Check pending requests
		if(this.filters.contacts.buffered)
		{
			this.requestcontacts(this.filters.contacts.buffered);
			this.filters.contacts.buffered = false;
		}
	},
	
	'filtercontacts' : function (e)
	{
		var button = $(e.currentTarget);
		var param = {};
		
		// Add or remove contact
		if(button.data("contact"))
		{
			var contact = Cloudwalkers.Session.getContact(button.data("contact"));
			
			if(this.filters.contacts.list.indexOf(contact.id) < 0)
			{
				this.filters.contacts.list.push(contact.id);
				this.$el.find("ul.contacts-placeholder").append(Mustache.render (Templates.contactselectedentry, contact.attributes));
			}

		} else {
			
			var id = button.data("close-contact");
			this.filters.contacts.list = this.filters.contacts.list.filter(function(n){ return n != id });
			
			this.$el.find("[data-close-contact="+ id +"]").parent().remove();
		}
		
		// Fetch filtered messages
		this.collection.touch(this.model, this.filterparameters());
		
		return this;
	},
	
	'filternetworks' : function (e, all)
	{
		this.loadmylisteners(true);	
		
		// Check button state
		if(!all)
			all = this.button && this.button.data("networks") == $(e.currentTarget).data("networks");

		this.togglestreams(all);
		
		if(!all)
			this.button = $(e.currentTarget).addClass('active').removeClass('inactive');
		
		var streams = all? null: String(this.button.data("networks")).split(" ");
		
		if(all) this.button = false;
		
		
		// Highlight related streams and fetch
		if (streams)
		{
			$(streams.map(function(id){ return '[data-streams="'+ id +'"]'; }).join(",")).removeClass("inactive").addClass("active");
			this.filters.streams = streams;
		
		} else this.filters.streams = [];
		
		// Fetch filtered messages
		this.collection.touch(this.model, this.filterparameters());

		return this;
	},
	
	'filterstreams' : function (e, all)
	{
		this.loadmylisteners(true);
		
		// Check button state
		if(!all)
			all = this.button && this.button.data("streams") == $(e.currentTarget).data("streams");

		this.togglestreams(all);
		
		if(!all)
			this.button = $(e.currentTarget).addClass('active').removeClass('inactive');
		
		var stream = all? null: Number(this.button.data("streams"));
		
		if(all) this.button = false;
		
		
		// Highlight related streams and fetch
		if (stream)
		{
			$('[data-networks~="'+ stream +'"]').removeClass("inactive").addClass("active");
			this.filters.streams = [stream];
			
		} else this.filters.streams = [];
			
		// Fetch filtered messages
		this.collection.touch(this.model, this.filterparameters());
		
		return this;
	},
	
	/*'filterstreams' : function (e)
	{
		var button = $(e.currentTarget);
		var param = {records: 20};
		var streamids = [];
		
		button.active = button.toggleClass("inactive active").hasClass("active");
		
		var networks = this.$el.find ('div[data-streams].active');
		
		// Manipulate other buttons (one ugly motherfucker, just because we can)
		$(button.attr("data-streams").split(" ").map(function(id){ return '[data-streams~="'+ id +'"]'; }).join(",")).removeClass(button.active? "inactive": "active").addClass(button.active? "active": "inactive")
		

		// Listing
		this.$el.find ('li[data-streams].active').each(function() { streamids.push($(this).data('streams')) });
		
		// Network doublecheck (false enables)
		$(streamids.map(function(id){ return 'div[data-streams~="'+ id +'"]'; }).join(",")).removeClass("inactive").addClass("active")
		
		this.filters.streams = streamids;
		
		// Empty list if required
		if (!streamids.length)
		{
			this.$container.empty();
			return $(".inbox-container").empty();
		}
		
		// Fetch filtered messages
		this.collection.touch(this.model, this.filterparameters());
		
		return this;
	},*/
	
	'filterparameters' : function() {
		
		var param = {all: 1, records: 20, group: 1};
		
		if(this.filters.contacts.list.length) param.contacts = this.filters.contacts.list.join(",");
		if(this.filters.streams.length) param.streams = this.filters.streams.join(",");
		
		// And store
		this.storeview();
		
		return param;
	},
	
	'storeview' : function ()
	{
		
		// Memory cloth
		var settings = Cloudwalkers.Session.viewsettings(this.collectionstring);
		
		if(!settings)	return;
		if(!settings.streams) settings.streams = [];
		
		// And store
		if(JSON.stringify(settings.streams) != JSON.stringify(this.filters.streams))
		{
			settings.streams = this.filters.streams;
			Cloudwalkers.Session.viewsettings(this.collectionstring, settings);
		}
	},
	
	'more' : function ()
	{
		this.incremental = true;
		
		var hasmore = this.collection.more(this.model, this.filterparameters());
		
		if(!hasmore) this.$el.find(".load-more").hide();
	},
	
	'negotiateFunctionalities' : function() {
		
		this.listenTo(Cloudwalkers.Session, 'destroy:view', this.remove);
		
		this.addScroll();
	},
	
	'addScroll' : function () {

		this.$el.find('.scroller').slimScroll({
			height: "inherit"

		});
	},
	

});