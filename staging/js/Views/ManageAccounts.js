define(
	['Views/Pageview', 'mustache', 'Session', 'Views/Root', 'Collections/Contacts', 'Views/ContactView'],
	function (Pageview, Mustache, Session, RootView, ContactsCollection, ContactView)
	{
		var ManageAccounts = Pageview.extend({
	
			'id' : 'manageaccounts',
			'className' : "container-fluid",
			'title' : 'Manage Accounts',
			
			'entries' : [],
			'events' : {
				'rendered' : 'bubblerender',
				'remove': 'destroy',
				
				'search .input-large' : 'posturl',
				'blur .input-large' : 'posturl',
				
				'click *[data-network]' : 'filter',
				'click .toggleall.active' : 'toggleall'
			},
			
			'initialize' : function (options)
			{
				
				if(options) $.extend(this, options);
			
				// Which collection to focus on
				this.collection = new ContactsCollection([], {});
				
				// Listen to contacts collection
				this.listenTo(this.collection, 'seed', this.limited);
				this.listenTo(this.collection, 'remove', this.limited);
				this.listenTo(this.collection, 'add', this.addcontact);

				// Translation for Title
				this.translateTitle("manage_accounts");
			},
			
			'render' : function()
			{
				// Select Networks
				var networks = this.channel.streams.filterNetworks(null, true);
				
				var data = {networks: networks};
				
				//Mustache Translate Render
				data.title = this.title;
				this.mustacheTranslateRender(data);

				// Template
				this.$el.html (Mustache.render (Templates.manageaccounts, data));
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
					var view = new ContactView ({model: models[n], parameters:{inboxview: true}});
					
					this.entries.push (view);
					
					this.$container.append(view.render().el);
				}
			},
			
			'addcontact' : function (model)
			{
				// Create view
				view = new ContactView ({model: model, parameters:{}});
					
				this.entries.push (view);
				
				this.$container.prepend(view.render().el);
				
				// Loading symbel
				this.$el.find(".icon-cloud-upload").toggleClass("icon-search icon-cloud-upload");
				
				// Limited
				this.listenTo(model, 'unfollow', function(model){ this.collection.remove(model)});

			},
			
			'posturl' : function (e)
			{
				var input = $(e.currentTarget);
				
				if(!input.val()) return null;
				
				// Add contact to list
				this.collection.create({url: input.val(), following: true}, {wait: true, error: this.postfailure.bind(this, input.val())});
				
				// Loading symbel
				this.$el.find(".url-post span").toggleClass("icon-search icon-cloud-upload");
				
				// Limit listener
				this.listenToOnce(this.collection, 'add', this.limited);
				
				// Empty input
				input.val("");
				
			},
			
			'postfailure' : function (url)
			{
				// Loading symbel
				this.$el.find(".icon-cloud-upload").toggleClass("icon-search icon-cloud-upload");
				
				RootView.information ("Non-supported profile", "This link is not recognized: " + url, this.$el.find(".info-container"));
			},
			
			'limited' : function (collection)
			{
				var limited = Session.getAccount().monitorlimit('following', this.collection.models.length, $(".url-post, .url-post .input-large"));	
			},
			
			/** 
			 *	Filter
			**/
			
			'filter' : function (e, all)
			{
				
				// Check button state
				if(!all)
					all = this.button && this.button.data("network") == $(e.currentTarget).data("network");

				this.togglefilters(all);
				
				if(!all)
					this.button = $(e.currentTarget).addClass('active').removeClass('inactive');
				
				var network = all? null: this.button.data("network");
				
				if(all) this.button = false;

				// Fetch filtered messages
				if(!all) this.$el.find(".contacts-list li").not("." + network).addClass("hidden");
				
				this.$el.find(".contacts-list li." + (network? network : "hidden")).removeClass("hidden");
				
				
				return this;
			},
			
			'togglefilters' : function(all)
			{
				// Toggle streams
				this.$el.find('div[data-network]').addClass(all? 'active': 'inactive').removeClass(all? 'inactive': 'active');
				
				// Toggle select button
				this.$el.find('.toggleall').addClass(all? 'inactive': 'active').removeClass(all? 'active': 'inactive');
			},
			
			'toggleall' : function ()
			{
				
				this.filter(true);
				this.togglefilters(true);
			},
			'translateTitle' : function(translatedata)
			{	
				// Translate Title
				this.title = Session.polyglot.t(translatedata);
			},
			'translateString' : function(translatedata)
			{	
				// Translate String
				return Session.polyglot.t(translatedata);
			},
			'mustacheTranslateRender' : function(translatelocation)
			{
				// Translate array
				this.original  = [
					"networks",
					"show_all",
					"enter_profile_link"
				];

				this.translated = [];

				for(k in this.original)
				{
					this.translated[k] = this.translateString(this.original[k]);
					translatelocation["translate_" + this.original[k]] = this.translated[k];
				}
			}

		});

		return ManageAccounts;
	}
);