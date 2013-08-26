/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.Datepicker = Cloudwalkers.Views.Widgets.Widget.extend({

	'title' : 'Date range',

	'events' :
	{
		'submit form' : 'submit'
	},
 
	'innerRender' : function (element)
	{
		var data = {};

		var self = this;
		element.html (Mustache.render (Templates.datepicker, data));

	    element.find( "#ui_date_picker_range_from" ).datepicker({
	      defaultDate: "+1w",
	      changeMonth: true,
	      numberOfMonths: 2,
	      dateFormat : 'dd/mm/yy',
	      onClose: function( selectedDate ) {
	        self.$el.find( "#ui_date_picker_range_to" ).datepicker( "option", "minDate", selectedDate );
	      }
	    });

	    element.find( "#ui_date_picker_range_to" ).datepicker({
	      defaultDate: "+1w",
	      changeMonth: true,
	      numberOfMonths: 2,
	      dateFormat : 'dd/mm/yy',
	      onClose: function( selectedDate ) {
	        self.$el.find( "#ui_date_picker_range_from" ).datepicker( "option", "maxDate", selectedDate );
	      }
	    });

	    // Recent buttons
	    element.find ('.recent-range').click (function (e)
	    {
	    	var range = $(e.currentTarget).attr ('data-range');

	    	var end = new Date ();
	    	end.setHours (0, 0, 0);

	    	var start = new Date (end - (range * 1000));

	    	self.$el.find( "#ui_date_picker_range_from" ).datepicker ('setDate', start);
	    	self.$el.find( "#ui_date_picker_range_to" ).datepicker ('setDate', end);

	    	self.trigger ('date:change', start, end);
	    });

		return this;
	},

	'submit' : function (e)
	{
		e.preventDefault ();

		var from = element.find( "#ui_date_picker_range_from" ).datepicker ('getDate');
		var to = element.find( "#ui_date_picker_range_to" ).datepicker ('getDate');

		this.trigger ('date:change', from, to);
	}

});