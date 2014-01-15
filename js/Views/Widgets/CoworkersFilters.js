Cloudwalkers.Views.Widgets.CoworkersFilters = Cloudwalkers.Views.Widgets.Widget.extend ({

	'events' : {
		'remove' : 'destroy',
		'input .input-rounded' : 'comparesuggestions',
		'click .load-more' : 'more'
	},
	
	'initialize' : function (options)
    {
		if(options) $.extend(this, options);

		this.model.childtype = "message";
		
		// Check contacts collection existance
		if (!this.model.users) this.model.users = new Cloudwalkers.Collections.Users();
		
		// Listen to contacts collection
		this.listenTo(this.model.contacts, 'add', this.fill);
		this.listenTo(this.model.contacts, 'add', this.comparesuggestions);
    },

	'render' : function ()
	{
		// View
		this.$el.html (Mustache.render (Templates.coworkersfilters));
		
		/*var data = {keywords: this.category.channels.models};
		
		data.name = this.category.get("name");
		data.networks = Cloudwalkers.Session.getStreams().filterNetworks(this.streams, true);
		

		
		
		if(!data.networks.length) this.$el.find(".building-notice").toggleClass("inactive");
		
		this.listenTo(Cloudwalkers.Session, 'destroy:view', this.remove);*/
		
		return this;
	},
	
	'comparesuggestions' : function (isuser)
	{
		var string = $("#filter_users input").val();
		
		if(!string) return this.hidesuggestions();
		else string = string.toLowerCase();
		
		var users = this.model.users.filter(this.comparenamefilter.bind(this, string));
		
		// On typed, search for more
		if (users.length < 5 && !isuser.cid && string.length > 2) this.requestcontacts(string);

		if (!users.length)
		{
			return this.hidesuggestions();
		} 
		else this.showsuggestions(users.slice(0,10));
		
	},
	
	'comparenamefilter' : function(string, user)
	{
		return user.get("displayname").toLowerCase().indexOf(string) >= 0 || (user.get("name") && user.get("name").toLowerCase().indexOf(string) >= 0);
	},
	
	'filter' : function (e)
	{
		$(e.currentTarget).toggleClass("inactive active")
		
		// Get all active channels
		var keywords = this.$el.find ('.filter.keyword-list .active');
		var keywordids = [];
		
		// if all channels are inactive
		if(!keywords.size()) return this.list.$container.empty();

		keywords.each(function(){ keywordids.push($(this).attr('data-keyword-id'))});
		
		
		// Get all active streams
		var networks = this.$el.find ('.filter.network-list .active');
		var networkids = [];
		
		// if all networks are inactive
		if(!networks.size()) return this.list.$container.empty();

		networks.each( function()
		{
			networkids = networkids.concat($(this).attr('data-network-streams').split(" "));
		});

		// Fetch filtered messages
		this.category.messages.touch(this.category, {records: 40, channels: keywordids.join(","), streams: networkids.join(",")}); //this.collection.touch(this.model, {records: 50, group: 1});
		//this.category.fetch({endpoint: "messageids", parameters: {records: 25, channels: keywordids.join(","), streams: networkids.join(",")}});
		
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
			var view = new Cloudwalkers.Views.Entry ({model: models[n], template: 'smallentry', type: 'inbox'});
			
			this.entries.push (view);
			this.listenTo(view, "toggle", this.toggle);
			
			this.$container.append(view.render().el);
			
			// Filter contacts
			this.model.seedcontacts(models[n]);
		}
		
		// Toggle first message
		if(this.entries.length) setTimeout(this.toggle.bind(this, this.entries[0]), 1);
		else 					this.hidemore();
	},
});