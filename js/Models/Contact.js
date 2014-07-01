Cloudwalkers.Models.Contact = Cloudwalkers.Models.User.extend({
	
	'typestring' : "contacts",
	'modelstring' : "contact",
	
	'url' : function ()
	{
		var url = [CONFIG_BASE_URL + "json"];
		
		if(this.parent)		url.push(this.parent.typestring, this.parent.id, this.typestring, this.id);
		//else if(this.id)	url.push(this.typestring, this.id);
		else if(this.id)	url.push("accounts", Cloudwalkers.Session.getAccount ().id, this.typestring, this.id);
		else				url.push("accounts", Cloudwalkers.Session.getAccount ().id, this.typestring);

		if(this.urlparams)
			url = url.concat(this.urlparams)

		url = url.join("/");
		
		return this.parameters? url + "?" + $.param(this.parameters) : url;
	},
	
	'parse' : function(response)
	{	
		// some sanity
		if(response[this.modelstring]) response = response[this.modelstring];
		
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


/**
 *		Actions
 **/

Cloudwalkers.Models.Contact.actions = {
	templates :
	{
		'dm': {name: "Direct message", icon: 'message', type:'dialog'}
	}
}