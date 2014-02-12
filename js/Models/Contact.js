Cloudwalkers.Models.Contact = Cloudwalkers.Models.User.extend({
	'initialize' : function ()
	{
		
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