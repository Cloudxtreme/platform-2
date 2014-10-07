define(
	['Views/Pageview', 'mustache', 'Session', 'Views/Root', 'Collections/Contacts', 'Views/Entry', 'Models/Contact'],
	function (Pageview, Mustache, Session, RootView, Contacts, EntryView, Contact)
	{
		var Timeline = Pageview.extend({
	
			id : "timeline",
			parameters: { records: 20, markasread: true },
			entries : [],
			check : "hasMessages",
			filters : {
				streams : []
			},

			events : 
			{
				'click *[data-action]' : 'action',
				'click [data-toggle]' : 'togglefilter',
				'click [data-streams]' : 'filterstreams',
				'click .load-more .more' : 'more',
				'click .load-more .timeline-icon' : 'more',
				'click [data-networks]' : 'filternetworks',
				'click .toggleall.networks.active' : 'toggleallnetworks',
				'click .toggleall.active' : 'toggleall',
			},
			
			initialize : function (options)
			{
				if (options) $.extend(this, options);
				
				this.collection = this.model.messages;
				
				this.$el.addClass("loading");
				
				// Listen to model
				this.listenTo(this.collection, 'seed', this.fill);

				// Memory cloth
				var settings = Session.viewsettings(this.model.get("type"));
				
				if (settings.streams)
					this.filters = {streams : settings.streams};
			},
			
			hideloading: function()
			{
				this.$el.removeClass("loading");
				this.$el.find(".timeline-loading.timeline-blue").hide();

				this.$el.find('.load-more .timeline-icon').removeClass('entry-loading');
				this.$el.find('.load-more .timeline-body span').html(this.translateString('view_more'));
			},

			toggleall : function ()
			{
				this.filternetworks(null, true);
				this.togglestreams(true);

				this.$el.find("[id^=filter_]").slideUp('fast');
				this.$el.find("[data-toggle=streams]").removeClass('selected');
			},
			
			render : function ()
			{	
				var param = {streams: [], networks: []};

				// Type of timeline (news or company accounts)
				if(this.model.get('type') == 'news')	this.rendernews(param);
				else									this.rendercompany(param);

				//Mustache Translate Render
				this.mustacheTranslateRender(param);

				this.$el.html (Mustache.render (Templates.timeline, param));

				// Set selected streams
				if (this.filters.streams.length)
				{
					this.$el.find("[data-streams], [data-networks], .toggleall").toggleClass("inactive active");			
					this.$el.find(this.filters.streams.map(function(id){ return '[data-networks~="'+ id +'"],[data-streams="'+ id +'"]'; }).join(",")).toggleClass("inactive active");
				}

				this.reload(param)

				this.resize(RootView.height());

				return this;
			},

			rendernews : function(param)
			{
				this.timelinetype = 'news';

				// Streams in the dropdown need to be fetched
				this.contacts = new Contacts([], {});
				this.listenTo(this.contacts, 'sync', this.fillcontacts.bind(this, param));

				this.contacts.touch(null, {records: 200});
			},

			rendercompany : function(param)
			{
				this.timelinetype = 'company';

				this.model.streams.each (function(stream)
				{
					if(stream.get(this.check)) param.streams.push({id: stream.id, icon: stream.get("network").icon, name: stream.get("defaultname"), network: stream.get("network")}); 

				}.bind(this));	

				// Select networks
				param.networks = this.model.streams.filterNetworks(param.streams, true);
			},

			reload : function(param)
			{	
				this.reloadui(param);
				
				/*if(!this.filters.streams.length)
					this.collection = this.model.messages;

				/*if(this.timelinetype == 'news'){

					var contact;

					if(this.filters.streams && this.filters.streams.length){

						contact = new Contact({id: this.filters.streams[0]});
						this.collection = this.model.messages.clone();
						contact.endpoint = 'messages';
						this.listenToOnce(this.collection, 'sync', this.fill);

						this.collection.url = contact.url();
						this.collection.parentmodel = 'contact';
						this.collection.parenttype = 'contact';
						this.collection.cursor = false;

						this.collection.fetch({endpoint: 'messages'});
						return;
					}
				}*/

				// Load messages
				this.collection.touch(this.model, this.filterparameters());
			},

			reloadui : function(param)
			{
				this.$el.addClass("loading");

				if(!param){
					param = {};

					//Mustache Translate Render
					this.mustacheTranslateRender(param);
				}		

				this.$el.find('ul.messages-container').empty().html(Mustache.render (Templates.timelinemessagelist, param));

				if(this.timelinetype == 'news' && !this.newsloaded)
					this.$el.find('.filter-bg').addClass('loading');

				this.$container = this.$el.find("ul.timeline").eq(0);
				this.$loadmore = this.$el.find(".load-more").remove();
				this.$nocontent = this.$el.find(".no-content").remove();
			},

			fillcontacts : function (param, models)
			{	
				var contacts = models.models;
				var streams = [];

				// Add contacts to list
				for (n in contacts)
				{	
					if(contacts[n].loaded()){
						
						streams.push({id: contacts[n].id, icon: contacts[n].get("network").icon, name: contacts[n].get("defaultname"), network: contacts[n].get("network")})

						this.$el.find('#filter_streams ul').append(Mustache.render(Templates.filterstream, contacts[n].attributes));
					}
				}

				param.streams = streams;

				// Select networks
				param.networks = this.model.streams.filterNetworks(param.streams, true);

				for (var n in param.networks)
				{
					var btn = '<div class="btn-white filter" data-networks="'+ param.networks[n].ids +'"><i class="icon-'+ param.networks[n].icon +'"></i></div>';

					this.$el.find('.caption').after(btn);
				}

				this.$el.find('.filter-bg .loadingafter').remove();
				this.newsloaded = true;
				
				// Set selected streams
				if (this.filters.streams.length)
				{
					this.$el.find("[data-streams], [data-networks], .toggleall").toggleClass("inactive active");			
					this.$el.find(this.filters.streams.map(function(id){ return '[data-networks~="'+ id +'"],[data-streams="'+ id +'"]'; }).join(",")).toggleClass("inactive active");
				}
			},

			filternetworks : function (e, all)
			{	
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
				this.reload();

				// Update memorycloth
				this.storeview();

				return this;
			},
			
			filterstreams : function (e, all)
			{	
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
				this.reload();
				
				// Update memorycloth
				this.storeview();

				return this;
			},
				
			filterparameters : function()
			{
				var param = this.parameters;
				var filter = this.timelinetype == 'news'? 'contacts': 'streams';
				
				if(this.filters.streams.length)
					param[filter] = this.filters.streams.join(",");
				else
					param[filter] = [];
				
				return param;

			},

			togglefilter : function(e)
			{
				var button = $(e.currentTarget);
				var toggle = button.data("toggle");
				var selected = button.hasClass("selected");
				
				this.$el.find("[data-toggle].selected").removeClass("selected");
				this.$el.find("[id^=filter_]").slideUp('fast');
				
				if(!selected)
				{
					button.addClass("selected");
					this.$el.find("#filter_" + toggle).slideDown('fast');
				}
			},
			
			fill : function (models)
			{	
				//For fetched accounts we follow messages
				if(models.models)
					models = models.models;

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
					//Company / third party
					models[n].attributes.showcontact = this.showcontact;
					var view = new EntryView ({model: models[n], template: 'newmessagetimeline', type: 'full', parameters:{trendview: this.trending}/*, parameters: this*/});
					
					this.entries.push (view);
					
					this.$container.append(view.render().el);
				}
				
				// Add loadmore button
				if (this.collection.cursor)
					this.$container.append(this.$loadmore);

				
				else if(!models.length)
					this.$container.append(this.$nocontent);	
				
				this.hideloading();
			},

			toggleallnetworks : function (all)
			{
				this.filternetworks(null, true);
			},

			togglefilters : function(streams)
			{
				streams = streams.join(" ");
				
				// Toggle streams
				this.$el.find("[data-network-streams]").removeClass('inactive');;	
				this.$el.find("[data-network-streams='" + streams + "']").addClass('inactive');		
				
				// Toggle select button
				this.$el.find(".toggleall").addClass('inactive');
			},

			togglestreams : function(all)
			{
				// Toggle streams
				this.$el.find('[data-networks], [data-streams]').addClass(all? 'active': 'inactive').removeClass(all? 'inactive': 'active');
				
				// Toggle select button
				this.$el.find('.toggleall').addClass(all? 'inactive': 'active').removeClass(all? 'active': 'inactive');
			},

			storeview : function ()
			{	
				
				// Memory cloth
				var settings = Session.viewsettings(this.model.get("type"));
				
				if(!settings)	return;
				if(!settings.streams) settings.streams = [];
				
				// And store
				if(JSON.stringify(settings.streams) != JSON.stringify(this.filters.streams))
				{
					settings.streams = this.filters.streams;
					Session.viewsettings(this.model.get("type"), settings);
				}
			},

			more : function ()
			{
				this.incremental = true;

				this.$el.find('.load-more .timeline-icon').addClass('entry-loading');
				this.$el.find('.load-more .timeline-body span').html(this.translateString('loading')+'...');
				
				var hasmore = this.collection.more(this.model, this.filterparameters());
				
				if(!hasmore) this.$el.find(".load-more").hide();
			},

			resize : function(height)
			{	
				this.$el.css('min-height', height);
			},

			translateString : function(translatedata)
			{	
				// Translate String
				return Session.polyglot.t(translatedata);
			},

			mustacheTranslateRender : function(translatelocation)
			{
				// Translate array
				this.original  = [
					"loading",
					"view_more",
					"no_messages",
					"comments",
					"filters",
					"select_all",
					"more"
				];

				this.translated = [];

				for (var k in this.original)
				{
					this.translated[k] = this.translateString(this.original[k]);
					translatelocation["translate_" + this.original[k]] = this.translated[k];
				}
			}
		});

		return Timeline;
	}
);

