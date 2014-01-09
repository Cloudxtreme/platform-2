Cloudwalkers.Views.Notification = Backbone.View.extend({
	
	'tagName' : 'li',
	'template': 'message',
	
	'initialize' : function (options)
	{
		// Add options to view
		if (options) $.extend(this, options);
		
		if(this.active) this.className = "active";
		
		
		this.model.on ('change', this.render.bind(this));
	},

	'render' : function ()
	{
		// Build parameters
		var params = {from: this.model.get("from"), body: this.model.get("body"), attachments: {}};
		
		if (this.model.get("date")) 		params.fulldate = moment(this.model.get("date")).format("DD MMM YYYY HH:mm");
		if (this.model.get("attachments"))	$.each(this.model.get("attachments"), function(n, object){ params.attachments[object.type] = object });
		
		
		this.$el.html (Mustache.render (Templates[this.template], params));
		
		return this;
	}
});