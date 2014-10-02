define(
	['backbone', 'Views/Root'],
	function (Backbone, RootView)
	{
		var GroupItem = Backbone.View.extend({

			'tagName' : 'tr',

			'events' : 
			{
				'click [data-delete-group-id]' : 'deleteGroup',
				'click [data-delete-group-user-id]' : 'deleteGroupUser'
			},
			
			'initialize' : function (options)
			{
				// Parameters	
				if(options) $.extend(this, options);
				
				// HACK!
				this.parameters = {};
				
				this.listenTo(this.model, 'change', this.render);

				//Mustache Translate Render
				translations = {};
				this.mustacheTranslateRender(translations);
			},

			'render' : function ()
			{

				var self = this;
				var data = {};
				
				data.group = this.model.attributes;
				
				data.type = this.type;
				data.id = data.group.id;

				if(data.type == "group-user"){
					data.name = data.group.displayname;
				} else {
					data.name = data.group.name;
				}
				
				// Apply role permissions to template data
				Session.censuretemplate(data);
				
				self.$el.html (Mustache.render (Templates.settings.group, data));

				return this;
			},

			'deleteGroup' : function (e)
			{
				var self = this;
				var tr = $(e.currentTarget).parents("tr");
				
				RootView.confirm (translations.translate_you_are_about_to_remove_group + this.model.get('name') + translations.translate_sure, function(){
					
					tr.remove();
					
					var url = 'groups/' + self.model.get('id');
					Cloudwalkers.Net.remove (url, {}, function(){
					
						RootView.growl(translations.translate_manage_users, translations.translate_deleted);
					});
				});
			},
			'deleteGroupUser' : function (e)
			{
				var self = this;
				var tr = $(e.currentTarget).parents("tr");
				
				RootView.confirm (translations.translate_you_are_about_to_remove_user + this.model.get('name') + translations.translate_from_this_group + translations.translate_sure, function(){
					
					tr.remove();
					
					var url = 'groups/' + self.model.collection.parentmodel.groupid + '/users/' + self.model.get('id');
					Cloudwalkers.Net.remove (url, {}, function(){
					
						RootView.growl(translations.translate_manage_users, translations.translate_deleted);
					});
				});
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
					"you_are_about_to_remove_group",
					"sure",
					"manage_user_groups",
					"deleted",
					"you_are_about_to_remove_user",
					"from_this_group"
				];

				this.translated = [];

				for(k in this.original)
				{
					this.translated[k] = this.translateString(this.original[k]);
					translatelocation["translate_" + this.original[k]] = this.translated[k];
				}
			}
			
		});
		
		return GroupItem;
});