
define(
	['Views/Panels/EntryLists/BaseList', 'mustache', 'Views/Entries/BaseEntry'],
	function (BaseList, Mustache, EntryView)
	{
		var ScheduledList = BaseList.extend({

			id : 'scheduledlist',
			title: "Scheduled messages",
			parameters : {records: 200, sort: 'asc'},

			render : function (params)
			{	
				this.loadmylisteners();

				// Get template
				this.$el.html (Mustache.render (Templates.scheduledlist));

				this.$container = this.$el.find ('.entry-container');
				this.$loadercontainer = this.$el.find ('.panel-body');
				this.$el.find(".load-more").hide();
				
				if(params){	
					this.parameters = params;
					Cloudwalkers.Session.viewsettings('scheduled', {streams: params.target? [params.target]: []});
				}
				else if(this.filters.streams.length)
					this.parameters.target = this.filters.streams.join(",");

				// Load category message
				this.model.messages.touch(this.model, this.parameters);
					
				this.addScroll();

				var scroll = this.$el.find('.slimScrollDiv').eq(0);
				var height = scroll.css('height');
			
				// Update slimscroll plugin default styling
				scroll.css('max-height', height);
				scroll.css('height', 'inherit')

				return this;
			},

			fill : function (list)
			{		
				// Clean load or add
				if(this.incremental) this.incremental = false;
				else
				{
					$.each(this.entries, function(n, entry){ entry.remove()});
					this.entries = [];
				}
				
				// Store amount
				this.count = list.length;
				
				// Add messages to view
				for (var n in list)
				{
					var view = new EntryView ({tagName: "tr", model: list[n], type: "full", template: "scheduledentry"});
					this.entries.push (view);
					
					this.$container.append(view.render().el);
				}
				
				// Hide loading
				this.hideloading();
			},

			refreshlist : function()
			{
				if($('.listrefresh').eq(0).hasClass('loading'))	return;

				this.loadmylisteners();
				this.model.messages.touch(this.model, this.parameters);
			},

			refreshloaded : function()
			{
				$('.listrefresh').eq(0).removeClass('loading');
			},

			refreshloading : function()
			{
				$('.listrefresh').eq(0).addClass('loading');
			}
		});

		return ScheduledList;
});

