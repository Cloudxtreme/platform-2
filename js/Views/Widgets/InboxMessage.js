/* Temporary, should be "Message" view. One for all. */
Cloudwalkers.Views.Widgets.InboxMessage = Cloudwalkers.Views.Entry.extend({
	
	'tagName' : 'div',
	'className' : "message social-box-colors",

	'events' : 
	{
		'click *[data-action]' : 'action',
	},
	
	'initialize' : function ()
	{
		this.message = this.options.model;

		this.listenTo(this.message, 'change', this.render.bind(this));
		
	},

	'render' : function ()
	{

		var param = {}
		
		// Hacky check: is this really a message?
		if (this.message.get("date") && this.message.get("objectType") == "comment")
		{
			this.comment = this.message;
			
			this.stopListening(this.message);
			
			var messages = Cloudwalkers.Session.getMessages().seed([this.message.get("parent").id]);
			this.message = messages[0];
			
			this.listenTo(this.message, 'change', this.render.bind(this));
		}
		
		// Parameters
		$.extend(param, this.message.attributes);
		
		if (param.attachments)
		{
			param.attachments = {};
			$.each(this.message.get("attachments"), function(n, object){ param.attachments[object.type] = object });
		}
			
		
		// Load Comments
		if (this.comment)
		{
			param.commented = {from: this.comment.get("from")[0], timeago: moment(this.comment.get("date")).fromNow()};
			
			// Fetch (hack: should be only once)
			if(!this.message.comments)
				this.message.comments = new Cloudwalkers.Collections.Comments();
			
			this.message.comments.fetch({parentid: this.message.id});
			
			this.listenTo(this.message.comments, 'sync', this.fillComments);
		}		
		
			
		if (this.message.get("stream"))
		{
			var stream = Cloudwalkers.Session.getStream(this.message.get("stream"));
			
			param.icon = stream.get("network").icon;
			param.networkdescription = stream.get("defaultname");
			param.stream = stream;
			
			param.share = this.message.filterShareData(stream);
		}		
		
		if (param.date)
			param.fulldate = moment(param.date).format("DD MMM YYYY HH:mm");

		// Visualise	
		this.$el.html(Mustache.render (Templates.inboxmessage, param));
		
		console.log("message params: ", param)
		
		return this;
	},
	
	'fillComments' : function(collection)
	{
		// Don't proceed when empty
		if(!collection.length) return false;
		
		// Clear comments list
		var $container = this.$el.find(".message-comments ul").eq(0).html("");
		
		collection.each(function(comment){
			
			var param = {from: comment.get("from"), body: comment.get("body"), fulldate: moment(comment.get("date")).format("DD MMM YYYY HH:mm"), active: comment.id == this.comment.id, attachments: {}}
			
			if (comment.get("attachments"))
				$.each(comment.get("attachments"), function(n, object){ param.attachments[object.type] = object });
			
			$container.append(Mustache.render(Templates.inboxcomment, param));
			
		}.bind(this));
		
	} 
});

/*
Cloudwalkers.Views.Widgets.InboxMessage = Cloudwalkers.Views.Widgets.DetailedView.extend({

	'id' : 'inbox',

	'initialize' : function ()
	{
		var self = this;
		this.options.list.on ('select:message', function (message) { self.selectMessage (message); });
	},

	'selectMessage' : function (message)
	{
		var messageView;

		// ALWAYS show the parent message
		var parent = message.get ('parentmodel');
		var selectedcomment = null;

		if (parent)
		{
			selectedcomment = message;
			message = parent;
		}

		var parameters = {
			'model' : message,
			'selectedchild' : selectedcomment,
			'template' : 'messagedetailview',
			'childtemplate' : 'messagedetailviewchild',
			'originaltemplate' : 'messagedetailoriginal',
			'tagName' : 'div',
			'showcomments' : true
		};

		messageView = new Cloudwalkers.Views.Message (parameters);

		this.$el.html (messageView.render ().el);
		
		this.setHeight(messageView.$el);
		this.addScroll(messageView.$el);
		
	},
	
	'render' : function ()
	{
		this.$el.html ('');
		
		return this;
	},
	
	'setHeight' : function($el) {
		
		$el.css("height", $("#inboxcontainer").height() - 16 + "px");	
	},
	
	'addScroll' : function ($el) {

		$el.find('.scroller').slimScroll({
			size: '6px',
			color: '#a1b2bd',
			position: 'right',
			height: 'auto',
			alwaysVisible: false,
			railVisible: false,
			disableFadeOut: true
		});
	}
});
*/