Cloudwalkers.Views.Settings.Trigger = Backbone.View.extend({

	'events' : {
		'click [data-action=save]' : 'save',
		'click [data-action=reset]' : 'reset'
	},
	
	'initialize' : function(options)
	{
		$.extend(this, options);

		if(!this.model)	this.model = new Cloudwalkers.Models.Trigger();
	},

	'render' : function()
	{	
		this.model.parent = Cloudwalkers.Session.getAccount();
		
		var params = {
			message: this.model.getmessage('REPLY'),
			description: this.description
		}

		//Mustache Translate Render
		this.mustacheTranslateRender(params);

		this.$el.html(Mustache.render(Templates.settings.trigger, params))
		
		return this;
	},

	'updatetrigger' : function(model)
	{	
		this.model = model;
		this.render();

		this.$el.find('.inner-loading').removeClass('inner-loading');
		this.$el.find('.loading').removeClass('loading');
		this.$el.find('textarea').attr('disable', false);

	},

	'save' : function()
	{	
		this.model.setaction('REPLY', {message: this.$el.find('textarea').val()});

		//Patch if it's an edit
		this.model.save({
			event: this.model.get('event'),
			//condition: this.model.get('condition') || null,
			actions: this.model.get("actions")
			//streams: this.
		}, {patch: this.model.id? true: false, success: function(){console.log("Success")}})
	},

	'reset' : function()
	{
		this.$el.find('textarea').val("");
	},

	'translateString' : function(translatedata)
	{	
		// Translate String
		return Cloudwalkers.Session.polyglot.t(translatedata);
	},

	'mustacheTranslateRender' : function(translatelocation)
	{
		// Translate array
		this.original  = [
			"save_changes",
			"reset"
		];

		this.translated = [];

		for(k in this.original)
		{
			this.translated[k] = this.translateString(this.original[k]);
			translatelocation["translate_" + this.original[k]] = this.translated[k];
		}
	}
});

	