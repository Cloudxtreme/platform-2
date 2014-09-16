Cloudwalkers.Views.Widgets.SentMessageList = Cloudwalkers.Views.Widgets.InboxMessageList.extend({
	
	'initialize' : function (options, /* Deprecated? */ pageviewoptions)
	{
		if(options) $.extend(this, options);
		
		// Which model to focus on
		if(!this.model)	this.model = this.options.channel;
		this.collection = this.model[this.collectionstring];
		
		//Load all listeners
		this.loadmylisteners();
	},

	'render' : function()
	{	
		var param = {streams: [], networks: []};
		var streams = Cloudwalkers.Session.getChannel('outgoing').streams;

		streams.each (function(stream)
		{
			if(stream.get(this.check)) param.streams.push({id: stream.id, icon: stream.get("network").icon, name: stream.get("defaultname"), network: stream.get("network")}); 

		}.bind(this));
		
		// Select networks
		param.networks = streams.filterNetworks(param.streams, true);

		//Mustache Translate Render
		this.mustacheTranslateRender(param);
		
		// Get template
		this.$el.html (Mustache.render (Templates.inboxlist, param));

		this.$container = this.$el.find ('ul.list');
		
		// Set selected streams
		if (this.filters.streams.length)
		{
			this.$el.find("[data-streams], [data-networks], .toggleall").toggleClass("inactive active");
			
			this.$el.find(this.filters.streams.map(function(id){ return '[data-networks~="'+ id +'"],[data-streams="'+ id +'"]'; }).join(",")).toggleClass("inactive active");
		}

		// Load messages
		this.collection.touch(this.model, this.filterparameters(),  {fields: 'defaults,sendlogs'});
		
		return this;
	},

	'toggle' : function(view)
	{	
		var options = {model: view.model, template: 'sentmessage'};
		
		if (this.inboxmessage) this.inboxmessage.remove();		
		if (this.collectionstring == 'notes')	options.template = 'note';

		this.inboxmessage = new Cloudwalkers.Views.Widgets.InboxMessage(options);
		
		$(".inbox-container").html(this.inboxmessage.render().el);
		
		this.$el.find(".list .active").removeClass("active");
		view.$el.addClass("active");
	},

	'fill' : function (models)
	{	
		var template = this.templates[this.collectionstring];		

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
			var view = new Cloudwalkers.Views.Entry ({model: models[n], template: template/*, type: 'full'*/, checkunread: true, parameters:{sentview: true}});
			
			this.entries.push (view);
			this.listenTo(view, "toggle", this.toggle);
			
			this.$container.append(view.render().el);
			
			// Filter contacts
			if(this.model.seedcontacts)
				this.model.seedcontacts(models[n]);
		}
		
		// Toggle first message
		if(this.entries.length) setTimeout(this.toggle.bind(this, this.entries[0]), 1);
		else 					this.hidemore();
	},

	'storeview' : function ()
	{	
		
		// Memory cloth
		var settings = Cloudwalkers.Session.viewsettings('sent');
		
		if(!settings)	return;
		if(!settings.streams) settings.streams = [];
		
		// And store
		if(JSON.stringify(settings.streams) != JSON.stringify(this.filters.streams))
		{
			settings.streams = this.filters.streams;
			Cloudwalkers.Session.viewsettings('sent', settings);
		}
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


});