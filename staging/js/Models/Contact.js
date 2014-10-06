define(
	['Models/User', 'Session'],
	function (User, Session)
	{
		var Contact = User.extend({
	
			'typestring' : "contacts",
			'modelstring' : "contact",

			'url' : function ()
			{
				var url = [Session.api];
				
				if(this.parent)		url.push(this.parent.typestring, this.parent.id, this.typestring, this.id);
				//else if(this.id)	url.push(this.typestring, this.id);
				else if(this.id)	url.push("accounts", Session.getAccount ().id, this.typestring, this.id);
				else				url.push("accounts", Session.getAccount ().id, this.typestring);

				if(this.endpoint)	url.push(this.endpoint);

				if(this.urlparams)
					url = url.concat(this.urlparams)

				url = url.join("/");
				
				return this.parameters? url + "?" + $.param(this.parameters) : url;
			},

			'sync' : function (method, model, options)
			{	
				if(method == "read" && options.endpoint)	this.endpoint = options.endpoint;
				
				return Backbone.sync(method, model, options);
			},
			
			'parse' : function(response)
			{	
				// some sanity
				if(response[this.modelstring]) response = response[this.modelstring];
				if(this.endpoint && response[this.endpoint])	response = response[this.endpoint];

				// A new object
				if (typeof response == "number") response = {id: response};
				
				// Store incoming object
				else this.stamp(response);
				
				return response;
			},
			
			/* Deprecated? */
			
			'initialize' : function (attributes)
			{
				this.gender = this.get("gender");
			},

			'getMales' : function (){
				if(this.gender){
					return this.gender.male;
				}else{
					return 0;
				}
			},

			'getFemales' : function (){
				if(this.gender){
					return this.gender.female;
				}else{
					return 0;
				}
			},

			'getOthers' : function (){
				if(this.gender){
					return this.gender.other;
				}else{
					return 0;
				}
			},

			'getGender' : function (){
				if(this.gender){
					return this.gender;
				}else{
					return false;
				}
			},

			'getAge' : function (){
				if(this.age){
					return this.age;
				}else{
					return false;
				}
			}
		});

	
		return Contact;
});


		/**
		 *		Actions -> Deprecated?
		 **/
		 /*
		Contact.actions = {
			templates :
			{
				'dm': {name: "Direct message", icon: 'message', type:'dialog'}
			}
		}*/