var config =
{
		
	tokens : {
		'http://platform.cloudwalkers.local' : 'oauth253f63ffbac9012.56862210',
		'https://platform.cloudwalkers.be' : 'oauth253f65b84cd9ba6.21126665',
		'http://rc3.cloudwalkers.be' : 'oauth253f65ac4d19395.66548206',
		'http://rc2.cloudwalkers.be' : 'oauth253f65af9244b61.94828765',
		'http://rc1.cloudwalkers.be' : 'oauth253f65b3306cc99.62686940',
		'http://rc0.cloudwalkers.be' : 'oauth253f65b5607bd22.45756124'
	},
	
	api : {
		'http://platform.cloudwalkers.local' : 'https://devapi.cloudwalkers.be/',
		'https://platform.cloudwalkers.be' : 'https://api.cloudwalkers.be/',
		'http://rc3.cloudwalkers.be' : 'https://stagingapi.cloudwalkers.be/',
		'http://rc2.cloudwalkers.be' : 'https://stagingapi.cloudwalkers.be/',
		'http://rc1.cloudwalkers.be' : 'https://stagingapi.cloudwalkers.be/',
		'http://rc0.cloudwalkers.be' : 'https://stagingapi.cloudwalkers.be/'
	},
	
	authurl : {
		'http://platform.cloudwalkers.local' : 'https://devapi.cloudwalkers.be/oauth2/authorize',
		'https://platform.cloudwalkers.be' : 'https://api.cloudwalkers.be/oauth2/authorize',
		'http://rc3.cloudwalkers.be' : 'https://stagingapi.cloudwalkers.be/oauth2/authorize',
		'http://rc2.cloudwalkers.be' : 'https://stagingapi.cloudwalkers.be/oauth2/authorize',
		'http://rc1.cloudwalkers.be' : 'https://stagingapi.cloudwalkers.be/oauth2/authorize',
		'http://rc0.cloudwalkers.be' : 'https://stagingapi.cloudwalkers.be/oauth2/authorize'
	},
	
	setloginwindow : function ()
	{
		$("iframe").get(0).src = config.authurl[window.location.origin] + "?response_type=token&state=xyz&client_id=" + config.tokens[window.location.origin] + "&redirect_uri=" + window.location.origin + "/auth.html";
	},
	
	hello : function ()
	{
		window.location = "/";
	},
	
	hasToken : function ()
	{
		Store.get("settings", "token", function(entry)
		{
			if(entry) hello();
			
			else
			{
				config.setloginwindow();
				window.addEventListener("message", config.receiveToken, false);	
			}
		});
	},
	
	receiveToken :function (event)
	{
		if (event.origin !== window.location.origin)
		return;
		
		Store.set("settings", {key: "token", value: event.data}, config.hello);
	}
}
			
			
			
			
			
			