define(
	['Views/Pages/Pageview', 'mustache',  'Views/Root', 'Views/Panels/EntryLists/BoxLists/InboxNotesList'],
	function (Pageview, Mustache, RootView, InboxNotesListWidget)
	{
		var Notes = Pageview.extend({
	
			title : 'Notes',
			className : "container-fluid",
			id : "notes",

			initialize : function(options)
			{
				this.model = Cloudwalkers.Session.getAccount();
			},

			render : function()
			{	
				// Create pageview
				this.$el.html (Mustache.render (Templates.pageview, {'title' : this.title}));
				this.$container = this.$el.find("#widgetcontainer").eq(0);
				
				// Dedect childtype
				//this.options.channel.childtype = this.options.type.slice(0, -1);
				
				var params = {
					'check' : "hasnotes",
					'collectionstring' : "notes",
					'listtype' : 'notes',
					model: this.model
				}

				// Add list widget
				var list = new InboxNotesListWidget(params);

				this.list = list;
				
				this.appendWidget(list, 4);
				this.appendhtml(Templates.inboxcontainer);

				// Add refresh button
				this.$el.find('.page-title').eq(0).append('<span class="listrefresh loading"></span></h3>');
				
				return this;
			},

			refreshlist : function()
			{
				this.list.trigger('refresh:list');
			},

			resize : function(height)
			{
				this.$el.find("#widgetcontainer").height(height -140);
			},
			
			finish : function()
			{
				
				this.resize(Cloudwalkers.RootView.height());
				
				// Add scroller for message
				//$message = this.$el.find(".inbox-container").wrap("<div class='scroller'>");
				
				//$message.parent().slimScroll({height: "inherit"});

				this.$el.find('.scroller').slimScroll({
					height: "inherit"
				});
			}
		});

		return Notes;
	}
);