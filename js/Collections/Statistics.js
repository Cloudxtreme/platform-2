Cloudwalkers.Collections.Statistics = Backbone.Collection.extend({
	
	'model' : Cloudwalkers.Models.Statistic,
	'typestring' : "statistics",
	'modelstring' : "statistic",
	'parenttype' : "account",
	'networkcolors' : {'facebook': "#3B5998", 'twitter': "#01a9da", 'linkedin': "#1783BC", 'tumblr': "#385775", 'google-plus': "#DD4C39", 'youtube': "#CC181E", 'web': "#f39501", 'blog': "#f39501", 'mobile-phone': "#E2EAE9", 'others':"#E5E5E5"},
	'colors' : ["#D97041", "#C7604C", "#21323D", "#9D9B7F", "#7D4F6D", "#584A5E"],
	'processing' : false,
	'parameters' : {},
	'paging' : {},
	'cursor' : false,
	
	'initialize' : function (options){
		
		// Override type strings if required
		if (options) $.extend(this, options);
		
		// Put "add" listener to global messages collection
		if( Cloudwalkers.Session.user.account)
			Cloudwalkers.Session.getReports().listenTo(this, "add", Cloudwalkers.Session.getReports().distantAdd);

	},
	
	'touch' : function (model, params)
	{
		// Work data
		this.parentmodel = model;
		this.endpoint = this.modelstring + "ids";
		this.parameters = params;
		
		// Check for history (without! ping lifetime)
		Store.get("touches", {id: this.url()}, this.touchlocal.bind(this));
	},
	
	
	'latest' : function ()
	{
		return this.at(this.length-1);
	},

	'first' : function ()
	{
		return this.at(0);
	},

	'place' : function (i)
	{
		return this.at(i);
	},
	
	/* temp function */
	'parse' : function (response)
	{
		if(typeof response == "string") console.log("is string"	)
		//console.log(response)
		
		// Solve response json tree problem
		if (this.parentmodel)
			response = response[this.parenttype];
	
		// Get paging
		this.setcursor(response.paging);
		
		// Ready?
		if(!response.paging) this.ready();
		
		return response[this.typestring];
	},
	
	/* temp function */
	/*'url' : function (params)
    {
       return this.endpoint == "statisticids"? "/json_week_ids": "/json_week";
    },*/


	/**
	 *	Column data
	 **/
	 
	'contacts' : function (single)
	{
		var stat = this.latest();
		
		var list = [];
		
		if(!stat.get("streams")) return list;
		
		if(!single)
		{
			$.each(stat.get("streams"), function(i, log){
				
				var stream = Cloudwalkers.Session.getStream(log.id);
				
				// Temp hack
				if(stream)
				{
					var token = stream.get("network").token;
					var value = log["contacts"];
				
					if (value)
						list.push({color: this.networkcolors[token], value: Number(value)});
				}
	
			}.bind(this));
		}
		
		console.log("contacts list:", list)
		
		return list;
	},
	
	'age' : function (single)
	{
		
		var list = [];

		return { counter: list};
	},
	
	'gender' : function (single)
	{
		
		var list = [];

		return { counter: list};
	},
	
	'regional' : function (single)
	{
		
		var list = [];

		return { counter: list};
	},
	
	'countries' : function (single)
	{
		
		var list = [];

		return { counter: list};
	},
	
	'cities' : function (single)
	{
		
		var list = [];

		return { counter: list};
	},
	
	'besttime' : function (single)
	{
		
		var list = [];

		return { counter: list};
	},
	
	'activity' : function (single)
	{
		
		var list = [];

		return { counter: list};
	}
	
});