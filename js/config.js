var config =
{
		
	tokens : {
		'https://devplatform.cloudwalkers.be': 'oauth253fb03252cfbc2.44920946',
		'http://cloudwalkers-website' : 'oauth253f66ea2e89a99.45574901',
		'http://platform.cloudwalkers.local' : 'oauth253f63ffbac9012.56862210',
		'https://platform.cloudwalkers.be' : 'oauth253f65b84cd9ba6.21126665',
		'http://rc3.cloudwalkers.be' : 'oauth253f65ac4d19395.66548206',
		'http://rc2.cloudwalkers.be' : 'oauth253f65af9244b61.94828765',
		'http://rc1.cloudwalkers.be' : 'oauth253f65b3306cc99.62686940',
		'http://rc0.cloudwalkers.be' : 'oauth253f65b5607bd22.45756124',
		'http://cloudwalkers-website.local' : 'oauth253f70f5746a249.45888839'
	},
	
	api : {
		'https://devplatform.cloudwalkers.be': 'https://devapi.cloudwalkers.be/',
		'http://cloudwalkers-website' : 'https://devapi.cloudwalkers.be/',
		'http://platform.cloudwalkers.local' : 'https://devapi.cloudwalkers.be/',
		'https://platform.cloudwalkers.be' : 'https://api.cloudwalkers.be/',
		'http://rc3.cloudwalkers.be' : 'https://stagingapi.cloudwalkers.be/',
		'http://rc2.cloudwalkers.be' : 'https://stagingapi.cloudwalkers.be/',
		'http://rc1.cloudwalkers.be' : 'https://stagingapi.cloudwalkers.be/',
		'http://rc0.cloudwalkers.be' : 'https://stagingapi.cloudwalkers.be/',
		'http://cloudwalkers-website.local' : 'https://devapi.cloudwalkers.be/'
	},
	
	authurl : {
		'https://devplatform.cloudwalkers.be' : 'https://devapi.cloudwalkers.be/oauth2/',
		'http://cloudwalkers-website' : 'https://devapi.cloudwalkers.be/oauth2/',
		'http://platform.cloudwalkers.local' : 'https://devapi.cloudwalkers.be/oauth2/',
		'https://platform.cloudwalkers.be' : 'https://api.cloudwalkers.be/oauth2/',
		'http://rc3.cloudwalkers.be' : 'https://stagingapi.cloudwalkers.be/oauth2/',
		'http://rc2.cloudwalkers.be' : 'https://stagingapi.cloudwalkers.be/oauth2/',
		'http://rc1.cloudwalkers.be' : 'https://stagingapi.cloudwalkers.be/oauth2/',
		'http://rc0.cloudwalkers.be' : 'https://stagingapi.cloudwalkers.be/oauth2/',
		'http://cloudwalkers-website.local' : 'https://devapi.cloudwalkers.be/oauth2/'
	},
	
	setloginwindow : function ()
	{
		$("iframe").get(0).src = config.authurl[origin()] + "authorize?response_type=token&state=xyz&client_id=" + config.tokens[origin()] + "&redirect_uri=" + origin() + "/auth.html";
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
		if (event.origin !== origin())
		return;
		
		if (event.data) Store.set("settings", {key: "token", value: event.data}, config.hello);
		else config.hello();
	}
}

var origin = function ()
{
	return (window.location.origin)? window.location.origin : window.location.protocol + "//" + window.location.hostname;
}
			
			
			
			
			
			