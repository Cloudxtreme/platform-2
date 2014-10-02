define(
	['Collections/Messages'],
	function(Messages)
	{
		var Related = Messages.extend({

			'typestring' : "related",
			'modelstring' : "related",
			'parenttype' : "message"
			
			/*'seed' : function(ids)
			{
				// Ignore empty id lists
				if(!ids) ids = [];

				var list = [];
				var fresh = _.compact( ids.map(function(id)
				{
					// In current Collection
					var model = this.get(id);
					
					// Or in Session collection
					if(!model)
					{
						model = Session.getMessage (id);
						this.add(model);
					}
					
					// Or create new
					if(!model) model = this.create({id: id});
						
					list.push(model);
					
					if(model.get("objectType") && !model.outdated) model.stamp();
					else return id;
				
				}, this));
				
				// Get list based on ids
				if(fresh.length)
				{
					this.endpoint = this.parentmodel? this.typestring: null;
					this.parameters = {ids: fresh.join(",")};
					
					this.fetch({remove: false});
				}
				
				// Trigger listening models
				this.trigger("seed", list);

				return list;
			}*/

		});

		return Related;
	});