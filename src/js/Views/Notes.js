define(
	['Views/Pageview', 'mustache',  'Views/Root', 'Views/Widgets/InboxNotesList'],
	function (Pageview, Mustache, RootView, InboxNotesListWidget)
	{
		var Notes = Pageview.extend({
	
			title : 'Notes',
			className : "container-fluid inbox inbox-notes",
					
			initialize : function(options)
			{
				this.model = Cloudwalkers.Session.getAccount();
				this.translateTitle("notes");
			},

			render : function()
			{

				// Translation for Title
				this.translateTitle("notes");
				
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
				
				this.appendWidget(list, 4);
				this.appendhtml(Templates.inboxcontainer);
				
				return this;
			},

			translateTitle : function(translatedata)
			{	
				// Translate Title
				this.title = Cloudwalkers.Session.polyglot.t(translatedata);
		 	},

			resize : function(height)
			{
				this.$el.find("#widgetcontainer").height(height -140);
			},
			
			finish : function()
			{
				
				this.resize(RootView.height());
				
				// Add scroller for message
				$message = this.$el.find(".inbox-container").wrap("<div class='scroller'>");
				
				$message.parent().slimScroll({height: "inherit"});
			},

			translateString : function(translatedata)
			{	
				// Translate String
				return Cloudwalkers.Session.polyglot.t(translatedata);
			}
		});

		return Notes;
	}
);