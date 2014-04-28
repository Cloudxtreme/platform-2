Cloudwalkers.Views.ManageAccounts = Cloudwalkers.Views.Pageview.extend({
	
	'id' : 'manageaccounts',
	'className' : "container-fluid",
	'title' : 'Manage Accounts',
	
	'entries' : [],
	'events' : {
		'rendered' : 'bubblerender',
		'remove': 'destroy',
		
		'search .input-large' : 'posturl',
		'blur .input-large' : 'posturl'
	},
	
	'initialize' : function (options)
	{
		if(options) $.extend(this, options);
	
		// Which collection to focus on
		this.collection = new Cloudwalkers.Collections.Contacts([], {});
		
		// Listen to contacts collection
		//this.listenTo(this.collection, 'seed', this.fill);
		this.listenTo(this.collection, 'add', this.addcontact);
	},
	
	'render' : function()
	{
		// Select Networks
		var networks = this.channel.streams.filterNetworks(null, true);
		
		// Template
		this.$el.html (Mustache.render (Templates.manageaccounts, {title: this.title, networks: networks}));
		this.$container = this.$el.find(".contacts-list");
		
		// Load messages
		this.collection.touch(null, {records: 200});
		
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
			var view = new Cloudwalkers.Views.ContactView ({model: models[n], parameters:{inboxview: true}});
			
			this.entries.push (view);
			
			this.$container.append(view.render().el);
		}
	},
	
	'addcontact' : function (model)
	{
		// Create view
		view = new Cloudwalkers.Views.ContactView ({model: model, parameters:{}});
			
		this.entries.push (view);
		
		this.$container.prepend(view.render().el);

	},
	
	'posturl' : function (e)
	{
		var input = $(e.currentTarget);
		
		if(!input.val()) return null;
		
		// Add contact to list
		this.collection.create({url: input.val(), following: true}, {wait: true, error: this.postfailure.bind(this, input.val())});
		
		// Empty input
		input.val("");
		
	},
	
	'postfailure' : function (url)
	{
		Cloudwalkers.RootView.information ("Non-supported profile", "This link is not recognized: " + url, this.$el.find(".info-container"));
	}
	
	/*'limitlistener' : function()
	{
		var limit = Cloudwalkers.Session.getChannel("monitoring").channels.reduce(function(p, n){ return ((typeof p == "number")? p: p.get("channels").length) + n.get("channels").length });
		
		Cloudwalkers.Session.getAccount().monitorlimit('keywords', limit, ".add-keyword");
	}*/

});