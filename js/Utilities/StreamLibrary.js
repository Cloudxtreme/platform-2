/**
 * @TODO
 * Currently, all channel calls return an array of streams
 * Since this information is also available in /user/me, the
 * call parseFromChannel will be depreciated soon.
 */

/**
 * This object stores all stream information and grants access to
 * all streams that have been loaded in the library.
 * It is used to set the "stream" variable in the message objects
 *
 *
*/
Cloudwalkers.Utilities.StreamLibrary = {

	'streams' : [],

	'reset' : function ()
	{
		this.streams = [];
	},

	'parse' : function (streams)
	{
        for (var i = 0; i < streams.length; i ++)
        {
            this.touch (streams[i]);

            // Do all children as well
            if (typeof (streams[i].streams) != 'undefined')
            {
                this.parse (streams[i].streams);
            }
        }
	},

	'parseFromChannel' : function (streams)
	{
		
		for (var i = 0; i < streams.length; i ++)
		{
			if (this.touch (streams[i]))
            {
                // Deprecated: alert ('Stream not preloaded, this shouldn\'t happen.');
                console.log ('Stream NOT preloaded!');
                console.log (streams[i]);
            }
		}
	},

	'touch' : function (stream)
	{
		if (this.getFromId (stream.id) == null)
		{
			this.streams.push (new Cloudwalkers.Models.Stream (stream));
            return true;
		}
        return false;
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
	},

	'getStreams' : function ()
	{
		return this.streams;
	}

}