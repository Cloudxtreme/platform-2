
define(
	['Views/Widgets/Widget', 'mustache', 'Session', 'Views/Widgets/LoadMore', 'Views/Entry'],
	function (Widget, Mustache, Session, LoadMoreWidget, EntryView)
	{
		var MonitorList = Widget.extend({

			id : 'monitorparent',
			parameters : {records: 40, markasread: true},
			entries : [],
			
			events : {
				'remove' : 'destroy',
				'click .load-more' : 'more'
			},
			
			initialize : function ()
			{
				this.category = this.options.category;

				// Clear the category (prevent non-change view failure)
				this.category.set({messages: []});
				this.listenTo(this.category.messages, 'change:filter', this.loadmylisteners.bind(this, true));
				this.loadmylisteners();
						
				// Load category messages
				// this.category.fetch({endpoint: "messageids", parameters:{records: 25}});
				
				if(this.options.reset){
					delete this.parameters.streams;
					delete this.parameters.channels;
				}

				// Watch outdated
				this.updateable(this.category, "h3.page-title");
			},

			render : function ()
			{
				var data = {};
				//Mustache translations
				data.name = this.category.get("name");
				data.translate_load_more = this.translateString("load_more");

				// Get template
				this.$el.html (Mustache.render (Templates.monitorlist, data));		

				this.$container = this.$el.find ('.messages-container');
				this.$loadercontainer = this.$el.find ('.portlet-body');
				this.$el.find(".load-more").hide();
				
				// Load category message
				this.category.messages.touch(this.category, this.parameters);
				
				this.addScroll();

				return this;
			},

			loadmylisteners : function(recycle)
			{
				if(recycle){
					this.stopListening(this.category.messages);
					this.listenTo(this.category.messages, 'change:filter', this.loadmylisteners.bind(this, true));
				}

				this.$el.find('#loadmore').empty();
				
				// Listen to category
				this.listenTo(this.category.messages, 'seed', this.fill);
				this.listenTo(this.category.messages, 'request', this.showloading);
				this.listenTo(this.category.messages, 'sync', this.hideloading);
				this.listenTo(this.category.messages, 'ready', this.showmore);

				this.loadListeners(this.category.messages, ['request', 'sync', 'ready'], true);
			},
			
			showloading : function ()
			{
				this.$el.find(".icon-cloud-download").show();
				this.$el.find(".load-more").hide();
			},

			hideloading : function ()
			{
				this.$el.find(".icon-cloud-download").hide();
				
				if (this.category.messages.cursor)
					this.hasmore = true;
				else
					this.hasmore = false;
				
				this.$container.removeClass("inner-loading");
			},

			showmore : function(){

				setTimeout(function()
				{	//Hack
					this.$container.css('max-height', 999999);

					if(!this.hasmore)
						return this.$el.find('#loadmore').empty();	

					var load = new LoadMoreWidget({list: this.category.messages, parentcontainer: this.$container});
					this.$el.find('#loadmore').html(load.render().el);

					this.loadmore = load;

				}.bind(this),200)
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
				for (n in list)
				{
					var view = new EntryView ({model: list[n], type: "full", template: "messagefullentry"});
					this.entries.push (view);
					
					this.$container.append(view.render().el);
				}
			},
			
			/*'fill' : function (category, ids)
			{
				// Clean load or add
				if(this.incremental) this.incremental = false;
				else
				{
					$.each(this.entries, function(n, entry){ entry.remove()});
					this.entries = [];
				}
				
				// Get messages
				var messages = this.category.messages.seed(ids);
				//Session.getMessages().seed(ids);
				
				// Add messages to view
				for (n in messages)
				{
					//var message = Session.getMessage(ids[n]);
					
					var messageView = new EntryView ({model: messages[n], type: "full", template: "messagefullentry"});
					this.entries.push (messageView);
					
					this.$container.append(messageView.render().el);
				}
			},*/
			
			more : function ()
			{
				this.incremental = true;

				this.loadmore.loadmylisteners();
				
				var hasmore = this.category.messages.more(this.category, this.parameters);//this.category.parameters);
				
				if(!hasmore) this.$el.find(".load-more").hide();
			},
			
			/*'more' : function ()
			{
				this.incremental = true;
				
				// update parameters with after cursor	
				var param = this.category.parameters;
				param.after = this.category.get("paging").cursors.after;
				
				this.category.fetch({endpoint: "messageids", parameters:param})
				
			},*/
			
			negotiateFunctionalities : function() {
				
				this.listenTo(Session, 'destroy:view', this.remove);
				
				//this.addScroll();
			},
			
			addScroll : function () {

				this.$el.find('.scroller').slimScroll({
					size: '6px',
					color: '#a1b2bd',
					height: $("#inner-content").height() -165 + "px",
					alwaysVisible: false,
					railVisible: false
				});
			},
			
			destroy : function()
			{
				$.each(this.entries, function(n, entry){ entry.remove()});
			},
			
			translateString : function(translatedata)
			{	
				// Translate String
				return Session.polyglot.t(translatedata);
			}
		});

		return MonitorList;
	}
);