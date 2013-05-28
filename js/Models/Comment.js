Cloudwalkers.Models.Comment = Cloudwalkers.Models.Message.extend({

	'humandate' : function ()
	{
		var date = (new Date(this.get ('date')));
		return date.toLocaleString ();
	}

});