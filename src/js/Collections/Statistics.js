define(
	['backbone', 'Session', 'Models/Statistic', 'Models/Stream'],
	function (Backbone, Session, Statistic, Stream)
	{
		var Statistics = Backbone.Collection.extend({
	
			'model' : Statistic,
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
				
				if(!Session)	Session = require('Session')
				
				// Override type strings if required
				if (options) $.extend(this, options);
				
				// Put "add" listener to global messages collection
				if( Session.user.account)
					Session.getReports().listenTo(this, "add", Session.getReports().distantAdd);

			},
			
			'url' : function(a)
			{	
				// Get parent model
				if(this.parentmodel && !this.parenttype) this.parenttype = this.parentmodel.get("objectType");
				
				var url = Session.api + '/accounts/' + this.parentmodel.id;
						
				if(this.endpoint) url += '/' + this.endpoint;
			
				return url;
			},
			
			/**
			 *	Touch
			 *	This touch works different then the other collection touches
			 */
			'touch' : function (params)
			{
				this.parentmodel = Session.getAccount();
				this.endpoint = this.modelstring + "ids";
				
				// Hard-wired request (no caching)
				this.fetch({data: params, success: this.touchresponse.bind(this)});
			},
			
			'touchresponse' : function(coll, response)
			{	
				// Get ids
				var ids = response.account.statistics;

				this.endpoint = this.modelstring + 's';

				if (ids.length)
				{
					this.fetch ({reset: true, data: {ids: ids.join (",")}, success: this.trigger.bind(this, 'sync:data')});
					this.trigger('seed', ids)
				}
				
				else this.trigger ('sync:noresults');
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
						
						var stream = Session.getStream(log.id);
						
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
			},

			parsebesttime : function(streamid){

				var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
				var besttime,
					data = [],
					maxvalue = 0,
				 	dailyvalue = 0,
				 	fill,
				 	max,
				 	time;

				var statistics = this.models;

				//Always the last 7 results
				if(this.length > 7)
					statistics = statistics.splice(7, statistics.length-1);

				$.each(days, function(index, day){
					var statistic = statistics[index];
					var daily 	= [];

					if(statistic && statistic.get("streams")){
						var streams = statistic.get("streams");
						$.each(streams, function(index, stream){
							
							//If we are filtering per stream
							if(streamid && streamid != stream.id)
								return true;
							
							stream 	= new Stream(stream);
							besttime = stream.getbesttime();
							
							if(besttime){ 
								if(daily.length == 0)
									daily = _.values(besttime);
								
								for(i in besttime){							
									daily[i] += besttime[i];
			
									//Keep track of the highest week & daily value
									if(daily[i]>maxvalue)	maxvalue=daily[i];
									if(daily[i]>dailyvalue)	dailyvalue=daily[i];
								}
							}
						});
					}
					
					if(daily.length > 0)
						time = daily.indexOf(Math.max.apply(Math,_.values(daily)));
					else
						time = -1;

					data.push({day: days.shift(), value: dailyvalue, time: time});

					dailyvalue = 0;
				});

				data["maxvalue"] = maxvalue;
				
				return data;
			},
			
		});

		return Statistics;
	}
);