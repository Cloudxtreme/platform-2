define(
	['Views/Pageview', 'mustache', 'Session', 'Views/Widgets/CalendarFilters', 'Views/Widgets/CalSummary'],
	function (Pageview, Mustache, Session, CalendarFiltersWidget, CalSummaryWidget)
	{
		var Calendar = Pageview.extend({

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
				this.posted = Session.getChannel("profiles");
				this.scheduled = Session.getStream("scheduled");
				

				// Emergency break
				if (!this.posted) return Session.home();

				// Translation for Title
				this.translateTitle("calendar");
				
				// Listen for changes
				this.listenTo(this.posted, 'sync', this.render);

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
				var view = new Cloudwalkers.Views.Widgets.CalSummary ({calview: this});

				this.views.push(view);
				this.appendWidget(view, 9);
				
				this.CalSummary = view;			

				// Chosen
				this.$el.find("select").chosen({width: "200px", disable_search_threshold: 10, inherit_select_classes: true});
				
				// Init FullCalendar
				setTimeout( this.initCalendar.bind(this), 1000);

				// Reset Loader counter
				this.loaderswitch = [];

				return this;
			},

			'populate' : function (from, to, timezone, callback, dayview)
			{
				
				if(!dayview){
					this.loader('on','');
					// Limit to month
					if(from.date() > 1) 
						from = from.startOf('month').add(1, 'month');
					else
						from = from.startOf('month');

					to = (to.endOf('month').subtract(1, 'month')).endOf('month');
				} else {
					this.parameters.records = 50;
					$('#calendar').fullCalendar( 'removeEvents', function(event) {
						if(event.start.date() == from.date())
							return true;
					});
					m_item = 0;
				}
				m_item = from.date()-1;

				// Display top
				this.datedisplay(from, to);
				
				if(!dayview)
					this.CalSummary.getTotal(from, to);
				// Listen to
				this.listenTo(this.posted.messages, 'sync', this.fill.bind(this, callback));
				
				// cycle day by day
				while(m_item < to.date()){
					if(!dayview){
						var metafrom = moment(from).add(m_item, 'days');
					} else {
						var metafrom = moment(from);
					}
					var metato = metafrom;
					metafrom = moment(metafrom).hours('0').minutes('0');
					metato =  moment(metato).hours('22').minutes('59');

					$.extend(this.parameters, {since: metafrom.unix(), until: metato.unix()})

					// Touch the day
					this.posted.messages.touch(this.posted, this.parameters);

					m_item++;
				}	
			},

			'populate_scheduled' : function (from, to, timezone, callback, dayview)
			{
				if(!dayview){
					this.loader('on','');
					// Limit to month
					if(from.date() > 1) 
						from = from.startOf('month').add(1, 'month');
					else
						from = from.startOf('month');

					to = (to.endOf('month').subtract(1, 'month')).endOf('month');
					m_item = from.date()-1;
				} else {
					this.parameters.records = 50;
					$('#calendar').fullCalendar( 'removeEvents', function(event) {
						if(event.start.date() == from.date())
							return true;
					});
					m_item = 0;
				}
				m_item = from.date()-1;

				// Display top
				this.datedisplay(from, to);
				
				// Listen to
				this.listenTo(this.scheduled.messages, 'sync', this.fill.bind(this, callback));
				
				// cycle day by day
				while(m_item < to.date()){
					if(!dayview){
						var metafrom = moment(from).add(m_item, 'days');
					} else {
						var metafrom = moment(from);
					}
					var metato = metafrom;
					metafrom = moment(metafrom).hours('0').minutes('0');
					metato =  moment(metato).hours('22').minutes('59');

					$.extend(this.parameters, {since: metafrom.unix(), until: metato.unix()})

					// Touch the day
					this.scheduled.messages.touch(this.scheduled, this.parameters);

					m_item++;
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
			
			'fill' : function (callback, collection, metaform)
			{

				if(!collection.models[0])
					return;

				fillfrom = moment(collection.models[0].filterCalReadable().calNode.start).hours('0').minutes('0');
				fillto = moment(fillfrom).hours('22').minutes('59');

				fillparameters = {
					since : fillfrom.unix(),
					until :  fillto.unix(),
					records: 5
				}

				var nodes = [];
				
				if(!collection)	return callback(nodes);

				for (n in collection.models)
				{
					nodes.push(collection.models[n].filterCalReadable().calNode);
				}

				// Add more
				if((nodes.length > 0) && (nodes[0].networkdescription)){

						if((this.parameters.records == 5) && (nodes[0].networkdescription != "Scheduled messages")){
							// it's not a scheduled messages stream, let's see if it has more messages
							stream.fetch({endpoint: 'messageids', parameters: fillparameters, success: this.validateViewmore.bind(this, nodes, this.scheduled, this.posted)});
						} else {
							// render the events of this day
							this.renderDayEvents(nodes)
						}
				} 

				// let's clean
				if(this.scheduled)
					this.scheduled.messages.destroy();

				if(this.posted)
					this.posted.messages.destroy();

			},

			'validateViewmore' : function(nodes, scheduled, posted, result){
				// if there's paging, add "view more" event
				if(result.attributes.paging.cursors.after){
					nodes.push({
						className: "calendar-more",
						icon: "plus",
						id: 0000,
						allDay: false,
						title: this.translateString("view_more"),
						start: moment(nodes[0].start).hours('23').minutes('59'),
					});
				}
				//render the events
				this.renderDayEvents(nodes)
			},

			'renderDayEvents' : function(eventData){
				// render each event of this day
				for (eventNr in eventData)
				{
					if(eventData[eventNr].title == "...")
						return;

					if(eventData[eventNr].networkdescription =="Scheduled messages")
						eventData[eventNr].start = moment(eventData[eventNr].start._i, 'DD MMM YYYY HH:mm').format('YYYY-MM-DDTHH:mm:ssZ');

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

					},
					// click on "view more" to go to day view
					eventClick: function(calEvent, jsEvent, view) {
						if(calEvent.className[0] == "calendar-more"){
							var toDate = new Date(calEvent.start);

							$('select').val("agendaDay");
		        			$('select').trigger("chosen:updated");
							$('#calendar').fullCalendar( 'changeView', 'agendaDay' );
							$('#calendar').fullCalendar( 'gotoDate', toDate );
							
							from = calEvent.start;
							to = from;
							dayview = true;
							timezone = "";
							callback = "";

							this.populate(from, to, timezone, callback, dayview)
							this.populate_scheduled(from, to, timezone, callback, dayview)
						}
					}.bind(this)
					
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
				this.title = Session.polyglot.t(translatedata);
			},

			'translateString' : function(translatedata)
			{	
				// Translate String
				return Session.polyglot.t(translatedata);
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

				for (var k in this.original)
				{
					this.translated[k] = this.translateString(this.original[k]);
					translatelocation["translate_" + this.original[k]] = this.translated[k];
				}
			}

		});


		return Calendar;
	}
);