Cloudwalkers.Views.Calendar = Cloudwalkers.Views.Pageview.extend({

	'title' : 'Calendar',
	'className' : "container-fluid calendar",
	'viewtype' : 'month',
	'views' : [],
	
	'parameters' : {records: 5},
	'events' : {
		'remove': 'destroy',
		'change select' : 'toggleView',
		'click #subtract' : 'prev',
		'click #add' : 'next',
		'click #now' : 'now',
	},
	
	'initialize' : function ()
	{
		// Select streams
		this.posted = Cloudwalkers.Session.getChannel("profiles");
		this.scheduled = Cloudwalkers.Session.getStream("scheduled");
		

		// to-do: this.drafts = Cloudwalkers.Session.getStream("draft");

		// Emergency break
		if (!this.posted) return Cloudwalkers.Session.home();

		// Translation for Title
		this.translateTitle("calendar");
		
		// Listen for changes
		//this.listenTo(this.model, 'outdated', this.model.fetch);
		this.listenTo(this.posted, 'sync', this.render);
		//this.listenTo(this.scheduled, 'sync', this.render);
		//this.listenTo(this.model.messages, 'seed', this.fill);
		//this.listenTo(this.model.messages, 'request', this.showloading);
		
		// to-do: this.listenTo(this.drafts, 'sync', this.render);
		// to-do: this.listenTo(this.drafts.messages, 'seed', this.filldrafts);
		// to-do: this.listenTo(this.drafts.messages, 'request', this.showloading);
		
		//this.model.messages.on("all", function(call){ console.log(call); })

		this.totals = [];

	},
	
	'render' : function()
	{

		var data = { 'monthActive': true };
		
		//Mustache Translate Render
		this.mustacheTranslateRender(data);

		this.$el.html (Mustache.render (Templates.calendar, data));
		this.$container = this.$el.find("#widgetcontainer").eq(0);
		
		// Add filter widget
		var filter = new Cloudwalkers.Views.Widgets.CalendarFilters ({model: this.posted, calview: this});
		this.appendWidget(filter, 3);
		
		
		// Statistics
		/*var view = new Cloudwalkers.Views.Widgets.CalSummary ({calview: this});
		
		this.views.push(view);
		this.appendWidget(view, 9);
		*/
		// Chosen
		this.$el.find("select").chosen({width: "200px", disable_search_threshold: 10, inherit_select_classes: true});
		
		// Init FullCalendar
		setTimeout( this.initCalendar.bind(this), 1000);

		// Reset Loader counter
		this.loaderswitch = [];
		return this;
	},
	
	'populate' : function (from, to, timezone, callback)
	{
		console.log("populate")
		this.loader('on','');
		// Limit to month
		if(from.date() > 1) 
			from = from.startOf('month').add(1, 'month');
		else
			from = from.startOf('month');

		to = (to.endOf('month').subtract(1, 'month')).endOf('month');

		console.log('from', from.format("DD MMM YYYY"), 'to', to.format("DD MMM YYYY"))
		// Display
		this.datedisplay(from, to);
		
		// Touch Channel
		this.listenTo(this.posted.messages, 'sync', this.fill.bind(this, callback));

		m_item = from.date()-1;

		while(m_item < to.date()){
			var metafrom = moment(from).add(m_item, 'days');
			var metato = metafrom;
			metafrom = moment(metafrom).hours('0').minutes('0');
			metato =  moment(metato).hours('22').minutes('59');

			$.extend(this.parameters, {since: metafrom.unix(), until: metato.unix()})

			this.posted.messages.touch(this.posted, this.parameters);

			m_item++;
		}	
	},

	'populate_scheduled' : function (from, to, timezone, callback)
	{
		this.loader('','on');
		// Limit to month
		if(from.date() > 1) 
			from = from.startOf('month').add(1, 'month');
		else
			from = from.startOf('month');

		//from = from.subtract(1, 'day')

		to = (to.endOf('month').subtract(1, 'month')).endOf('month');
		console.log('from', from.format("DD MMM YYYY"), 'to', to.format("DD MMM YYYY"))
		// Display
		this.datedisplay(from, to);
		
		// Touch Channel
		this.listenTo(this.scheduled.messages, 'sync', this.fill.bind(this, callback));

		// Get messages for each day
		s_item = moment().subtract(1,'days').date();
		console.log("here",s_item)
		while(s_item <= to.date()){
			var metafrom = moment(from).add(s_item, 'days');
			var metato = metafrom;
			metafrom = moment(metafrom).hours('0').minutes('0');
			metato =  moment(metato).hours('23').minutes('59');

			$.extend(this.parameters, {since: metafrom.unix(), until: metato.unix()})

			this.scheduled.messages.touch(this.scheduled, this.parameters);

			s_item++;
		}
	},
	
	'datedisplay' : function (from, to)
	{
		var now = moment();
		
		// The now button
		if(from.isAfter(now) || to.isBefore(now))	this.$el.find("#now").removeClass("hidden");
		else										this.$el.find("#now").addClass("hidden");
		
		// View type
		var viewtype = this.viewtype == "agendaWeek"? "week": "month";
		
		// Current
		var diff = from.diff(now, viewtype + "s");
		var current = !diff? "this ": (diff > -2 && diff < 0? "last ": ( diff < 2 && diff > 0? "next " : ""));
		
		// Time span, ie: 16 - 22 Mar 2014
		var startformat = (from.date() > 24)? (from.month() == 11? "DD MMM YYYY":"DD MMM"): "DD";
		var span = from.format(startformat) + " - " + to.format("DD MMM YYYY");
		
		// The title
		this.$el.find("h3.stats-header-timeview").html("<strong>" + current + viewtype + ": </strong>" + span);
	},
	
	'fill' : function (callback, collection)
	{
		console.log("fill", collection.models.length);
		
		if(!collection.models[0])
			return;

		var nodes = [];
		//console.log("collection",collection)
		if(!collection)	return callback(nodes);

		/*for (n in collection.models)
		{
			//console.log(collection.models[n].filterCalReadable().calNode)
			//nodes.push(collection.models[n].filterCalReadable().calNode);
			this.renderCalendarEvent(collection.models[n].filterCalReadable().calNode)
		}*/
		
		for (n in collection.models)
		{
			nodes.push(collection.models[n].filterCalReadable().calNode);
			this.totals.push(collection.models[n].filterCalReadable().calNode);
		}
		//console.log(collection.models[0].filterCalReadable().calNode.start.hours('23').minutes('59'))
		// Add more
		if((collection.models.length > 0) && (collection.models[0].filterCalReadable().calNode.networkdescription != "Scheduled messages")){
			console.log("add see more");
			nodes.push({
				className: "calendar-more",
				icon: "plus",
				id: 0000,
				allDay: false,
				title: "see more",
				start: moment(collection.models[0].filterCalReadable().calNode.start).hours('23').minutes('59'),
			});
		}

		if(nodes.length > 0)
			this.renderCalendarEvent(nodes)

		if(this.scheduled)
			this.scheduled.messages.destroy();
		if(this.posted)
			this.posted.messages.destroy();

		//console.log(this.totals.length).filterCalReadable().calNode
		
	},

	'renderCalendarEvent' : function(eventData){
		console.log("renderCalendarEvent", eventData)
		$('#calendar').fullCalendar();
		/*if((eventData.length > 0) && (eventData[0].networkdescription != "Scheduled messages")){
			var newEvent = {	
				id: 000000,
				start: eventData[eventData.length-1].start.hour(23).minute(59),
				title: "load more",
				className: "nada",
				networkdescription: "nada",
				intro: "nada", 
				icon: "nada",
				allDay: false
			}
			$('#calendar').fullCalendar( 'renderEvent', newEvent );
		}
*/
		for (eventNr in eventData)
		{
			var newEvent = {
				id: eventData[eventNr].id,
				start: eventData[eventNr].start,
				title: eventData[eventNr].title,
				className: eventData[eventNr].className,
				networkdescription: eventData[eventNr].networkdescription,
				intro: eventData[eventNr].intro, 
				icon: eventData[eventNr].icon,
				allDay: false
			}
			$('#calendar').fullCalendar( 'renderEvent', newEvent );
		}
		this.loader('off','off');
	},
	
	'updatenode' : function (model, date)
	{
		$('#calendar').fullCalendar( 'updateEvent', model.filterCalReadable().calNode)
		$('#calendar').fullCalendar( 'updateEvent', scheduled.filterCalReadable().calNode)
	},
	
	'filldrafts' : function (list)
	{		
		
		$('#drafts-list').html("");
		
		for (n in list)
		{
			this.addDraft("Draft message ("+ list[n].id +")");
		}
	},
	
	'toggleView' : function (e)
	{	
		// Store view span
		this.viewtype = $(e.currentTarget).val();
		
		// Catch list view
		if(this.viewtype == "list") this.initList();
		
		else $('#calendar').removeClass("hidden");
		
		setTimeout( this.initCalendar.bind(this), 1000);

		// Toggle Calendar
		$('#calendar').fullCalendar ('changeView', this.viewtype);
	},
	
	'prev' : function () {
		$('#calendar').fullCalendar('prev');
		if(this.scheduled)
			this.scheduled.messages.destroy();
		if(this.posted)
			this.posted.messages.destroy();

	},
	
	'next' : function () {
		$('#calendar').fullCalendar('next');
		if(this.scheduled)
			this.scheduled.messages.destroy();
		if(this.posted)
			this.posted.messages.destroy();
	},
	
	'now' : function () {
		$('#calendar').fullCalendar('today');
	},
	
	/**
	 *	Fullcalendar plugin
	 *	http://arshaw.com/fullcalendar/docs2/
	**/
	'initCalendar' : function () {
		console.log("initialize calendar")
		$('#calendar').fullCalendar({ //re-initialize the calendar
			header: false,
			slotMinutes: 30,
			editable: false,
			droppable: false, // this allows things to be dropped onto the calendar !!!
			allDayDefault: false,
			allDaySlot: false,
			firstDay: 1,
			axisFormat: 'H:mm',
			defaultTimedEventDuration: '00:30:00',
			slotEventOverlap: false,

			eventSources: [
				this.populate.bind(this),
				//this.populate_scheduled.bind(this),
		    ],
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

			},
			// click on view more
			eventClick: function(calEvent, jsEvent, view) {
				if(calEvent.className[0] == "calendar-more"){
					var toDate = new Date(calEvent.start);

					$('select').val("agendaDay");
        			$('select').trigger("chosen:updated");
					$('#calendar').fullCalendar( 'changeView', 'agendaDay' );
					$('#calendar').fullCalendar( 'gotoDate', toDate );
				}
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
	},

	'loader' : function(a,b){
		
		if(a){ this.loaderswitch.a = a; }
		if(b){ this.loaderswitch.b = b; }

		if(a == "on"){
			this.$el.find('#calcontainer').css('display','none');
			this.$el.find('.container-loading').css('display','block');
			this.$el.find('.stats-summary-counter').html('--');
		} else if((this.loaderswitch.a == "off") && (this.loaderswitch.b == "off")) {
			this.$el.find('.container-loading').css('display','none');
			this.$el.find('#calcontainer').css('display','block');
		}
	},

	'translateTitle' : function(translatedata)
	{	
		// Translate Title
		this.title = Cloudwalkers.Session.polyglot.t(translatedata);
	},

	'translateString' : function(translatedata)
	{	
		// Translate String
		return Cloudwalkers.Session.polyglot.t(translatedata);
	},

	'mustacheTranslateRender' : function(translatelocation)
	{
		// Translate array
		this.original  = [
			"day",
			"week",
			"month",
			"list_view",
			"now"
		];

		this.translated = [];

		for(k in this.original)
		{
			this.translated[k] = this.translateString(this.original[k]);
			translatelocation["translate_" + this.original[k]] = this.translated[k];
		}
	}

});
