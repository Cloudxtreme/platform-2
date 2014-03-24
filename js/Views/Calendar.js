Cloudwalkers.Views.Calendar = Cloudwalkers.Views.Pageview.extend({

	'title' : 'Calendar',
	'className' : "container-fluid calendar",
	'events' : {
		'remove': 'destroy',
		'change select' : 'toggleView',
		'click #subtract' : 'prev',
		'click #add' : 'next'
	},
	
	'initialize' : function ()
	{
		// Select streams
		this.model = Cloudwalkers.Session.getChannel("profiles"); // Cloudwalkers.Session.getStream("scheduled");
		// to-do: this.drafts = Cloudwalkers.Session.getStream("draft");

		// Emergency break
		if (!this.model) return Cloudwalkers.Session.home();
		
		// Listen for changes
		//this.listenTo(this.model, 'outdated', this.model.fetch);
		this.listenTo(this.model, 'sync', this.render);
		//this.listenTo(this.model.messages, 'seed', this.fill);
		//this.listenTo(this.model.messages, 'request', this.showloading);
		
		// to-do: this.listenTo(this.drafts, 'sync', this.render);
		// to-do: this.listenTo(this.drafts.messages, 'seed', this.filldrafts);
		// to-do: this.listenTo(this.drafts.messages, 'request', this.showloading);
	},
	
	'render' : function()
	{
		this.$el.html (Mustache.render (Templates.calendar, {'monthActive': true}));
		this.$container = this.$el.find("#widgetcontainer").eq(0);
		
		// Chosen
		this.$el.find("select").chosen({width: "200px", disable_search_threshold: 10, inherit_select_classes: true});
		
		// Init FullCalendar
		setTimeout( this.initCalendar.bind(this), 10);

		// Add filter widget
		/*var filter = new Cloudwalkers.Views.Widgets.ScheduledFilters ({model: this.model});
		this.appendWidget(filter, 4);
		
		// Add list widget
		var list = new Cloudwalkers.Views.Widgets.ScheduledList ({model: this.model});
		this.appendWidget(list, 8);
		
		filter.list = list;*/
		
		return this;
	},
	
	'populate' : function (from, to, timezone, callback)
	{
		// Touch Channel
		//this.listenToOnce(this.model.messages, 'seed', this.fill.bind(this, callback));
		
		this.listenToOnce(this.model.messages, 'ready', this.fill.bind(this, callback));
		//this.listenTo(this.model.messages, 'cached', this.fill.bind(this, callback));
		//this.listenTo(this.model.messages, 'cached:partial', this.fill.bind(this, callback));
	
		this.listenToOnce(this.model.messages, 'ready', function(){ console.log("triggered Ready"); });

		this.model.messages.touch(this.model, {records: 999, since: from.unix(), until: to.unix()});
		
	},
	
	'fill' : function (callback, collection)
	{
		
		var nodes = [];
		
		for (n in collection.models)
		{
			nodes.push(collection.models[n].filterCalReadable().calNode);
		}
	
		callback(nodes);
	},
	
	'updatenode' : function (model, date)
	{
		$('#calendar').fullCalendar( 'updateEvent', model.filterCalReadable().calNode)
	},
	
	'filldrafts' : function (list)
	{		
		
		$('#drafts-list').html("");
		
		for (n in list)
		{
			this.addDraft("Draft message ("+ list[n].id +")"); //list[n].get("title")? list[n].get("title"): list[n].get("body").plaintext);
		}

		
		// Hide loading
		//this.hideloading();
	},
	
	'toggleView' : function (e)
	{	
		// Toggle Calendar
		$('#calendar').fullCalendar ('changeView', $(e.currentTarget).val());
	},
	
	'prev' : function () { $('#calendar').fullCalendar('prev'); },
	
	'next' : function () { $('#calendar').fullCalendar('next'); },
	
	/**
	 *	Fullcalendar plugin
	 *	http://arshaw.com/fullcalendar/docs2/
	**/
	
	'initCalendar' : function () {
	
		
		
		$('#calendar').fullCalendar({ //re-initialize the calendar
			header: false,
			slotMinutes: 30,
			editable: false,
			droppable: false, // this allows things to be dropped onto the calendar !!!
			allDayDefault: false,
			allDaySlot: false,
			axisFormat: 'H:mm',
			defaultTimedEventDuration: '00:30:00',
			slotEventOverlap: false,
			events: this.populate.bind(this),
			 
			eventRender: function(event, element)
			{	

				// Prevent empty renders (rendered is hack)
				if(!event.icon) return false;
				
				// Append network icon
				$(element).find(".fc-event-time").html("<i class='icon-" + event.icon + "'></i>");
				
				// Append media icon
				if (event.media)
					$(element).find(".fc-event-inner").prepend("<i class='fc-event-media pull-right icon-" + event.media + "'></i>");
				
				// Tooltip
				$(element).data("title", event.intro).tooltip({html: true, delay: 500, placement: 'top'});
				
				// Hack! Prevent endless re-renders
				event.rendered = true;

			}
			
			
			/*drop: function (date, allDay) { // this function is called when something is dropped
			
				// retrieve the dropped element's stored Event Object
				var originalEventObject = $(this).data('eventObject');
				// we need to copy it, so that multiple events don't have a reference to the same object
				var copiedEventObject = $.extend({}, originalEventObject);
				
				// assign it the date that was reported
				copiedEventObject.start = date;
				copiedEventObject.allDay = allDay;
				copiedEventObject.className = $(this).attr("data-class");
				
				// render the event on the calendar
				// the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
				$('#calendar').fullCalendar('renderEvent', copiedEventObject, true);
				
				$(this).remove();
			},*/
		});
		
		// Load Collections
		// to-do: this.drafts.messages.touch(this.drafts);
		
	
	},
	
	'addDraft' : function (title)
	{
		
		title = title.length == 0 ? "Untitled Event" : title;
		var html = $('<div class="external-event label">' + title + '</div>');
		$('#drafts-list').append(html);
		this.initDrag(html);
	},
	
	'initDrag' : function (el)
	{
		// create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
		// it doesn't need to have a start or end
		var eventObject = {
			title: $.trim(el.text()) // use the element's text as the event title
		};
		// store the Event Object in the DOM element so we can get to it later
		el.data('eventObject', eventObject);
		// make the event draggable using jQuery UI
		el.draggable({
			zIndex: 999,
			revert: true, // will cause the event to go back to its
			revertDuration: 0 //  original position after the drag
		});
	}
	
});

/*[{
	title: 'Twitter post',                        
	start: new Date(y, m, 1),
	className: 'facebook-color',
	allDay: false,
}, {
	title: 'Facebook message',
	start: new Date(y, m, d - 5),
	className: 'facebook-color',
	allDay: false,
}, {
	title: 'Linkedin message',
	start: new Date(y, m, d - 3, 16, 0),
	className: 'facebook-color',
	allDay: false,
}, {
	title: 'Tumblr post',
	start: new Date(y, m, d + 4, 16, 0),
	className: 'facebook-color',
	allDay: false,
}, {
	title: 'Google+ message',
	start: new Date(y, m, d, 10, 30),
	className: 'facebook-color',
	allDay: false,
}, {
	title: 'Youtube movie',
	start: new Date(y, m, d, 12, 0),
	className: 'facebook-color',
	allDay: false,
}, {
	title: 'Blog Post',
	start: new Date(y, m, d + 1, 19, 0),
	className: 'facebook-color',
	allDay: false,
}, {
	title: 'Co-worker message',
	start: new Date(y, m, 28),
	className: 'facebook-color',
	url: 'http://google.com/',
	allDay: false,
}
]*/