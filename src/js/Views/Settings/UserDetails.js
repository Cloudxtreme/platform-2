define(
	['backbone', 'mustache'],
	function (Backbone, Mustache)
	{
		var UserDetails = Backbone.View.extend({

			events : {
				'submit form.edit-managed-user' : 'submit'
			},
		
			initialize : function (options)
			{
				// Parameters	
				if(options) $.extend(this, options);		

				this.listenTo(this.model, 'request', this.disablesave);
				this.listenTo(this.model, 'sync', this.enablesave);

				this.role = this.model.get('rolegroup')
				this.roles = Cloudwalkers.Session.getAccount().get('roles');
				
			},

			render : function ()
			{
				var roles = this.roles;
				var data = { 
					roles: [],
					user : this.model.attributes
				};
				
				// Create the roles dropdown list
				for (var i = 0; i < roles.length; i ++)
				{
					var tmp = roles[i];
					tmp.checked = this.model.get ('rolegroup') == roles[i].id;

					data.roles.push (tmp);
				}

				//Mustache Translate Render
				this.mustacheTranslateRender(data);

				this.$el.html (Mustache.render (Templates.userdetails, data));

				return this;
			},

			submit : function (e)
			{		
				var data = {rolegroup: $("#level").val()};

				this.model.parent = Cloudwalkers.Session.getAccount();

				this.model.save(data, {
					patch: true, 
					success: this.success.bind(this)
				});

			},

			success : function()
			{	
				Cloudwalkers.RootView.growl(this.translateString("manage_users"), this.translateString("the_user_clearance_is_updated"));
				this.model.trigger("change:clearance")	;
			},

			disablesave : function()
			{	
				this.$el.find('.edit-managed-user .btn').attr("disabled", true);
			},

			enablesave : function()
			{	
				this.$el.find('.edit-managed-user .btn').attr("disabled", false);
			},

			translateString : function(translatedata)
			{	
				// Translate String
				return Cloudwalkers.Polyglot.translate(translatedata);
			},

			mustacheTranslateRender : function(translatelocation)
			{
				// Translate array
				this.original  = [
					"clearance_level",
					"save"
				];

				this.translated = [];

				for (var k in this.original)
				{
					this.translated[k] = this.translateString(this.original[k]);
					translatelocation["translate_" + this.original[k]] = this.translated[k];
				}
			},
		});
		
		return UserDetails;
});