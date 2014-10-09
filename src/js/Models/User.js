define(
	['backbone'],
	function (Backbone)
	{
		var User = Backbone.Model.extend({

			typestring : 'users',
	
			initialize : function ()
			{

			},
			
			url : function ()
			{
				if (this.parent)
					return Session.api + '/' + this.parent.typestring + '/' + this.parent.id + "/" + this.typestring + "/" + this.id;
				
				else if (this.method == 'create')
					return Session.api + '/accounts/' + Session.getAccount().get('id') + '/users';

				else if (this.method == 'delete')
					return Session.api + '/accounts/' + Session.getAccount().get('id') + '/users/' + this.id;
				
				else return Session.api + '/users/' + this.id;	

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
				this.method = method;
				
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
					
					data.role = this.getRole();
				}

				return data;
			},

			getcoworker : function(roles)
			{
				
			},
			
			getRole : function ()
			{	
				var roles = Session.getAccount().get('roles'); 	
				var userrole = this.get('rolegroup');

				if(!roles || _.isUndefined(userrole))
					return RootView.resync('#'+Backbone.history.fragment);

				var role = roles.filter(function(el){ return el.id == userrole});
				return role.length? role[0]: null;
			}
		});
		
		return User;
});