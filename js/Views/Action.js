Cloudwalkers.Views.Action = Backbone.View.extend({

	'template' : 'action',
	'position' : 'left',

	'initialize' : function(options)
	{
		$.extend(this, options);

		if(_.isArray(this.action)){
			this.template = 'compoundaction';
			this.rendercompound();
		}
		
		this.positionaction();
	},

	'render' : function()
	{			
		this.$el.html(Mustache.render(Templates[this.template], this.action));

		return this;
	},

	'rendercompound' : function()
	{	
		// Treat this as a normal action
		if(this.action.length < 2){
			
			this.action = this.action[0];
			return;
		}

		var actionview = this.action[0].hasOwnProperty('value')? this.action[0]: this.action[1];
		var actionadd = this.action[0].hasOwnProperty('value')? this.action[1]: this.action[0];

		actionview.tokenview = actionview.token;
		actionview.tokenadd = actionadd.token;
		
		this.action = actionview;
	},

	'positionaction' : function()
	{
		if(_.isArray(this.action) && this.action[0].type == 'note')		this.position = 'right';
		else if(this.action.type == 'note')								this.position = 'right';
	},

	'increment' : function()
	{	//Testing, this is just wrong!!
		var value = this.$el.find('.actionvalue span').html();
		if (value)
			this.$el.find('.actionvalue span').html(Number(value)+1);
		else
			this.$el.find('.actionvalue span').html(Number(1));
	}

});