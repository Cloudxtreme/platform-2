define(
	['backbone', 'Session'],
	function (Backbone, Session)
	{
		var Statistic = Backbone.Model.extend({
	
			typestring : "statistics",
			parameters : {},
			
			initialize : function(attributes)
			{
				// Listen to outdates
				//this.on("outdated", this.fetch)
			},
			
			pluck : function (keys, streamid, hassublevel)
			{ 
				var response = 0;
				var network;

				if(!this.get("streams"))	return;

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
					// No stream, global sum
					if(!streamid){
						if(_.isNumber(stream[key][subkey]))					response+= Number(stream[key][subkey]);
						else if(_.isNumber(stream[key]) && !hassublevel)	response+= Number(stream[key]);
					}

					// Has stream
					else if(_.isNumber(streamid) && streamid == stream.id && (hassublevel <=2 || !hassublevel)){
						if(_.isNumber(stream[key][subkey]))					response+= Number(stream[key][subkey]);
						else if(_.isNumber(stream[key]) && !hassublevel)	response+= Number(stream[key]);
					}

					else if(_.isNumber(streamid) && streamid == stream.id && hassublevel > 2){
						if(_.isObject(stream[key]) && _.isObject(stream[key][subkey]))
							if(_.isNumber(stream[key][subkey][subsubkey]))		response+= Number(stream[key][subkey][subsubkey]);
					}

					// Has network token
					else if(_.isString(streamid) && (hassublevel <=2 || !hassublevel)){
						network = Session.getStream(stream.id).get("network").token;
						if(network == streamid){
							if(_.isNumber(stream[key][subkey]))					response+= Number(stream[key][subkey]);
							else if(_.isNumber(stream[key]) && !hassublevel)	response+= Number(stream[key]);
						}
					}

					else if(_.isString(streamid) && hassublevel > 2){
						network = Session.getStream(stream.id).get("network").token;
						if(network == streamid){
							if(_.isObject(stream[key]) && _.isObject(stream[key][subkey]))
								if(_.isNumber(stream[key][subkey][subsubkey]))		response+= Number(stream[key][subkey][subsubkey]);
						}
					}
				});
				//console.log(streamid,keys,response)
				return response;
			},

			pluckbynetwork : function(){
				//to be made
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
			 
			contacts : function (single)
			{
				
				var list = [];
				
				if(!this.get("streams")) return list;
				
				if(!single)
				{
					$.each(this.get("streams"), function(i, log){
						
						var stream = Session.getStream(log.id);
						
						// Temp hack
						if(stream)
						{
							var token = stream.get("network").token;
							var value = log.contacts;
						
							if (value)
								list.push({color: this.networkcolors[token], value: Number(value)});
						}
			
					}.bind(this));
				}
				
				return list;
			},
			
			age : function (single)
			{
				
				var list = [];

				return { counter: list};
			},
			
			gender : function (single)
			{
				
				var list = [];

				return { counter: list};
			},
			
			regional : function (single)
			{
				
				var list = [];

				return { counter: list};
			},
			
			countries : function (single)
			{
				
				var list = [];

				return { counter: list};
			},
			
			cities : function (single)
			{
				
				var list = [];

				return { counter: list};
			},
			
			besttime : function (single)
			{
				
				var list = [];

				return { counter: list};
			},
			
			activity : function (single)
			{
				
				var list = [];

				return { counter: list};
			}


		});

		return Statistic;
});