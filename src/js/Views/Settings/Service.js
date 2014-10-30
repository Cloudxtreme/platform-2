define(
	['backbone', 'mustache', 'Models/User', 'Views/Root', 'Views/Pages/Settings'],
	function (Backbone, Mustache, User, RootView, SettingsView)
	{
		var Service = Backbone.View.extend({

			events : {
		        'click li[data-id]' : 'toggleprofile',
		        'click .delete-detail' : 'delete',
		        'click .close-detail' : 'closedetail'
			},
			
			listnames : {
				'facebook': "Pages",
				'twitter': false,
				'linkedin': "Companies",
				'google-plus': "Pages",
				'youtube': false
			}, 

			service : null,
			
			initialize : function(options)
			{
				if (options) $.extend(this, options);
				
				// Set service
				this.service = this.model;
			},
			
			render : function ()
			{
				// Clone service data
				var data = _.clone(this.service.attributes);
				data.listname = this.listnames[data.network.token];
				data.authurl = data.authenticateUrl + '&return=' + encodeURIComponent(window.location.href);
				
				// Render view
				this.$el.html (Mustache.render (Templates.service, data));
				
				return this;
			},
			
			toggleprofile : function (e)
			{
				// Button
				var entry = $(e.currentTarget).toggleClass("active inactive");
				
				// Patch data
				var profile = new User({id: entry.data("id")});
				
				profile.parent = this.service;
				profile.typestring = "profiles";
				
				// Update profile
				profile.save({"activated": entry.hasClass("active")}, {patch: true, success: function(profile)
				{	
					//this.parseprofile(profile);
					Cloudwalkers.RootView.growl (trans("Social connections"), trans("A successful update, there."));
					
					// Check for stream changes
					profile.parent.updateStreams(profile.get('activated'), profile);

				}.bind(this)});
			},
			
			delete : function ()
			{
				Cloudwalkers.RootView.confirm(trans("You are about to delete a service all your statistics information will be lost."), function()
				{
					// View
					this.parent.$el.find("[data-service="+ this.service.id +"]").remove();
					
					// Data
					this.service.destroy({success: this.servicedeleted.bind(this)});

								
				}.bind(this));
			},

			servicedeleted : function()
			{
				this.trigger('service:deleted');
				this.closedetail();
			},
	
			
			closedetail : function()
			{
				this.parent.closedetail();
			}
		
		});

		return Service;
});