define(
	['Views/Widgets/Widget', 'mustache', 'Collections/Users', 'Views/User'],
	function (Widget, Mustache, Users, UserView)
	{
		var DraftsFilters = Widget.extend ({

			filters : {
				users : {string:"", list:[]}
			},

			events : {
				'remove' : 'destroy',
				'input .input-rounded' : 'comparesuggestions',
				'click .load-more' : 'more',
				'click .toggleall.active' : 'toggleall'
			},

			options : {},
			
			initialize : function (options)
		    {
				if(options) 		$.extend(this.options, options);
				if(options.model)	this.model = this.options.model;

				this.model.childtype = "message";
				
				// Check contacts collection existance
				if (!this.model.users) this.model.users = new Users();
				else this.model.users.reset();
				
				// Listen to contacts collection
				this.listenTo(this.model.users, 'add', this.comparesuggestions);
				
		    },

			render : function ()
			{
				var data = {reports: []};
				
				//Mustache Translate Render
				this.mustacheTranslateRender(data);
						

				// View
				this.$el.html (Mustache.render (Templates.draftsfilters, data));
				
				this.$container = this.$el.find("#users-list").eq(0);
				
				return this;
			},
			
			toggleall : function ()
			{
				this.showsuggestions(this.model.users.models);
				
				//triggers the list to re-listen to events
				this.model.messages.trigger('update:content');

				// Load category message
				this.model.messages.touch(this.model, {records: 20});
			},
			
			comparesuggestions : function (isuser)
			{
				// Toggle all active
				this.$el.find(".toggleall").addClass('active').removeClass('inactive');
				
				
				var string = $("#filter_contacts input").val();
				
				if(!string) return this.hidesuggestions();
				else string = string.toLowerCase();
				
				var users = this.model.users.filter(this.comparenamefilter.bind(this, string));
				
				// On typed, search for more
				if (users.length < 5 && !isuser.cid && string.length > 2) this.requestusers(string);

				if (!users.length)
				{
					return this.hidesuggestions();
				} 
				else this.showsuggestions(users.slice(0,10));
				
			},
			
			comparenamefilter : function(string, user)
			{
				return user.get("displayname").toLowerCase().indexOf(string) >= 0 || (user.get("name") && user.get("name").toLowerCase().indexOf(string) >= 0);
			},
			
			hidesuggestions : function()
			{
				// Load current users
				this.fill(this.model.users.models);
			},
			
			showsuggestions : function(contacts)
			{
				this.fill(contacts);
			},
			
			requestusers : function(string)
			{
				if(string != this.filters.users.string)
				{
					if(!this.model.users.processing)
					{
						this.$el.find(".loading-contacts").removeClass("hidden");
						
						this.filters.users.string = string;
						this.model.users.fetch({remove: false, parameters: {q: string}, success: this.loadedusers.bind(this)});
					
					} else this.filters.users.buffered = string;
				}
			},
			
			loadedusers : function()
			{
				this.$el.find(".loading-contacts").addClass("hidden");
				
				// Check pending requests
				if(this.filters.users.buffered)
				{
					this.requestusers(this.filters.users.buffered);
					this.filters.users.buffered = false;
				}
			},

			
			filter : function (e)
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
			
			fill : function (models)
			{	
				// Clean load
				$.each(this.entries, function(n, entry){ entry.remove()});
				this.entries = [];
				
				// Add models to view
				for (var n in models)
				{
					var view = new UserView ({model: models[n], template: 'smalluser', type: 'listitem'});
					
					this.entries.push (view);
					this.listenTo(view, "select", this.select);
					
					this.$container.append(view.render().el);
				}
				
				// End loading
				this.$el.find(".inner-loading").removeClass("inner-loading")
			},
			
			select : function(view)
			{	
				// Render list
				this.list.render({users: view.model.id, records: 20});
				/*
				this.list.model.messages.touch(this.list.model, {records: 20, users: view.model});*/
			},
			
			translateString : function(translatedata)
			{	
				// Translate String
				return Cloudwalkers.Session.translate(translatedata);
			},

			mustacheTranslateRender : function(translatelocation)
			{
				// Translate array
				this.original  = [
					"editors",
					"search_co-workers",
					"suggestions",
					"show_all",
					"manage_users"
				];

				this.translated = [];

				for (var k in this.original)
				{
					this.translated[k] = this.translateString(this.original[k]);
					translatelocation["translate_" + this.original[k]] = this.translated[k];
				}
			}
		});

		return DraftsFilters;
});