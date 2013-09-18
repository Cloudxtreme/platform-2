/**
* A very simple key based storage engine.
*/
Cloudwalkers.Storage = 
{
	'set' : function (c_name, value, callback)
	{
		callback = callback || function () {};

		var exdays = 365;
		var exdate=new Date();
		exdate.setDate(exdate.getDate() + exdays);
		var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
		document.cookie=c_name + "=" + c_value;
	},

	'get' : function (c_name, callback, defaultValue)
	{
		callback = callback || function () {};

		if (typeof (defaultValue) == 'undefined')
		{
			defaultValue = null;
		}

		var c_value = document.cookie;
		var c_start = c_value.indexOf(" " + c_name + "=");
		if (c_start == -1)
		  {
		  c_start = c_value.indexOf(c_name + "=");
		  }
		if (c_start == -1)
		  {
		  c_value = defaultValue;
		  }
		else
		  {
		  c_start = c_value.indexOf("=", c_start) + 1;
		  var c_end = c_value.indexOf(";", c_start);
		  if (c_end == -1)
		  {
		c_end = c_value.length;
		}
		c_value = unescape(c_value.substring(c_start,c_end));
		}

		callback (c_value);
	}
}