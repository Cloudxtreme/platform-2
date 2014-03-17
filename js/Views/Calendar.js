Cloudwalkers.Views.Calendar = Cloudwalkers.Views.Pageview.extend({

	'title' : 'Calendar',
	'className' : "container-fluid calendar",
	
	'initialize' : function ()
	{
		// Select streams
		this.model = Cloudwalkers.Session.getStream("scheduled");
		this.drafts = Cloudwalkers.Session.getStream("draft");


		// Emergency break
		if (!this.model) return Cloudwalkers.Session.home();
		
		// Listen for changes
		//this.listenTo(this.model, 'outdated', this.model.fetch);
		this.listenTo(this.model, 'sync', this.render);
		this.listenTo(this.model.messages, 'seed', this.fill);
		this.listenTo(this.model.messages, 'request', this.showloading);
		
		this.listenTo(this.drafts, 'sync', this.render);
		this.listenTo(this.drafts.messages, 'seed', this.filldrafts);
		this.listenTo(this.drafts.messages, 'request', this.showloading);
	},
	
	'render' : function()
	{
		this.$el.html (Mustache.render (Templates.calendar, { 'title' : this.title }));
		this.$container = this.$el.find("#widgetcontainer").eq(0);
		
		setTimeout( this.initCalendar.bind(this), 100);

		// Add filter widget
		/*var filter = new Cloudwalkers.Views.Widgets.ScheduledFilters ({model: this.model});
		this.appendWidget(filter, 4);
		
		// Add list widget
		var list = new Cloudwalkers.Views.Widgets.ScheduledList ({model: this.model});
		this.appendWidget(list, 8);
		
		filter.list = list;*/
		
		return this;
	},
	
	'filldrafts' : function (list)
	{		
		
		$('#drafts-list').html("");
		//this.addDraft("My Event 1");
		//this.addDraft("My Event 2");
		//this.addDraft("My Event 3");
		//this.addDraft("My Event 4");
		//this.addDraft("My Event 5");
		//this.addDraft("My Event 6");
		
		for (n in list)
		{
			this.addDraft("Draft message ("+ list[n].id +")"); //list[n].get("title")? list[n].get("title"): list[n].get("body").plaintext);
		}
		
		/*// Clean load or add
		if(this.incremental) this.incremental = false;
		else
		{
			$.each(this.entries, function(n, entry){ entry.remove()});
			this.entries = [];
		}
		
		// Store amount
		this.count = list.length;
		
		// Get messages
		//var messages = this.category.messages.seed(ids);
		
		// Add messages to view
		for (n in list)
		{
			var view = new Cloudwalkers.Views.Entry ({tagName: "tr", model: list[n], type: "full", template: "scheduledentry"});
			this.entries.push (view);
			
			this.$container.append(view.render().el);
		}*/
		
		// Hide loading
		//this.hideloading();
	},
	
	'initCalendar' : function () {
	
		// Fullcalendar plugin
		var date = new Date();
		var d = date.getDate();
		var m = date.getMonth();
		var y = date.getFullYear();
		
		var h = {};
		
		// Visualize
		if ($('#calendar').parents(".portlet").width() <= 720) {
			$('#calendar').addClass("mobile");
			h = {
				left: 'title, prev, next',
				center: '',
				right: 'today,month,agendaWeek,agendaDay'
			};
		} else {
			$('#calendar').removeClass("mobile");
			h = {
				left: 'title',
				center: '',
				right: 'prev,next,today,month,agendaWeek,agendaDay'
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
			slotMinutes: 15,
			editable: true,
			droppable: true, // this allows things to be dropped onto the calendar !!!
			drop: function (date, allDay) { // this function is called when something is dropped
			
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
				
				/*// is the "remove after drop" checkbox checked?
				if ($('#drop-remove').is(':checked')) {
				// if so, remove the element from the "Draggable Events" list
				$(this).remove();
				}*/
			},
			events: [{
				title: 'Twitter post',                        
				start: new Date(y, m, 1),
				backgroundColor: '#01a9da',
				allDay: false,
			}, {
				title: 'Facebook message',
				start: new Date(y, m, d - 5),
				backgroundColor: '#3B5998',
				allDay: false,
			}, {
				title: 'Linkedin message',
				start: new Date(y, m, d - 3, 16, 0),
				backgroundColor: '#1783BC',
				allDay: false,
			}, {
				title: 'Tumblr post',
				start: new Date(y, m, d + 4, 16, 0),
				backgroundColor: '#385775',
				allDay: false,
			}, {
				title: 'Google+ message',
				start: new Date(y, m, d, 10, 30),
				backgroundColor: '#DD4C39',
				allDay: false,
			}, {
				title: 'Youtube movie',
				start: new Date(y, m, d, 12, 0),
				backgroundColor: '#CC181E',
				allDay: false,
			}, {
				title: 'Blog Post',
				start: new Date(y, m, d + 1, 19, 0),
				backgroundColor: '#ff9c00',
				allDay: false,
			}, {
				title: 'Co-worker message',
				start: new Date(y, m, 28),
				backgroundColor: '#4a4a4a',
				url: 'http://google.com/',
				allDay: false,
			}
			]
		});
		
		// Load Collections
		this.drafts.messages.touch(this.drafts);
		
	
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

var Calendar = function () {


    return {
        //main function to initiate the module
        init: function () {
            Calendar.initCalendar();
        },

        initCalendar: function () {

            if (!jQuery().fullCalendar) {
                return;
            }

            var date = new Date();
            var d = date.getDate();
            var m = date.getMonth();
            var y = date.getFullYear();

            var h = {};

            
			if ($('#calendar').parents(".portlet").width() <= 720) {
                $('#calendar').addClass("mobile");
                h = {
                    left: 'title, prev, next',
                    center: '',
                    right: 'today,month,agendaWeek,agendaDay'
                };
            } else {
                $('#calendar').removeClass("mobile");
                h = {
                    left: 'title',
                    center: '',
                    right: 'prev,next,today,month,agendaWeek,agendaDay'
                };
            }
            
           

            var initDrag = function (el) {
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

            var addEvent = function (title) {
                title = title.length == 0 ? "Untitled Event" : title;
                var html = $('<div class="external-event label">' + title + '</div>');
                jQuery('#drafts-list').append(html);
                initDrag(html);
            }

            $('#external-events div.external-event').each(function () {
                initDrag($(this))
            });

           /* $('#event_add').unbind('click').click(function () {
                var title = $('#event_title').val();
                addEvent(title);
            });*/

            //predefined events
            $('#drafts-list').html("");
            addEvent("My Event 1");
            addEvent("My Event 2");
            addEvent("My Event 3");
            addEvent("My Event 4");
            addEvent("My Event 5");
            addEvent("My Event 6");

            $('#calendar').fullCalendar('destroy'); // destroy the calendar
            $('#calendar').fullCalendar({ //re-initialize the calendar
                header: h,
                slotMinutes: 15,
                editable: true,
                droppable: true, // this allows things to be dropped onto the calendar !!!
                drop: function (date, allDay) { // this function is called when something is dropped

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
					
                    /*// is the "remove after drop" checkbox checked?
                    if ($('#drop-remove').is(':checked')) {
                        // if so, remove the element from the "Draggable Events" list
                        $(this).remove();
                    }*/
                },
                events: [{
                        title: 'All Day Event',                        
                        start: new Date(y, m, 1),
                        backgroundColor: 'orange' /*App.getLayoutColorCode('yellow')*/
                    }, {
                        title: 'Long Event',
                        start: new Date(y, m, d - 5),
                        end: new Date(y, m, d - 2),
                        backgroundColor: 'green' /*App.getLayoutColorCode('green')*/
                    }, {
                        title: 'Repeating Event',
                        start: new Date(y, m, d - 3, 16, 0),
                        allDay: false,
                        backgroundColor: 'red' /*App.getLayoutColorCode('red')*/
                    }, {
                        title: 'Repeating Event',
                        start: new Date(y, m, d + 4, 16, 0),
                        allDay: false,
                        backgroundColor: 'green' /*App.getLayoutColorCode('green')*/
                    }, {
                        title: 'Meeting',
                        start: new Date(y, m, d, 10, 30),
                        allDay: false,
                    }, {
                        title: 'Lunch',
                        start: new Date(y, m, d, 12, 0),
                        end: new Date(y, m, d, 14, 0),
                        backgroundColor: 'grey' /*App.getLayoutColorCode('grey')*/,
                        allDay: false,
                    }, {
                        title: 'Birthday Party',
                        start: new Date(y, m, d + 1, 19, 0),
                        end: new Date(y, m, d + 1, 22, 30),
                        backgroundColor: 'blue' /*App.getLayoutColorCode('purple')*/,
                        allDay: false,
                    }, {
                        title: 'Click for Google',
                        start: new Date(y, m, 28),
                        end: new Date(y, m, 29),
                        backgroundColor: 'orange' /*App.getLayoutColorCode('yellow')*/,
                        url: 'http://google.com/',
                    }
                ]
            });

        }

    };

}();