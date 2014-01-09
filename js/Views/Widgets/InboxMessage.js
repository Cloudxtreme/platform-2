/* Temporary, should be "Message" view. One for all. */
Cloudwalkers.Views.Widgets.InboxMessage = Cloudwalkers.Views.Entry.extend({
	
	'tagName' : 'div',
	'className' : "message social-box-colors",
	'related' : [],
	'notifications' : [],
	
	'events' : 
	{
		'click *[data-action]' : 'action'
	},
	
	'initialize' : function ()
	{
		this.message = this.options.model;

		this.listenTo(this.message, 'change', this.render.bind(this));
	},

	'render' : function ()
	{
		// Parameters
		var params = {};
		$.extend(params, this.message.attributes);

		if (params.date)
			params.fulldate = moment(params.date).format("DD MMM YYYY HH:mm");
		
		if (params.attachments)
		{
			params.attachments = {};
			$.each(this.message.get("attachments"), function(n, object){ params.attachments[object.type] = object });
		}
		
		if (this.message.get("stream"))
		{
			var stream = Cloudwalkers.Session.getStream(this.message.get("stream"));
			
			params.icon = stream.get("network").icon;
			params.networkdescription = stream.get("defaultname");
			params.stream = stream;
			
			//params.share = this.message.filterShareData(stream);
		}
		
		// add optional notifications
		if(this.options.notification)
			params.commented = {from: this.options.notification.get("from")[0], timeago: moment(this.options.notification.get("date")).fromNow()};
		
		// Visualise	
		this.$el.html(Mustache.render (Templates.inboxmessage, params));
		
		// Check notifications (second conditional, after message render)
		if (this.options.notification && this.message.get("objectType")) this.addNotifications();
		
		return this;
	},
	
	'showrelated' : function()
	{	
		// Create & append related container
		this.$related = $('<ul></ul>');
		this.$el.after(this.$related.addClass("related-messages social-box-colors"));
		
		
		// Create related collection
		if(!this.message.related)
			this.message.related = new Cloudwalkers.Collections.Messages({modelstring: "related", typestring: "related", parenttype: "message"});
		
		// Listen to collection
		this.listenTo(this.message.related, 'seed', this.fillrelated);
			
		// Load messages
		this.message.related.touch(this.message, {records: 20});
		
		// Show global loader
		$(".page-title i").removeClass("hidden");
	},
	
	'fillrelated' : function(models)
	{
		// Clean load or add
		if(this.incremental) this.incremental = false;
		else
		{
			$.each(this.related, function(n, entry){ entry.remove()});
			this.related = [];
		}
		
		// Filter out existing model
		models = models.filter(function(model){ return model.id != this.message.id }.bind(this));

		// Add models to view
		for (n in models)
		{	
			var view = new Cloudwalkers.Views.Entry ({model: models[n], template: 'inboxrelatedmessage', type: 'inbox'});
			
			this.related.push (view);
			
			this.$related.append(view.render().el);
		}
		
		// Hide global loader
		$(".page-title i").addClass("hidden");
	},
	
	'addNotifications' : function()
	{
		// Does collection exist?
		if(!this.message.notifications)
			this.message.notifications = new Cloudwalkers.Collections.Notifications();
		
		// Load notifications
		this.listenTo(this.message.notifications, 'seed', this.fillNotifications);
		//this.listenTo(this.message.notifications, 'sync', this.fillNotifications);
		
		this.message.notifications.touch(this.message, {records: 50, group: 1});
	},
	
	'fillNotifications' : function (list)
	{
		// Clean load
		if(this.notifications.length)
		{
			$.each(this.notifications, function(n, entry){ entry.remove()});
			this.notifications = [];
		}
		
		// Create array if collection
		if(list.models) list = list.models;
		
		// Clear comments list
		var $container = this.$el.find(".message-comments ul").eq(0).html("");

		// Add models to view
		for (n in list)
		{
			var view = new Cloudwalkers.Views.Notification ({model: list[n], template: 'inboxcomment', active: list[n].id == this.options.notification.id});
			this.notifications.push (view);
			
			$container.append(view.render().el);
		}
	}
	
	/*
	'fillNotifications' : function(list)
	{
		// Don't proceed when empty
		if(!list.length) return false;
		
		// Create array if collection
		if(list.models) list = list.models;
		
		// Clear comments list
		var $container = this.$el.find(".message-comments ul").eq(0).html("");
		
		for(n in list)
		{
			var date = list[n].get("date")? moment(list[n].get("date")).format("DD MMM YYYY HH:mm"): null;
			var active = list[n].id == this.options.notification.id;
			
			var param = {from: list[n].get("from"), body: list[n].get("body"), fulldate: date, active: active, attachments: {}};
			
			if (list[n].get("attachments"))
				$.each(list[n].get("attachments"), function(n, object){ param.attachments[object.type] = object });
				
			$container.append(Mustache.render(Templates.inboxcomment, param));
		}
	}
	*/
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