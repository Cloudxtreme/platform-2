Cloudwalkers.Models.Contact = Cloudwalkers.Models.User.extend({
	
	
	
	
	
	
	
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