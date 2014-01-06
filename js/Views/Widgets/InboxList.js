Cloudwalkers.Views.Widgets.InboxList = Cloudwalkers.Views.Widgets.Widget.extend({

	// To-do: if url streamid is given, load network-related only.
	// To-do: add loading underneath message view
	// To-do: local manipulate list-view & toggle

	'id' : 'inboxlist',
	'entries' : [],
	'filters' : {
		contacts : {string:"", list:[]},
		streams : []
	},
	
	'events' : {
		'click [data-toggle]' : 'togglefilter',
		'input .input-rounded' : 'comparesuggestions',
		'click [data-contact]' : 'filtercontacts',
		'click [data-close-contact]' : 'filtercontacts',
		'click [data-streams]' : 'filterstreams',
		'click .load-more' : 'more'
	},
	
	'initialize' : function ()
	{
		// Which model to focus on
		this.model = this.options.channel;

		// Clear the model (prevent non-change view failure)
		this.model.set({messages: []});
		
		// Listen to model
		this.listenTo(this.model, 'change:messages', this.fill);
		this.listenTo(this.model, 'request', this.showloading);
		this.listenTo(this.model, 'sync', this.hideloading);
		
		// Load model messages
		this.model.fetch({endpoint: "messageids", parameters:{records: 50}});
		
		// Listen to contacts collection
		this.listenTo(this.model.contacts, 'add', this.comparesuggestions);
		this.listenTo(this.model.messages, 'change:from', this.seedcontacts);
	},

	'render' : function ()
	{	
		// Template data
		var param = {streams: [], networks: this.model.streams.filterNetworks(null, true)};

		this.model.streams.each (function(stream){ param.streams.push({id: stream.id, icon: stream.get("network").icon, name: stream.get("defaultname")}); });
		
		// Get template
		this.$el.html (Mustache.render (Templates.inboxlist, param));
		
		this.$container = this.$el.find ('ul.list');
		this.$el.find(".load-more").hide();
		
		return this;
	},
	
	'showloading' : function ()
	{
		this.$el.find(".icon-cloud-download").show();
		this.$el.find(".load-more").hide();
	},
	
	'hideloading' : function ()
	{
		this.$el.find(".icon-cloud-download").hide();
		this.$el.find(".load-more").show();
		
		this.$container.removeClass("inner-loading");
	},
	
	'fill' : function (category, ids)
	{
		// Clean load or add
		if(this.incremental) this.incremental = false;
		else
		{
			$.each(this.entries, function(n, entry){ entry.remove()});
			this.entries = [];
		}
		
		// Get messages
		var messages = this.model.messages.seed(ids);
		var preload = [];

		// Add messages to view
		for (n in messages)
		{
			var messageView = new Cloudwalkers.Views.Entry ({model: messages[n], template: 'smallentry', type: 'inbox'});
			
			this.entries.push (messageView);
			this.listenTo(messageView, "toggle", this.toggle);
			
			this.$container.append(messageView.render().el);
		}
		
		// Toggle first message
		if(this.entries.length) this.toggle(this.entries[0]);
	},
	
	'toggle' : function(view)
	{
		if (this.inboxmessage) this.inboxmessage.remove();

		this.inboxmessage = new Cloudwalkers.Views.Widgets.InboxMessage({model: view.model});
		
		$(".inbox-container").html(this.inboxmessage.render().el);
		
		this.$el.find(".list .active").removeClass("active");
		view.$el.addClass("active");
	},
	
	'togglefilter' : function(e)
	{
		var button = $(e.currentTarget);
		var toggle = button.data("toggle");
		var selected = button.hasClass("selected");
		
		$("[data-toggle].selected").removeClass("selected");
		$("[id^=filter_]").addClass("hidden");
		
		if(!selected)
		{
			button.addClass("selected");
			$("#filter_" + toggle).removeClass("hidden");
		}
	},
	
	'seedcontacts' : function (message)
	{
		var contacts = message.get("from");
		
		if (contacts.length) this.model.contacts.add(contacts);	
	},
	
	'comparesuggestions' : function (iscontact)
	{
		var string = $("#filter_contacts input").val();
		
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
		this.model.fetch({endpoint: "messageids", parameters: this.filterparameters()});
		
		return this;
	},
	
	'filterstreams' : function (e)
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
		this.model.fetch({endpoint: "messageids", parameters: this.filterparameters()});
		
		return this;
	},
	
	'filterparameters' : function() {
		
		var param = {records: 20};
		
		if(this.filters.contacts.list.length) param.contacts = this.filters.contacts.list.join(",");
		if(this.filters.streams.length) param.streams = this.filters.streams.join(",");
		
		return param;
	},
	
	'more' : function ()
	{
		this.incremental = true;
		
		// update parameters with after cursor	
		var param = this.model.parameters;
		param.after = this.model.get("paging").cursors.after;
		
		this.model.fetch({endpoint: "messageids", parameters:param})
		
	},
	
	'negotiateFunctionalities' : function() {
		
		this.listenTo(Cloudwalkers.Session, 'destroy:view', this.remove);
		
		this.addScroll();
	},
	
	'addScroll' : function () {

		this.$el.find('.scroller').slimScroll({
			height: $("#inner-content").height() -165 + "px",

		});
	}
});