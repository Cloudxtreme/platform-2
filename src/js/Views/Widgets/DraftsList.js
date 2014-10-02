define(
	['Views/Widgets/Widget', 'Collections/Messages'],
	function (Widget, Messages)
	{
		var DraftsList = Widget.extend({

			'id' : 'draftsparent',
			'title': "Draft messages",
			'parameters' : {records: 20},
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
				this.listenTo(this.model.messages, 'destroy', this.showmore);
				this.listenTo(Cloudwalkers.RootView, 'added:message', function(){ this.model.messages.touch(this.model, this.parameters); }.bind(this));

				//Show all reloads te listeners
				this.listenTo(this.model.messages, 'update:content', this.loadmylisteners);
				
				// Watch outdated
				// this.updateable(this.model, "h3.page-title");

				// Translation for Title
				this.translateTitle("draft_messages");
				
			},

			'render' : function (params)
			{ 	
				this.loadmylisteners();

				// Get template
				var data = {reports: []};

				//Mustache Translate Render
				data.title = this.title;
				this.mustacheTranslateRender(data);

				// View
				this.$el.html (Mustache.render (Templates.coworkerslist, data));
				
				this.$container = this.$el.find ('.messages-container');
				this.$loadercontainer = this.$el.find ('.portlet-body');
				//this.$el.find(".load-more").hide();
				
				if(params)	this.parameters = params;

				// Load category message
				this.model.messages.touch(this.model, this.parameters);
				
				this.addScroll();

				return this;
			},

			'loadmylisteners' : function(){
				
				this.loadListeners(this.model.messages, ['request', 'sync', ['ready','loaded','destroy']], true);
			},
			
			'showloading' : function ()
			{ 
				//this.$el.find(".icon-cloud-download").show();
				this.$el.find(".load-more").hide();
			},
			
			'hideloading' : function ()
			{
				this.$el.find(".icon-cloud-download").hide();
				this.$container.removeClass("inner-loading");
				
				if (this.model.messages.cursor)
					this.hasmore = true;
				else
					this.hasmore = false;
			},

			'showmore' : function(){

				setTimeout(function()
				{		
					this.$container.css('max-height', 999999);

					if(!this.hasmore)
						return this.$el.find('#loadmore').empty();	

					var load = new Cloudwalkers.Views.Widgets.LoadMore({list: this.model.messages, parentcontainer: this.$container});
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
				
				// Get messages
				//var messages = this.category.messages.seed(ids);
				
				// Add messages to view
				for (n in list)
				{
					var view = new Cloudwalkers.Views.Entry ({model: list[n], type: "full", template: "coworkersmessage"});
					this.entries.push (view);

					// Filter user
					if (list[n].get("from")) this.model.seedusers(list[n]);
					
					else this.listenTo(list[n], "change:from", this.model.seedusers.bind(this.model))
					
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
					
					var messageView = new Cloudwalkers.Views.Entry ({model: messages[n], type: "full", template: "messagefullentry"});
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
					"load_more"
				];

				this.translated = [];

				for(k in this.original)
				{
					this.translated[k] = this.translateString(this.original[k]);
					translatelocation["translate_" + this.original[k]] = this.translated[k];
				}
			}
		});

		return DraftsList;
});



