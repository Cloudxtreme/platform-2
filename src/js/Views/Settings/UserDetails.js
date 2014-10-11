define(
	['backbone', 'Views/Root'],
	function (Backbone, RootView)
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
				
				if(!this.roles || _.isUndefined(this.role))
					return RootView.resync('#'+Backbone.history.fragment);
			},

			render : function ()
			{
				var self = this;
				var data = {};
				//left dropdown & default checked
				//var level = Number(this.model.get("level"));
				//var levels = [ { 'level' : 0, 'name' : 'Co-Workers' }, { 'level' : 10, 'name' : 'Administrators' }];

				var role = this.role;
				var roles = this.roles;
				
				//levels[(level)? 1:0].checked = true;

				data.user = this.model.attributes;
				data.title = data.user.name;
				
				// add levels to dropdown
				//data.levels = [];
				data.roles = [];
				for (var i = 0; i < roles.length; i ++)
				{
					var tmp = roles[i];
					tmp.checked = this.model.get ('rolegroup') == roles[i].id;

					data.roles.push (tmp);
				}

				//Mustache Translate Render
				this.mustacheTranslateRender(data);

				self.$el.html (Mustache.render (Templates.settings.userdetails, data));

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
				RootView.growl(this.translateString("manage_users"), this.translateString("the_user_clearance_is_updated"));
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
				return Cloudwalkers.Session.translate(translatedata);
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