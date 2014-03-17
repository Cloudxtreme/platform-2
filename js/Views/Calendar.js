Cloudwalkers.Views.Calendar = Cloudwalkers.Views.Pageview.extend({

	'title' : 'Calendar',
	'className' : "container-fluid calendar",
	
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
		this.$el.html (Mustache.render (Templates.calendar, { 'title' : this.title }));
		this.$container = this.$el.find("#widgetcontainer").eq(0);
		
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
	
	'populate' : function (from, to, callback)
	{
		
		// Touch Channel
		this.listenToOnce(this.model.messages, 'seed', this.fill.bind(this, callback));
		this.model.messages.touch(this.model, {records: 999, since: Math.round(from.getTime() /1000), until: Math.round(to.getTime() /1000)});
		
	},
	
	'fill' : function (callback, list)
	{		
		var nodes = [];
		
		for (n in list)
		{
			this.listenToOnce(list[n].filterCalReadable(), "change:date", this.updatenode);
			nodes.push(list[n].calNode);
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
	
	'initCalendar' : function () {
	
		// Fullcalendar plugin
		
		
		var h = {};
		
		// Visualize
		if ($('#calendar').parents(".portlet").width() <= 720) {
			$('#calendar').addClass("mobile");
			h = {
				left: 'title, prev, next',
				center: '',
				right: 'today,month,agendaWeek' /*'today,month,agendaWeek,agendaDay'*/
			};
		} else {
			$('#calendar').removeClass("mobile");
			h = {
				left: 'title',
				center: '',
				right: 'prev,next,today,month,agendaWeek' /*'prev,next,today,month,agendaWeek,agendaDay'*/
			};
		}
		
		/*$('#drafts-list div.external-event').each(function () {
			initDrag($(this))
		});*/
		
		/* $('#event_add').unbind('click').click(function () {
		var title = $('#event_title').val();
		addEvent(title);
		});*/
		
		$('#calendar').fullCalendar('destroy'); // destroy the calendar
		$('#calendar').fullCalendar({ //re-initialize the calendar
			header: h,
			slotMinutes: 30,
			editable: false,
			droppable: false, // this allows things to be dropped onto the calendar !!!
			allDayDefault: false,
			allDaySlot: false,
			axisFormat: 'H:mm',
			defaultEventMinutes: 30,
			slotEventOverlap: false,
			events: this.populate.bind(this),
			 
			eventRender: function(event, element) {
				
				// Prevent empty renders
				if(!event.icon) return false;
				
				// Append network icon
				$(element).find(".fc-event-time").html("<i class='icon-" + event.icon + "'></i>");
				
				// Append media icon
				if (event.media)
					$(element).find(".fc-event-inner").prepend("<i class='fc-event-media pull-right icon-" + event.media + "'></i>");
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