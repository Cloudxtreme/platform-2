Cloudwalkers.Views.Calendar = Cloudwalkers.Views.Pageview.extend({

	'title' : 'Calendar',
	'className' : "container-fluid calendar",
	'viewtype' : 'month',
	'views' : [],
	
	'parameters' : {records: 300},
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
		this.model = Cloudwalkers.Session.getChannel("profiles");
		this.scheduled = Cloudwalkers.Session.getStream("scheduled");
		

		// to-do: this.drafts = Cloudwalkers.Session.getStream("draft");

		// Emergency break
		if (!this.model) return Cloudwalkers.Session.home();

		// Translation for Title
		this.translateTitle("calendar");
		
		// Listen for changes
		//this.listenTo(this.model, 'outdated', this.model.fetch);
		this.listenTo(this.model, 'sync', this.render);
		//this.listenTo(this.model.messages, 'seed', this.fill);
		//this.listenTo(this.model.messages, 'request', this.showloading);
		
		// to-do: this.listenTo(this.drafts, 'sync', this.render);
		// to-do: this.listenTo(this.drafts.messages, 'seed', this.filldrafts);
		// to-do: this.listenTo(this.drafts.messages, 'request', this.showloading);
		
		//this.model.messages.on("all", function(call){ console.log(call); })

	},
	
	'render' : function()
	{

		var data = { 'monthActive': true };
		
		//Mustache Translate Render
		this.mustacheTranslateRender(data);

		this.$el.html (Mustache.render (Templates.calendar, data));
		this.$container = this.$el.find("#widgetcontainer").eq(0);
		
		// Add filter widget
		var filter = new Cloudwalkers.Views.Widgets.CalendarFilters ({model: this.model, calview: this});
		this.appendWidget(filter, 3);
		
		
		// Statistics
		var view = new Cloudwalkers.Views.Widgets.CalSummary ({calview: this});
		
		this.views.push(view);
		this.appendWidget(view, 9);
		
		// Chosen
		this.$el.find("select").chosen({width: "200px", disable_search_threshold: 10, inherit_select_classes: true});
		
		// Init FullCalendar
		setTimeout( this.initCalendar.bind(this), 10);

		// Reset Loader counter
		this.loaderswitch = [];
		return this;
	},
	
	'populate' : function (from, to, timezone, callback)
	{
				
		// Limit to month
		from = from.startOf('month').add(1, 'month');
		to = to.endOf('month').subtract(1, 'month');
		
		// Display
		this.datedisplay(from, to);
		
		// Touch Channel
		this.listenTo(this.model.messages, 'request',  function(){this.loader('on','')});
		this.listenTo(this.model.messages, 'ready', this.fill.bind(this, callback));
		this.listenTo(this.model.messages, 'ready:empty', this.fill.bind(this, callback));
		this.listenTo(this.model.messages, 'cached', this.fill.bind(this, callback));

		this.listenTo(this.model.messages, 'ready',  function(){this.loader('off','')});
		this.listenTo(this.model.messages, 'ready:empty',  function(){this.loader('off','')});

		$.extend(this.parameters, {since: from.unix(), until: to.unix()})

		this.model.messages.touch(this.model, this.parameters);		
	},

	'populate_scheduled' : function (from, to, timezone, callback)
	{
		// Limit to month
		from = from.startOf('month').add(1, 'month');
		to = to.endOf('month').subtract(1, 'month');
		
		// Display
		this.datedisplay(from, to);
		
		// Touch Channel
		this.listenTo(this.scheduled.messages, 'request',  function(){this.loader('','on')});
		this.listenTo(this.scheduled.messages, 'ready', this.fill.bind(this, callback));
		this.listenTo(this.scheduled.messages, 'ready:empty', this.fill.bind(this, callback));
		this.listenTo(this.scheduled.messages, 'cached', this.fill.bind(this, callback));

		this.listenTo(this.scheduled.messages, 'ready',  function(){this.loader('','off')});
		this.listenTo(this.scheduled.messages, 'ready:empty',  function(){this.loader('','off')});

		$.extend(this.parameters, {since: from.unix(), until: to.unix()})		
		
		this.scheduled.messages.touch(this.scheduled, this.parameters);	
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
		// console.log("filling networks");
		var nodes = [];

		if(!collection)	return callback(nodes);
		
		for (n in collection.models)
		{
			nodes.push(collection.models[n].filterCalReadable().calNode);
		}

		callback(nodes);
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
		
		// Toggle Calendar
		$('#calendar').fullCalendar ('changeView', this.viewtype);
	},
	
	'prev' : function () {
		$('#calendar').fullCalendar('prev');
	},
	
	'next' : function () {
		$('#calendar').fullCalendar('next');
	},
	
	'now' : function () {
		$('#calendar').fullCalendar('today');
	},
	
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
			firstDay: 1,
			axisFormat: 'H:mm',
			defaultTimedEventDuration: '00:30:00',
			slotEventOverlap: false,
			eventSources: [
		        this.populate.bind(this),
		        this.populate_scheduled.bind(this),
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
