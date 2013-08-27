Cloudwalkers.Collections.Trending = Cloudwalkers.Collections.Channel.extend
({
	'fetch_url' : 'json/trending/',

	'setComparator' : function ()
	{
		this.comparator = function (message1, message2)
		{
			return parseInt(message1.get ('engagement')) < parseInt(message2.get ('engagement')) ? 1 : -1;
		};
	}
});