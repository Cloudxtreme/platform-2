Cloudwalkers.Views.Widgets.NoteEntry = Cloudwalkers.Views.Entry.extend({
	
	'tagName' : 'li',
	'template': 'messagenote',

	'events' : {
		'mouseover' : 'toggleactions',
		'mouseout' : 'toggleactions',
		'click *[data-notification-action]' : 'action',
		'click .note-header' : 'togglenote',
	},

	'initialize' : function(options)
	{	
		this.parameters = {};
		if(options) $.extend(this, options);

		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'destroy', this.remove);
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
		e.stopPropagation();

		// Action token
		var token = $(e.currentTarget).data ('notification-action');		
		this.model.trigger("action", token);

		if(token == 'edit'){
			if(!this.$el.find('.note-body').is(':visible'))	this.togglenote();
			this.editnote();
		}
	},

	'editnote' : function()
	{	
		var composenote = new Cloudwalkers.Views.ComposeNote({note: this.model});

		this.listenTo(composenote, 'edit:cancel', this.canceledit);

		this.$el.find('.note-body').html(composenote.render().el);
	},

	'canceledit' : function()
	{	
		this.$el.find('.note-body').html(this.model.get("text"));
	},

	'remove' : function ()
    {	
		this.$el.slideUp(300);

		setTimeout(function(){
			this.remove()
		}.bind(this),300);
    }

});