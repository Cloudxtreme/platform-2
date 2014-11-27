define(
	['backbone', 'mustache'],
	function (Backbone, Mustache)
	{
		var UserDetails = Backbone.View.extend({

			events : {
				'submit form#edit-managed-user' : 'submit'
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

				this.$el.html (Mustache.render (Templates.userdetails, data));

				return this;
			},

			submit : function (e)
			{		
				e.preventDefault();

				var data = {rolegroup: $("#rolegroup").val()};

				this.model.parent = Cloudwalkers.Session.getAccount();

				this.model.save(data, {
					patch: true, 
					success: this.success.bind(this),
					error: this.error
				});

			},

			success : function(model)
			{	
				Cloudwalkers.RootView.growl(trans("Manage users"), trans("The user clearance is updated."));
				this.model.trigger("change:clearance");

				// Has the user updated himself?
				if(model.id == Cloudwalkers.Session.getUser().id){
					setTimeout(function(){
		  				window.location.reload();
		  			},1000);
				}
			},

			'error' : function(model, response)
			{	
				var account = Cloudwalkers.Session.getAccount();
				
				if(!account.monitorlimit('admins', Cloudwalkers.Session.getUsers('Conversation manager').length, null, true))
				{
					var error = response.responseJSON? response.responseJSON.error.message: trans("Something went wrong");
					Cloudwalkers.RootView.alert(error);
				}		
			},

			disablesave : function()
			{	
				this.$el.find('#edit-managed-user .btn').attr("disabled", true);
			},

			enablesave : function()
			{	
				this.$el.find('#edit-managed-user .btn').attr("disabled", false);
			}
		});
		
		return UserDetails;
});