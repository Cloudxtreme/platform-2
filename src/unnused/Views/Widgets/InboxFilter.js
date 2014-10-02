define(
	['Views/Widgets/Widget'],
	function (Widget)
	{
		var InboxFilter = Widget.extend({

			// To-do: if url streamid is given, load network-related only.
			// To-do: local manipulate list-view & toggle

			'id' : 'inboxlist',
			'entries' : [],
			'check' : "hasMessages",
			'collectionstring' : "messages",
			'filters' : {
				contacts : {string:"", list:[]},
				streams : []
			},
			
			'events' : {
				'remove' : 'destroy',
				'click [data-toggle]' : 'togglefilter',
				'input .input-rounded' : 'comparesuggestions',
				'click [data-contact]' : 'filtercontacts',
				'click [data-close-contact]' : 'filtercontacts',
				'click [data-networks]' : 'filternetworks',
				'click [data-streams]' : 'filterstreams',
				'click .toggleall.active' : 'toggleall',
				'click .load-more' : 'more'
			},
			
			'initialize' : function (options)
			{
				if(options) $.extend(this, options);
			},
				
			'toggleall' : function ()
			{
				this.filternetworks(null, true);
				this.togglestreams(true);
			},
			
			'togglestreams' : function(all)
			{
				// Toggle streams
				this.$el.find('[data-networks], [data-streams]').addClass(all? 'active': 'inactive').removeClass(all? 'inactive': 'active');
				
				// Toggle select button
				this.$el.find('.toggleall').addClass(all? 'inactive': 'active').removeClass(all? 'active': 'inactive');
			},

			'render' : function ()
			{			
				
				
				return this;
			}
		});
		
		return InboxFilter;
});