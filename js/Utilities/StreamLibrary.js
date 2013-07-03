/**
* This object stores all stream information and grants access to 
* all streams that have been loaded in the library.
* It is used to set the "stream" variable in the message objects
*/
Cloudwalkers.Utilities.StreamLibrary = {

	'streams' : [],

	'parse' : function (streams)
	{
		this.parseFromChannel (streams);
	},

	'parseFromChannel' : function (streams)
	{
		for (var i = 0; i < streams.length; i ++)
		{
			this.touch (streams[i]);
		}
	},

	'touch' : function (stream)
	{
		if (this.getFromId (stream.id) == null)
		{
			this.streams.push (new Cloudwalkers.Models.Stream (stream));
		}
	},

	'getFromId' : function (id)
	{
		for (var i = 0; i < this.streams.length; i ++)
		{
			if (this.streams[i].get ('id') == id)
			{
				return this.streams[i];
			}
		}
		return null;
	}

}