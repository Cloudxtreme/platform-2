	
define(
	['Views/Panels/EntryLists/BaseList', 'mustache', 'Views/Entries/MessageEntry'],
	function (BaseList, Mustache, MessageEntry)
	{
		var MonitorList = BaseList.extend({

			id : 'monitorparent',
			parameters : {records: 40, markasread: true},
			
			initialize : function (options)
			{
				if(options)	$.extend(this.options, options);

				this.model = this.options.category;

				// Clear the category (prevent non-change view failure)
				this.model.set({messages: []});
				this.listenTo(this.model.messages, 'change:filter', this.loadmylisteners.bind(this, true));
				this.loadmylisteners();
						
				// Load category messages
				// this.category.fetch({endpoint: "messageids", parameters:{records: 25}});
				
				if(this.options.reset){
					delete this.parameters.streams;
					delete this.parameters.channels;
				}

				// Watch outdated
				this.updateable(this.model, "h3.page-title");
			},

			render : function ()
			{
				var data = { name:  this.model.get("name") };

				// Get template
				this.$el.html (Mustache.render (Templates.monitorlist, data));		

				this.$container = this.$el.find ('.entry-container');
				this.$loadercontainer = this.$el.find ('.panel-body');
				this.$el.find(".load-more").hide();
				
				// Load category message
				this.model.messages.touch(this.model, this.parameters);
				
				this.addScroll();

				var scroll = this.$el.find('.slimScrollDiv').eq(0);
				var height = scroll.css('height');
			
				// Update slimscroll plugin default styling
				scroll.css('max-height', height);
				scroll.css('height', 'inherit')

				return this;
			},

			loadmylisteners : function(recycle)
			{
				if(recycle){
					this.stopListening(this.model.messages);
					this.listenTo(this.model.messages, 'change:filter', this.loadmylisteners.bind(this, true));
				}

				this.$el.find('#loadmore').empty();
				
				// Listen to category
				this.listenTo(this.model.messages, 'seed', this.fill);
				this.listenTo(this.model.messages, 'request', this.showloading);
				this.listenTo(this.model.messages, 'ready', this.showmore);
				this.listenTo(this.model.messages, 'loaded', this.hideloading);

				this.loadListeners(this.model.messages, ['request', 'sync', 'ready'], true);
			},
			
			fill : function (list)
			{		
				// Clean load or add
				if(this.incremental) this.incremental = false;
				else
				{
					$.each(this.entries, function(n, entry){ entry.remove()});
					this.entries = [];
				}
				
				// Get messages
				//var messages = this.category.messages.seed(ids);
				
				// Add messages to view
				for (var n in list)
				{
					var view = new MessageEntry ({model: list[n], template: "keywordentry"});
					this.entries.push (view);
					
					this.$container.append(view.render().el);
				}
			}
		});

		return MonitorList;
	}
);