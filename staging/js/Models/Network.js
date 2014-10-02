define(
	['backbone'],
	function (Backbone)
	{
		var Network = Backbone.Model.extend({
	
			'parameters' : {},
			'networkcolors' : {
				'facebook': "#3B5998", 
				'twitter': "#01a9da", 
				'linkedin': "#1783BC", 
				'tumblr': "#385775", 
				'google-plus': "#DD4C39", 
				'youtube': "#CC181E", 
				'web': "#f39501", 
				'blog': "#f39501", 
				'mobile-phone': "#E2EAE9", 
				'others':"#E5E5E5",
				"group" : "#CCCCCC"
			},

			'initialize' : function(attributes){
				
				this.set("color", this.networkcolors[this.get("token")]);
			},

			'gettoken' : function(){
				return this.get("token") ? this.get("token") : false;
			},

			'getcolor' : function(){
				return this.get("color") ? this.get("color") : false;
			},

			'gettitle' : function(){
				return this.get("name") ? this.get("name") : false;
			},

			'geticon' : function(){
				return this.get("icon") ? this.get("icon") : false;
			},

			'getcontacts' : function(){
				return this.get("contacts") ? this.get("contacts") : 0;
			},

			'addcontacts' : function(n){
				this.set("contacts", this.getcontacts() + n);

				return this;
			}

		});

		return Network;
});