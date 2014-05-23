Cloudwalkers.Models.Statistic = Backbone.Model.extend({
	
	'typestring' : "statistics",
	'parameters' : {},
	
	'initialize' : function(attributes)
	{
		// Listen to outdates
		//this.on("outdated", this.fetch)
	},
	
	pluck : function (keys, streamid, hassublevel)
	{ 
		var response = 0;

		if(hassublevel) {
			key = keys[0];
			subkey = keys[1];
			if(hassublevel>2){
				subsubkey = keys[2];
			}
		}else{
			key = keys;
			subkey = "total";
		} 
		
		$.each(this.get("streams"), function(i, stream)
		{
			if(!streamid){ //Object/int: structure
				if(_.isNumber(stream[key][subkey]))					response+= Number(stream[key][subkey]);
				else if(_.isNumber(stream[key]) && !hassublevel)	response+= Number(stream[key]);
			}

			else if(_.isNumber(streamid) && streamid == stream.id){	response = stream[key];}

			//ONLY FOR OLD CHART DEMO -- if streamid is a token
			else if(_.isString(streamid) && (hassublevel <=2 || !hassublevel)){
				var network = Cloudwalkers.Session.getStream(stream.id).get("network").token;
				if(network == streamid){

					if(_.isNumber(stream[key][subkey]))					response+= Number(stream[key][subkey]);
					else if(_.isNumber(stream[key]) && !hassublevel)	response+= Number(stream[key]);
				}
			}

			else if(_.isString(streamid) && hassublevel > 2){
				var network = Cloudwalkers.Session.getStream(stream.id).get("network").token;
				if(network == streamid){

					if(_.isNumber(stream[key][subkey][subsubkey]))		response+= Number(stream[key][subkey][subsubkey]);
				}
			}
		});
		
		return response;
	},

	'pluckbynetwork' : function(){

	},
	
	all : function (key)
	{
		var response = [];
		
		if(!this.get("streams")) return response;
		
		$.each(this.get("streams"), function(i, stream)
		{
			if(!streamid && stream[key]) 	response.push(stream[key]);
			else if(streamid == stream.id)	response = stream[key];
		});
		
		return response;
	},
	
	/**
	 *	Column data
	 **/
	 
	'contacts' : function (single)
	{
		
		var list = [];
		
		if(!this.get("streams")) return list;
		
		if(!single)
		{
			$.each(this.get("streams"), function(i, log){
				
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