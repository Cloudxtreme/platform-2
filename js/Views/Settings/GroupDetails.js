Cloudwalkers.Views.Settings.GroupDetails = Backbone.View.extend({

	'tagName' : 'div',

	'events' : 
	{
		'click [data-delete-group-user-id]' : 'deleteGroup'
	},
	
	'initialize' : function ()
	{
		
		this.collection = new Cloudwalkers.Collections.UserGroups();
		
		// listen to model
		
		this.listenTo(this.collection, 'seed', this.fillGroups);
		this.listenTo(this.collection, 'request', this.showloading);
		this.listenTo(this.collection, 'sync', this.hideloading);
		
		this.loadListeners(this.collection, ['request', 'sync'], true);
	},

	'render' : function ()
	{

		
		var data = {};
		
		data.group_details = this.model.attributes;

		console.log(data.group_details);
		
		// Apply role permissions to template data
		Cloudwalkers.Session.censuretemplate(data);
		
		this.$el.html (Mustache.render (Templates.settings.manageusergroups_details, data));

		return this;
	},
	'translateString' : function(translatedata)
	{	
		// Translate String
		return Cloudwalkers.Session.polyglot.t(translatedata);
	}
	
});