define(
	['backbone'],
	function (Backbone)
	{
		var CannedList = Backbone.View.extend({

			'events' : {
				'click i[data-delete-canned-id]' : 'deletecanned'
			},

			'initialize' : function()
			{
				this.cannedresponses = Session.getCannedResponses();
				this.listenTo(this.cannedresponses, 'sync', this.render);
			},

			'render' : function ()
			{	
				var params = {canned: this.cannedresponses.models};

				this.$el.html(Mustache.render(Templates.settings.cannedlist, params));
				return this;
			},

			'deletecanned' : function(e)
			{
				var cannedid = $(e.target).data ('delete-canned-id'); 
				
				//remove from the local list
				var cannedresponse = this.cannedresponses.removecanned(cannedid);

				//Remove from server
				if(cannedresponse.length){
					this.listenTo(cannedresponse[0], 'destroyed', function(){this.destroyli(e)}.bind(this));
					cannedresponse[0].deletecanned();
				}
			},

			'destroyli' : function(e)
			{
				$(e.target).closest('li').remove();
			}

		});

		return CannedList;
});