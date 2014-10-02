Cloudwalkers.Views.Widgets.TagEntry = Cloudwalkers.Views.Entry.extend({
	
	'tagName' : 'span',
	'template': 'messagetag',

	'events' : {
		'mouseover' : 'toggleactions',
		'mouseout' : 'toggleactions',
		'click *[data-tag-action]' : 'action',
		'click *[data-action]' : 'action',
	},

	'initialize' : function(options)
	{	
		this.parameters = {};
		if(options) $.extend(this, options);

		if(this.parent && this.model)
			this.model.parent = this.parent;

		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'destroytag', this.remove);
	},

	'render' : function ()
	{	
		// Apply role permissions to template data
		Session.censuretemplate(this.model.attributes);
		
		if(this.model.attributes.name){
			this.$el.html (Mustache.render (Templates[this.template], this.model.attributes));	
		}
		
		return this;
	},

	'remove' : function ()
    {	
		this.$el.remove();
    },
	'action' : function(token)
	{
		if(this.$el.closest('.message-tags').hasClass('enabled')){
			this.model.deletetag();
		}
	}
});