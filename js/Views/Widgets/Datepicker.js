/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.Datepicker = Backbone.View.extend({

	'events' :
	{
		'submit form' : 'submit'
	},
 
	'render' : function ()
	{
		var data = {};

		var self = this;
		this.$el.html (Mustache.render (Templates.datepicker, data));

	    this.$el.find( "#ui_date_picker_range_from" ).datepicker({
	      defaultDate: "+1w",
	      changeMonth: true,
	      numberOfMonths: 2,
	      dateFormat : 'dd/mm/yy',
	      onClose: function( selectedDate ) {
	        self.$el.find( "#ui_date_picker_range_to" ).datepicker( "option", "minDate", selectedDate );
	      }
	    });

	    this.$el.find( "#ui_date_picker_range_to" ).datepicker({
	      defaultDate: "+1w",
	      changeMonth: true,
	      numberOfMonths: 2,
	      dateFormat : 'dd/mm/yy',
	      onClose: function( selectedDate ) {
	        self.$el.find( "#ui_date_picker_range_from" ).datepicker( "option", "maxDate", selectedDate );
	      }
	    });

		return this;
	},

	'submit' : function (e)
	{
		e.preventDefault ();

		var from = this.$el.find( "#ui_date_picker_range_from" ).datepicker ('getDate');
		var to = this.$el.find( "#ui_date_picker_range_to" ).datepicker ('getDate');

		this.trigger ('date:change', from, to);
	}

});