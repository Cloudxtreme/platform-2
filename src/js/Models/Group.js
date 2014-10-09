define(
	['backbone'],
	function (Backbone)
	{
		var Group = Backbone.Model.extend({

			url : function ()
			{
				if(this.parent)
		        	return CONFIG_BASE_URL + 'json/' + this.parent.typestring + '/' + this.parent.id + "/" + this.typestring + "/" + this.id;
		        
		        else return CONFIG_BASE_URL + 'json/group/' + this.id;
			},
			
			parse : function(response)
			{	
				// A new object
				if (typeof response == "number") response = {id: response};
				
				// Store incoming object
				else this.stamp(response);

				return response;
			},
			
			sync : function (method, model, options)
			{
				this.endpoint = (options.endpoint)? "/" + options.endpoint: false;
				
				// Hack
				if(method == "update") return false;
				
				return Backbone.sync(method, model, options);
			},
			
			loaded : function(param)
			{
				return this.get(param? param: "objectType") !== undefined;
			},
			
			filterData : function (type)
			{
				
				var data = this.attributes;
				
				if(type == "listitem")
				{
					data.arrow = true;
					
				} else {
					
					data.role = this.getRole().name;
				}

				return data;
			},
			
			getRole : function ()
			{
				if (this.get ('level') == 10)
				{
					return 'Administrator';
				}
				else
				{
					return 'Co-worker';
				}
			}
		});

		return Group;
});