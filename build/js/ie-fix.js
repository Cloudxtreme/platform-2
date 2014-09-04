$( function()
{	
	/*
	 *	Add authorization headers to each Backbone.sync call
	 */
	Backbone.ajax = function()
	{	console.log(Cloudwalkers.Session.authenticationtoken)
		// Is there a auth token?
		if(Cloudwalkers.Session.authenticationtoken)
			
			var url = arguments[0].url;
			var op;

	     	if(url){

	     		op 	= (url.indexOf('?') >= 0)? '&': '?';
	     		url = url + op + 'auth_token=' + Cloudwalkers.Session.authenticationtoken;

	     		arguments[0].url = url;
	     	}
		
		return Backbone.$.ajax.apply(Backbone.$, arguments);
	};
});