define(
	['Views/Widgets/Widget', 'Session', 'Views/User'],
	function (Widget, Session, UserView)
	{
		var ScheduledFilters = Widget.extend ({
	
			id : "scheduledfilters",
			filters : {
				users : {string:"", list:[]}
			},
			events : {
				'remove' : 'destroy',
				'click *[data-streams]' : 'filter',
				'click .toggleall.active' : 'toggleall'
			},
			
			initialize : function (options)
		    {
				if(options) $.extend(this, options);

				this.model.childtype = "message";
				this.streams = Session.getChannel ('internal').get ("additional").outgoing;

		    },

			render : function ()
			{
				var params = {streams: []};
				
				// Company streams
				for(n in this.streams)
					params.streams.push({id: this.streams[n].id, icon: this.streams[n].network.icon, name: this.streams[n].name, network: this.streams[n].network}); 
				
				//Mustache Translate Render
				this.mustacheTranslateRender(params);

				// View
				this.$el.html (Mustache.render (Templates.scheduledfilters, params));

				if (this.filters.streams.length)
				{	
					this.$el.find("[data-streams], [data-networks], .toggleall").toggleClass("inactive active");
					
					this.$el.find(this.filters.streams.map(function(id){ return '[data-networks~="'+ id +'"],[data-streams="'+ id +'"]'; }).join(",")).toggleClass("inactive active");
				}
				
				return this;
			},
			
			toggleall : function ()
			{
				
				this.filter(true);
				this.togglefilters(true);
			},
			
			togglefilters : function(all)
			{
				// Toggle streams
				this.$el.find('li').addClass(all? 'active': 'inactive').removeClass(all? 'inactive': 'active');
				
				// Toggle select button
				this.$el.find('.toggleall').addClass(all? 'inactive': 'active').removeClass(all? 'active': 'inactive');
			},
			
			filter : function (e, all)
			{
				
				// Check button state
				if(!all)
					all = this.button && this.button.data("streams") == $(e.currentTarget).data("streams");

				this.togglefilters(all);
				
				if(!all)
					this.button = $(e.currentTarget).addClass('active').removeClass('inactive');
				
				var streams = all? null: this.button.data("streams");
				
				if(all) this.button = false;

				this.list.render(streams? {records: 200, target: streams, sort: 'asc'} : {records: 200, sort: 'asc'});

				// Fetch filtered messages
				//this.model.messages.touch(this.model, streams? {records: 20, target: streams, sort: 'asc'} : {records: 40, sort: 'asc'});
				
				return this;
			},
			
			fill : function (models)
			{	
				// Clean load
				$.each(this.entries, function(n, entry){ entry.remove()});
				this.entries = [];
				
				// Add models to view
				for (n in models)
				{
					var view = new UserView ({model: models[n], template: 'smalluser', type: 'listitem'});
					
					this.entries.push (view);
					this.listenTo(view, "select", this.select);
					
					this.$container.append(view.render().el);
				}
				
				// End loading
				this.$el.find(".inner-loading").removeClass("inner-loading")
			},
			
			select : function(view)
			{	
				// Render list
				this.list.render({users: view.model.id, records: 20});
				/*
				this.list.model.messages.touch(this.list.model, {records: 20, users: view.model});*/
			},
			
			addScroll : function () {

				this.$el.find('.scroller').slimScroll({
					size: '6px',
					color: '#a1b2bd',
					height: $("#inner-content").height() -165 + "px",
					alwaysVisible: false,
					railVisible: false
				});
			},

			translateString : function(translatedata)
			{	
				// Translate String
				return Session.polyglot.t(translatedata);
			},
			
			mustacheTranslateRender : function(translatelocation)
			{
				// Translate array
				this.original  = [
					"company_accounts",
					"select_all"
				];

				this.translated = [];

				for(k in this.original)
				{
					this.translated[k] = this.translateString(this.original[k]);
					translatelocation["translate_" + this.original[k]] = this.translated[k];
				}
			}
		});

		return ScheduledFilters;
});