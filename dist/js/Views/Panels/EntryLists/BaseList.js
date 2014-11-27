define(
	['Views/Panels/Panel', 'mustache', 'Views/Entries/MessageEntry', 'Views/Panels/LoadMore'],
	function (Panel, Mustache,  MessageEntry, LoadMoreWidget)
	{
		var CoworkersList = Panel.extend({

			title: "List messages",
			entries : [],
			type: 'list',
			events : {
				'remove' : 'destroy',
				'click .load-more' : 'more'
			},

			options : {},
			
			initialize : function (options)
			{
				if(options) $.extend(this, options);	
				
				// Add collection
				if (!this.model.messages) this.model.messages = new Messages();
				
				// Listen to model messages and users
				this.listenTo(this.model.messages, 'seed', this.fill);	
				this.listenTo(this.model.messages, 'request', this.showloading);
				this.listenTo(this.model.messages, 'ready', this.showmore);
				this.listenTo(this.model.messages, 'destroy', this.showmore);
				this.listenTo(this.model.messages, 'loaded', this.hideloading);

				//Show all reloads te listeners
				this.listenTo(this.model.messages, 'update:content', this.loadmylisteners);
				this.listenTo(this.model.messages, 'refresh:list', this.loadmylisteners);

				this.listenTo(Cloudwalkers.RootView, 'added:message', function(){ this.model.messages.touch(this.model, this.parameters); }.bind(this));
			},

			render : function (params)
			{	
				var data = {title: this.title};
				
				//Reseting the parameters
		        this.parameters = {records: 20};
				this.loadmylisteners();

				// Get template
				this.$el.html (Mustache.render (Templates.baselist, data));
				
				this.$container = this.$el.find ('.message-container');
				this.$loadercontainer = this.$el.find ('.panel-body');
				//this.$el.find(".load-more").hide();

				this.loadListeners(this.model.messages, ['request', 'sync', 'ready'], true);
				
				if(params)	this.parameters = params;

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

			fill : function (list)
			{		
				// Clean load or add
				if(this.incremental) this.incremental = false;
				else
				{
					$.each(this.entries, function(n, entry){ entry.remove()});
					this.entries = [];
				}
				
				// Add messages to view
				for (var n in list)
				{	
					var model = list[n];
					var view = new MessageEntry ({model: model, template: "unifiedmessage"});
					this.entries.push (view);

					// Filter user
					if (model.get("from")) this.model.seedusers(model);
					
					else this.listenTo(model, "change:from", this.model.seedusers.bind(this.model))
					
					this.$container.append(view.render().el);
				}
				
				// Check for pagination
				this.checkmore();
			},

			loadmylisteners : function(){
				
				this.loadListeners(this.model.messages, ['request', 'sync', ['ready','destroy']], true);
			},
			
			showloading : function ()
			{
				this.$el.find(".fa-cloud-download").show();
				this.$el.find(".load-more").hide();

				$('.listrefresh').eq(0).addClass('loading');
			},
			
			hideloading : function ()
			{
				this.$el.find(".fa-cloud-download").hide();
			},

			checkmore : function() 
			{
				if (this.model.messages.cursor)
					this.hasmore = true;
				else
					this.hasmore = false;
			},

			showmore : function()
			{					
				$('.listrefresh').eq(0).removeClass('loading');

				setTimeout(function()
				{		
					this.$container.css('max-height', 999999);

					if(!this.hasmore)
						return this.$el.find('#loadmore').empty();	

					var load = new LoadMoreWidget({list: this.model.messages, parentcontainer: this.$container});
					this.$el.find('#loadmore').html(load.render().el);

					this.loadmore = load;

				}.bind(this),200)
				
			},
			
			more : function ()
			{
				this.incremental = true;	

				this.loadmore.loadmylisteners();
						
				var hasmore = this.model.messages.more(this.model, this.parameters);		
				if(!hasmore) this.$el.find(".load-more").hide();
			},
			
			negotiateFunctionalities : function()
			{
				this.listenTo(Cloudwalkers.Session, 'destroy:view', this.remove);
			},
			
			destroy : function()
			{
				$.each(this.entries, function(n, entry){ entry.remove()});
			}
		});
		
		return CoworkersList;
});