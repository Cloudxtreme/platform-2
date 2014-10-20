/* 
 *	Base entry for small or sub entries, inside other entries.
 *	eg: InboxMessage has a sublist of notes & notifications (also entries)
 */

define(
	['Views/Entries/BaseEntry', 'mustache', 'Collections/Actions'],
	function (BaseEntry, Mustache, Actions)
	{
		var SmallEntry = BaseEntry.extend({
			
			tagName : 'li',
			template: 'message',
	
			events : {
				'mouseover' : 'toggleactions',
				'mouseout' : 'toggleactions',
				'click *[data-notification-action]' : 'action',
				'click .viewcommentcontact': 'togglecommentcontact',
				'click .note-header' : 'togglenote'
			},

			render : function ()
			{
				// Parameters
				$.extend(this.parameters, this.model.attributes);
				
				if(this.model.get("objectType")) this.parameters.actions = this.model.filterActions();
				
				// Visualize
				this.$el.html (Mustache.render (Templates[this.template], this.parameters));
				
				return this;
			},
			
			action : function (e)
			{
				// Action token
				var token = $(e.currentTarget).data ('notification-action');
				
				this.model.trigger("action", token);
			},
			
			toggleactions : function(e)
			{
				var out = e.originalEvent.type == "mouseout";
				
				this.$el.find(".inline-actions")[out? "addClass": "removeClass"]("hidden");
				this.$el.find(".comment-info")[out? "removeClass": "addClass"]("hidden");	
			}
			
		});

		return SmallEntry;
});