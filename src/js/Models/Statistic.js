define(	// MIGRATION -> Swapped to base model becaue of 'stamp', url, etc
	['Models/BaseModel'],
	function (BaseModel)
	{	
		var Statistic = BaseModel.extend({
	
			typestring : "statistics",
			parameters : {},

			
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
						network = Cloudwalkers.Session.getStream(stream.id).get("network").token;
						if(network == streamid){
							if(_.isNumber(stream[key][subkey]))					response+= Number(stream[key][subkey]);
							else if(_.isNumber(stream[key]) && !hassublevel)	response+= Number(stream[key]);
						}
					}

					else if(_.isString(streamid) && hassublevel > 2){
						network = Cloudwalkers.Session.getStream(stream.id).get("network").token;
						if(network == streamid){
							if(_.isObject(stream[key]) && _.isObject(stream[key][subkey]))
								if(_.isNumber(stream[key][subkey][subsubkey]))		response+= Number(stream[key][subkey][subsubkey]);
						}
					}
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
						
						var stream = Cloudwalkers.Session.getStream(log.id);
						
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
			}

		});

		return Statistic;
});