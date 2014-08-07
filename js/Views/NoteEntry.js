Cloudwalkers.Views.NoteEntry = Cloudwalkers.Views.Entry.extend({
	
	'events' : 
	{
		'remove' : 'destroy',
		'click [data-notifications]' : 'loadNotifications',
		'click [data-youtube]' : 'loadYoutube',
		'click *[data-action]' : 'action',
		'click' : 'toggle',
	},
	
	'initialize' : function (options)
	{
		this.parameters = {};
		
		if(options) $.extend(this, options);

		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'action:toggle', this.toggleaction);
		this.listenTo(this.model, 'destroy', this.remove);
		
	},
	

	'render' : function ()
	{
		// Parameters
		$.extend(this.parameters, this.model.attributes);
		
		// A loaded model
		if(this.model.loaded())
		{
			// Load Parent data
			if(this.model.loaded("model"))
				if(!this.model.parent)
				{
					this.model.parent = this.model.attachParent(this.model.get("model").objectType, this.model.get("model").id);
					if(!this.model.parent.loaded()) this.listenTo(this.model.parent, "sync", this.render)
				
				} else
					this.parameters.parent = this.model.parent.attributes;
				
			// Load Actions
			if(this.type == "full") this.parameters.actions = this.model.filterActions();
		}
		
		// Apply role permissions to template data
		Cloudwalkers.Session.censuretemplate(this.parameters);

		// Visualize
		for(n in this.parameters.actions)
			this.parameters.actions[n].name_translated = this.translateString(this.parameters.actions[n].name)

		this.$el.html (Mustache.render (Templates[this.template], this.parameters));
		
		if(this.$el.find("[data-date]")) this.time();

		return this;
	}
});