Cloudwalkers.Utils = {

	'months' : [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],

	'longdate' : function (date)
	{
		return date.getDate () + '/' + date.getMonth () + '/' + date.getFullYear () + ' ' + date.getHours () + ':' + date.getMinutes ();
	},

	'month' : function (monthid)
	{
		if (typeof (this.months[monthid - 1]) != 'undefined')
		{
			return this.months[monthid - 1];
		}
		else
		{
			return 'Month out of range';
		}
	}

};