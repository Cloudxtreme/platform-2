Cloudwalkers.Views.Widgets.NoteEntry = Cloudwalkers.Views.Entry.extend({
	
	'tagName' : 'li',
	'template': 'messagenote',

	'events' : {
		'mouseover' : 'toggleactions',
		'mouseout' : 'toggleactions',
		'click *[data-notification-action]' : 'action',
		'click' : 'togglenote',
	},

	'initialize' : function(options)
	{	
		this.parameters = {};
		if(options) $.extend(this, options);

		this.listenTo(this.model, 'change', this.render);
	},

	'render' : function ()
	{	
		this.model.attributes.date = moment(this.model.attributes.date).format("DD MMM YYYY");
		this.$el.html (Mustache.render (Templates[this.template], this.model.attributes));

		return this;
	},

	'togglenote' : function()
	{
		this.$el.find('.note-body').slideToggle('fast');
	},

	'toggleactions' : function(e)
	{	
		var out = e.originalEvent.type == "mouseout";
		
		this.$el.find(".message-actions")[out? "addClass": "removeClass"]("hidden");
		this.$el.find(".comment-info")[out? "removeClass": "addClass"]("hidden");
	},

	'action' : function(e)
	{	
		e.preventDefault();

		// Action token
		var token = $(e.currentTarget).data ('notification-action');		
		this.model.trigger("action", token);

		if(token == 'edit')
			this.editnote();
	},

	'editnote' : function()
	{	
		var composenote = new Cloudwalkers.Views.ComposeNote({note: this.model})
		this.$el.html(composenote.render().el);
	}

});