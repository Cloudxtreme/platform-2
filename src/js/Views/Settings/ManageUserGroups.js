define(
	['backbone', 'Collections/Groups'],
	function (Backbone, Groups)
	{
		var ManageUserGroups = Backbone.View.extend({

			'events' : {
				'submit .create-group' : 'createGroup',
				'click .group-container [data-edit-group-id]' : 'fetchDetails',
			},

			'class' : 'section',
			'collections' : [],
			
			'initialize' : function ()
			{
				
				this.collection = new Groups();
				
				// listen to model
				
				this.listenTo(this.collection, 'seed', this.fillGroups);
				this.listenTo(this.collection, 'request', this.showloading);
				this.listenTo(this.collection, 'sync', this.hideloading);


				
				this.loadListeners(this.collection, ['request', 'sync'], true);

			},
			
			'render' : function ()
			{
				//var account = Session.getAccount();
				var data = {};

				//Mustache Translate Render
				this.mustacheTranslateRender(data);

				// Apply role permissions to template data
				Session.censuretemplate(data);
				
				this.$el.html (Mustache.render (Templates.settings.manageusergroups, data));
				
				
				// Load groups
				this.collection.touch();
			
				this.$container = this.$el.find('.toload');
				
				return this;
			},
			
			
			'fillGroups' : function (models)
			{	
				var $container = this.$el.find(".group-container").eq(-1);
				
				/* Clean and Populate */
				$container.empty();
				
				for (n in models)
				{	
					var view = new Cloudwalkers.Views.Settings.GroupItem ({'model' : models[n] , 'type' : 'group'});
					$container.append(view.render().el);			
				}
				this.$el.find(".group-container tr:first-child td:first-child").click();

			},

			'createGroup' : function ()
			{
				if($.trim($("input[name=group-name]").val()).length < 1) {
					Cloudwalkers.RootView.growl('Oops', this.translateString("something_went_wrong"));
					return this;
				}

				var data = {name: $('input[name=group-name]').val()}
				var url = 'accounts/' + Session.getAccount().get('id') + '/groups';
				
				Cloudwalkers.Net.post (url, {}, data, function(resp){
					if(resp.error){
						Cloudwalkers.RootView.growl('Oops', this.translateString("something_went_wrong"));
					} else {
						Cloudwalkers.RootView.growl(this.translateString("group_management"), this.translateString("group_created"));
						$('input[name=group-name]').val('');
						this.collection.touch(null, {all: 1});
					}
				}.bind(this));
			},

			'fetchDetails' : function(e)
			{	
				$('.group-container > *').removeClass("active");
				$(e.currentTarget).closest('tr').addClass("active");

				var groupid = $(e.currentTarget).data("edit-group-id");
				var group = new Cloudwalkers.Models.Group({id: groupid});

				group.fetch({ success: this.fillDetails.bind(this) });

			},

			'fillDetails' : function(group){

				var options = {model: group, template: 'manageusergroups_details'}
				var group_details = new Cloudwalkers.Views.Settings.GroupDetails(options);
				var details_container = this.$el.find('.group-details-container')

				details_container.empty();
				details_container.append(group_details.render().el);

			},
			
			'fail' : function ()
			{
				Cloudwalkers.RootView.growl ("Oops", "Something went sideways, please reload the page.");
			},
			'translateString' : function(translatedata)
			{	
				// Translate String
				return Session.polyglot.t(translatedata);
			},

			'mustacheTranslateRender' : function(translatelocation)
			{
				// Translate array
				this.original  = [
					"user_groups",
					"create_new_group",
					"name",
					"add"
				];

				this.translated = [];

				for(k in this.original)
				{
					this.translated[k] = this.translateString(this.original[k]);
					translatelocation["translate_" + this.original[k]] = this.translated[k];
				}
			}

		});
		
		return ManageUserGroups;
});