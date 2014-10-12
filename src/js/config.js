define({

	appid : "oauth254343419b8cf92.53791794", 
	apiurl: "https://devapi.cloudwalkers.be/",
	authurl: "https://devapi.cloudwalkers.be/oauth2/",
	
	setloginwindow : function ()
	{
		$("iframe").get(0).src = this.authurl + "authorize?response_type=token&state=xyz&client_id=" + this.appid + "&redirect_uri=" + origin() + "/auth.html";
	},
	
	hello : function ()
	{
		window.location = "/";
	},
	
	hasToken : function ()
	{
		// Authentication
		var token = window.localStorage.getItem('token');
		
		if(token && token.length > 9) this.hello();
		else	
		{
			if(token) window.localStorage.removeItem('token');
			
			this.setloginwindow();
			window.addEventListener("message", this.receiveToken.bind(this), false);	
		}
	},
	
	receiveToken :function (event)
	{
		if (event.origin !== origin())
		return;
		
		if (event.data && event.data.length > 9)
		{
			window.localStorage.setItem('token', event.data);
			this.hello();
		}
		else this.setloginwindow();
	}
});

var origin = function ()
{
	return (window.location.origin)? window.location.origin : window.location.protocol + "//" + window.location.hostname;
}
		