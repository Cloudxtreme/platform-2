
define(
	['Views/Widgets/Widget', 'Collections/Messages', 'Session', 'Views/Root', 'Views/Entry', 'Views/Widgets/LoadMore', 'Views/Widgets/MessageContainer'],
	function (Widget, Messages, Session, RootView, EntryView, LoadMoreWidget, MessageContainerWidget)
	{
		var ScheduledList = Widget.extend({

			'id' : 'scheduledlist',
			'title': "Scheduled messages",
			'parameters' : {records: 200, sort: 'asc'},
			'entries' : [],
			
			'events' : {
				'remove' : 'destroy',
				'click .load-more' : 'more'
			},
			
			'initialize' : function (options)
			{
				if(options) $.extend(this, options);	
				
				// Add collection
				if (!this.model.messages) this.model.messages = new Messages();
				
				// Listen to model messages and users

				this.listenTo(this.model.messages, 'seed', this.fill);
				this.listenTo(this.model.messages, 'request', this.showloading);
				this.listenTo(this.model.messages, 'ready', this.showmore);
				this.listenTo(RootView, 'added:message', function(){ this.model.messages.touch(this.model, this.parameters); }.bind(this));

				// Watch outdated
				// this.updateable(this.model, "h3.page-title");

				// Translation for Title
				this.translateTitle("scheduled_messages");
				
			},

			'render' : function (params)
			{	
				this.loadmylisteners();

				var data = {};

				//Mustache Translate Render
				data.title = this.title;
				this.mustacheTranslateRender(data);

				// Get template
				this.$el.html (Mustache.render (Templates.scheduledlist, data));
				
				//this.model.messages.on('all', function(a){console.log(a)})

				this.$container = this.$el.find ('.messages-container');
				this.$loadercontainer = this.$el.find ('.portlet-body');
				this.$el.find(".load-more").hide();
				
				if(params){	
					this.parameters = params;
					Session.viewsettings('scheduled', {streams: params.target? [params.target]: []});
				}
				else if(this.filters.streams.length)
					this.parameters.target = this.filters.streams.join(",");

				// Load category message
				this.model.messages.touch(this.model, this.parameters);
					
				this.addScroll();

				return this;
			},

			'loadmylisteners' : function()
			{
				this.loadListeners(this.model.messages, ['request', 'sync', ['ready','loaded','destroy']], true);
			},
			
			'showloading' : function ()
			{
				//this.$el.find(".icon-cloud-download").show();
				this.$el.find(".load-more").hide();
			},
			
			'hideloading' : function ()
			{
				//this.$el.find(".icon-cloud-download").hide();
				this.$container.removeClass("inner-loading");
				
				if (this.model.messages.cursor)
					this.hasmore = true;
				else
					this.hasmore = false;
			},

			'showmore' : function(){

				setTimeout(function()
				{	//Hack
					this.$container.css('max-height', 999999);

					if(!this.hasmore)
						return this.$el.find('#loadmore').empty();	

					var load = new LoadMoreWidget({list: this.model.messages, parentcontainer: this.$container});
					this.$el.find('#loadmore').html(load.render().el);

					this.loadmore = load;

				}.bind(this),200)
			},
			
			'fill' : function (list)
			{		
				// Clean load or add
				if(this.incremental) this.incremental = false;
				else
				{
					$.each(this.entries, function(n, entry){ entry.remove()});
					this.entries = [];
				}
				
				// Store amount
				this.count = list.length;
				
				// Get messages
				//var messages = this.category.messages.seed(ids);
				
				// Add messages to view
				for (n in list)
				{
					var view = new EntryView ({tagName: "tr", model: list[n], type: "full", template: "scheduledentry"});
					this.entries.push (view);
					
					this.$container.append(view.render().el);
				}
				
				// Hide loading
				this.hideloading();
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
			
			'more' : function ()
			{
				this.incremental = true;

				this.loadmore.loadmylisteners();	
						
				var hasmore = this.model.messages.more(this.model, this.parameters);		
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
			
			'negotiateFunctionalities' : function() {
				
				this.listenTo(Session, 'destroy:view', this.remove);
				
				//this.addScroll();
			},
			
			'addScroll' : function () {

				this.$el.find('.scroller').slimScroll({
					size: '6px',
					color: '#a1b2bd',
					height: $("#inner-content").height() -165 + "px",
					alwaysVisible: false,
					railVisible: false
				});
			},
			
			'destroy' : function()
			{
				$.each(this.entries, function(n, entry){ entry.remove()});
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
					"start_date",
					"networks",
					"message",
					"actions"
				];

				this.translated = [];

				for(k in this.original)
				{
					this.translated[k] = this.translateString(this.original[k]);
					translatelocation["translate_" + this.original[k]] = this.translated[k];
				}
			}
		});

		return ScheduledList;
});

