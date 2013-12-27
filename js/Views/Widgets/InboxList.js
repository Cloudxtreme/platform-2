Cloudwalkers.Views.Widgets.InboxList = Cloudwalkers.Views.Widgets.Widget.extend({

	'id' : 'inboxlist',
	'entries' : [],
	'filters' : {contacts:{string:""}},
	
	'events' : {
		'click .select-streams-filter' : 'togglefilter',
		'click .select-contacts-filter' : 'togglefilter',
		'click .load-more' : 'more'
	},
	
	'initialize' : function ()
	{
		// Which model to focus on
		this.model = (this.options.streamid)?
			Cloudwalkers.Session.getStream(Number(this.options.streamid)): this.options.channel;
			
			
		// Clear the model (prevent non-change view failure)
		this.model.set({messages: []});
		
		// Listen to model
		this.listenTo(this.model, 'change:messages', this.fill);
		this.listenTo(this.model, 'request', this.showloading);
		this.listenTo(this.model, 'sync', this.hideloading);
		
		// Load model messages
		this.model.fetch({endpoint: "messageids", parameters:{records: 50}});
		
		// Listen to contacts collection
		//this.listenTo(this.model.contacts, 'sync', this.newcontacts);
		this.listenTo(this.model.contacts, 'add', this.addcontactselect);
		this.listenTo(this.model.messages, 'change:from', this.seedcontacts);
	},

	'render' : function ()
	{	
		// Get template
		this.$el.html (Mustache.render (Templates.inboxlist, {streams: this.model.streams.models}));
		
		this.$container = this.$el.find ('ul.list');
		this.$el.find(".load-more").hide();
		
		
		// Parse filters Hack
		this.$el.find(".inbox-filter select").eq(1).on("chosen:ready", function()
		{
			this.togglefilter({currentTarget: this.$el.find(".select-contacts-filter")});
			
			this.$el.find("#filter_contacts_chosen input").on("input", this.contactsinputtrigger.bind(this));
			
		}.bind(this)).on("change", function(e,m){
			
			var param = {records: 50};
			var values = $(e.currentTarget).val();
			
			if(values.length) param.contacts = values.join(",");
			
			this.model.fetch({endpoint: "messageids", parameters: param});
			
		}.bind(this));
		
		this.$el.find(".inbox-filter select").chosen({width: "76%"});
		
		
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
			
			this.$container.append(messageView.render().el);
			
			this.listenTo(messageView, "toggle", this.toggle);
		}
		
		// Toggle first message
		if( this.entries.length)
			this.toggle(this.entries[0]);
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
		$(".inbox-filter .active").removeClass("active");
		
		var iscontacts = $(e.currentTarget).addClass("active").hasClass("select-contacts-filter");
		
		this.$el.find(iscontacts? "#filter_contacts_chosen": "#filter_streams_chosen").addClass("active");
		
	},
	
	/* Contacts Filter Functions */
	
	'seedcontacts' : function (message)
	{
		var contacts = message.get("from");
		
		if (contacts.length)
			this.model.contacts.add(contacts);	
	},
	
	'addcontactselect' : function(contact)
	{
		if(!this.$el.find("select option[value=" + contact.id + "]").length)
			
			this.updatecontactsselect();
	},
	
	'updatecontactsselect' : function ()
	{
		var $select = $("#filter_contacts");
		var $input = $("#filter_contacts_chosen input");
		
		var selected = $select.val();
		var string = $input.val();
		
		$select.empty();

		this.model.contacts.each(function(contact)
		{
			$select.append("<option value='"+ contact.id +"'>" + contact.get("displayname") + "</option>");
		});
		
		for(n in selected) $select.find('[value='+selected[n]+']').attr("selected", "selected");
		
		$select.trigger("chosen:updated");
		$input.val(string);
	},
	
	'newcontacts' : function ()
	{
		var $select = $("#filter_contacts");
		var selected = $select.val();
		
		var $input = $("#filter_contacts_chosen input");
		var string = $input.val();
		
		$select.html("");

		this.model.contacts.each(function(contact)
		{
			$select.append("<option value='"+ contact.id +"'>" + contact.get("displayname") + "</option>");
		});
		
		for(n in selected) $select.find('[value='+selected[n]+']').attr("selected", "selected");
		
		$select.trigger("chosen:updated");
		$input.val(string);
	},
	
	'contactsinputtrigger' : function()
	{
		// Parameters
		var string = $("#filter_contacts_chosen input").val().toLowerCase();
		
		var contacts = this.model.contacts.filter(function(contact)
		{
			var displayname = contact.get("displayname").toLowerCase();
			var name = contact.get("name");
			
			return displayname.indexOf(string) >= 0 || (name && name.toLowerCase().indexOf(string) >= 0); 
		});

		// Ask for more
		if (contacts.length <= 3 && string.length >= 2) this.requestcontacts(string);
	},
	
	'requestcontacts' : function(string)
	{
		if(string != this.filters.contacts.string)
		{
			var param = {q: string};
			param[this.model.get("objectType")] = this.model.id;
			
			if(!this.model.contacts.processing)
			{
				this.filters.contacts.string = string;
				this.model.contacts.fetch({remove: false, parameters: param});
			}
		}
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


/*
Cloudwalkers.Views.Widgets.InboxList = Cloudwalkers.Views.Widgets.DetailedList.extend({

	'template' : 'detailedlist',
	'messagetemplate' : 'messagedetailedlist',
	'messageelement' : 'tr',
	'id' : 'inbox',

	'currentSelected' : null,

	'render' : function ()
	{
		var self = this;

		this.$innerEl = this.$el;
		this.innerRender (this.$innerEl);

		this.$el.attr ('id', 'list');

		this.on ('content:change', function ()
		{
			
			if (self.currentSelected)
			{
				self.currentSelected.$el.find ('td').addClass ('active');
			}
			
		});

		return this;
	},
	
	'innerRender' : function (element)
	{
		
		var self = this;
		var data = {};

		jQuery.extend (true, data, this.options);

		element.html (Mustache.render (Templates[this.template], data));

		this.options.channel.bind('add', this.addOne, this);
        this.options.channel.bind('refresh', this.refresh, this);
        this.options.channel.bind('reset', this.refresh, this);
        this.options.channel.bind('sort', this.resort, this);
        this.options.channel.bind('remove', this.removeMessage, this);

        Cloudwalkers.Session.bind 
        (
        	'message:add', 
        	function () 
        	{ 
        		self.options.channel.reset (); 
        		self.options.channel.fetch (); 
        	}, 
        	this
        );

		// Fetch!
		this.options.channel.fetch ({
			'error' : function (e)
			{
				console.log (e);
			},
			'success' : function (e)
			{
				if (self.options.channel.length) self.maximizeView();

				// Change laoding class
				$("#inboxcontainer").toggleClass((self.options.channel.length)? 'inner-loading': 'inner-empty inner-loading');

				self.afterInit ();
			}
		});

		// Auth refresh
		this.interval = setInterval (function ()
		{
			self.options.channel.update ();
		}, 1000 * 15);

		return this;
	},

	'processMessageView' : function (message, view)
	{
		var self = this;
		view.$el.click (function ()
		{
			self.$el.find ('td').removeClass ('active');

			self.currentSelected = view;

			self.currentSelected.$el.find ('td').addClass ('active');
			self.trigger ('select:message', message);
		});
	},

	'onFirstAdd' : function (message, messageView)
	{
		if (!this.options.selectmessage)
		{
			setTimeout (function ()
			{
				messageView.$el.click ();
			}, 100);
		}
	},

	'afterInit' : function ()
	{
		if (this.options.selectmessage)
		{
			this.$el.find ('.messages-container').find ('[data-message-id=' + this.options.selectmessage + ']').click ();
		}
	},
	
	'maximizeView' : function() {
		
		var height = $("#inner-content").height() -90;
		
		$("#inboxcontainer, #list .portlet-body").css({"height": height + "px", "max-height": height + "px"});
		
		this.addScroll();
		
	},
	
	'addScroll' : function () {

		this.$el.find('.scroller').slimScroll({
			size: '6px',
			color: '#a1b2bd',
			position: 'right',
			height: 'auto',
			alwaysVisible: false,
			railVisible: false,
			disableFadeOut: true
		});
	}


});*/