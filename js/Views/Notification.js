Cloudwalkers.Views.Notification = Backbone.View.extend({
	
	'tagName' : 'li',
	'template': 'message',
	
	'initialize' : function (options)
	{
		// Add options to view
		if (options) $.extend(this, options);
		
		this.model.on ('change', this.render.bind(this));
	},

	'render' : function ()
	{
		// Build parameters
		var params = {from: this.model.get("from"), body: this.model.get("body"), attachments: {}};
		
		if (this.model.get("date")) 		params.fulldate = moment(this.model.get("date")).format("DD MMM YYYY HH:mm");
		if (this.model.get("attachments"))	$.each(this.model.get("attachments"), function(n, object){ params.attachments[object.type] = object });
		
		if (this.active) this.$el.addClass("active");
		
		this.$el.html (Mustache.render (Templates[this.template], params));
		
		// Mark as read
		if (this.model.get("objectType") && !this.model.get("read")) this.markasread();
		
		return this;
	},
	
	'markasread' : function()
	{
		// Send update
		//this.message.save({read: 1}, {patch: true, wait: true});
		
		// Mark stream
		Cloudwalkers.Session.getPing().outdated("streams", this.model.stream);
	}
});