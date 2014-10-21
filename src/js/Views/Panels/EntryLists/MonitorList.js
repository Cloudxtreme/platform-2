	
define(
	['Views/Panels/EntryLists/BaseList', 'mustache', 'Views/Entries/BaseEntry'],
	function (BaseList, Mustache, EntryView)
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

				this.$container = this.$el.find ('.messages-container');
				this.$loadercontainer = this.$el.find ('.portlet-body');
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
				this.listenTo(this.model.messages, 'sync', this.hideloading);
				this.listenTo(this.model.messages, 'ready', this.showmore);

				this.loadListeners(this.model.messages, ['request', 'sync', 'ready'], true);
			},
			
			/*showloading : function ()
			{
				this.$el.find(".icon-cloud-download").show();
				this.$el.find(".load-more").hide();
			},*/

			/*hideloading : function ()
			{
				this.$el.find(".icon-cloud-download").hide();
				
				if (this.category.messages.cursor)
					this.hasmore = true;
				else
					this.hasmore = false;
				
				this.$container.removeClass("inner-loading");
			},*/

			/*showmore : function(){

				setTimeout(function()
				{	//Hack
					this.$container.css('max-height', 999999);

					if(!this.hasmore)
						return this.$el.find('#loadmore').empty();	

					var load = new LoadMoreWidget({list: this.model.messages, parentcontainer: this.$container});
					this.$el.find('#loadmore').html(load.render().el);

					this.loadmore = load;

				}.bind(this),200)
			},*/
			
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
					var view = new EntryView ({model: list[n], type: "full", template: "messagefullentry"});
					this.entries.push (view);
					
					this.$container.append(view.render().el);
				}
			},
			
			/*more : function ()
			{
				this.incremental = true;

				this.loadmore.loadmylisteners();
				
				var hasmore = this.model.messages.more(this.model, this.parameters);//this.category.parameters);
				
				if(!hasmore) this.$el.find(".load-more").hide();
			},*/
			
			/*negotiateFunctionalities : function() {
				
				this.listenTo(Cloudwalkers.Session, 'destroy:view', this.remove);
			},*/
			
			/*addScroll : function () {

				var scroll = this.$el.find('.scroller').eq(0);

				this.$el.find('.scroller').slimScroll({
					size: '6px',
					color: '#a1b2bd',
					height: $("#inner-content").height() -165 + "px",
					alwaysVisible: false,
					railVisible: false
				});

				var height = scroll.css('height');
			
				// Update slimscroll plugin default styling
				scroll.css('max-height', height);
				scroll.css('height', 'inherit')
			},*/
			
			/*destroy : function()
			{
				$.each(this.entries, function(n, entry){ entry.remove()});
			}*/
		});

		return MonitorList;
	}
);