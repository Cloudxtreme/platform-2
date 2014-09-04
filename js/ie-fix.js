/*
 *	Add authorization headers to each Backbone.sync call
 */
Backbone.ajax = function()
{
	// Is there a auth token?
	if(Cloudwalkers.Session.authenticationtoken)
		
		arguments[0].headers = {
            'Authorization': 'Bearer ' + Cloudwalkers.Session.authenticationtoken,
            'Accept': "application/json"
        };

	return Backbone.$.ajax.apply(Backbone.$, arguments);
};