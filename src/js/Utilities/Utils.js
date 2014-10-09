define(
	[],
	function ()
	{
		var Utils = {

			'months' : [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec' ],

			'longdate' : function (date)
			{
				return date.getDate () + ' ' + this.month (date.getMonth () + 1) + ' ' + date.getFullYear () + ' ' + this.zeroIt (date.getHours (), 2) + ':' + this.zeroIt (date.getMinutes (), 2);
			},

			'shortdate' : function (date)
			{
				return date.getDate () + ' ' + this.month (date.getMonth () + 1) + ' ' + date.getFullYear ();
			},

			'time' : function (date)
			{
				return this.zeroIt (date.getHours (), 2) + ':' + this.zeroIt (date.getMinutes (), 2)
			},

			'zeroIt' : function (s, len)
			{
				var c = '0';
				s = String(s);
				
				while(s.length < len) s = c + s;

				return s;
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

		return Utils;
});