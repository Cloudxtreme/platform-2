Cloudwalkers.Router = Backbone.Router.extend ({

	'routes' : {
		'dashboard/:accountid' : 'changeaccount',
		
		'demo(/:demotype)' : 'demo',
		
		'inbox/drafts' : 'ib-drafts',
		'inbox/sent' : 'ib-sent',
		'inbox/scheduled' : 'ib-scheduled',
		'inbox/trash' : 'ib-trash',

		'write' : 'write',
		'share' : 'share',
		'inbox(/:type)(/:streamid)' : 'inbox',
		'drafts' : 'drafts',
		'outbox(/:type)' : 'outbox',
		'notes' : 'notes',
		'scheduled' : 'scheduled',
		'calendar' : 'calendar',
		'coworkers' : 'coworkers',
		'channel/:channel(/:subchannel)(/:stream)(/:messageid)' : 'channel',
		'timeline/:channel(/:stream)' : 'timeline',
		'trending/:channel(/:subchannel)(/:stream)(/:messageid)' : 'trending',
		'monitoring/accounts' : 'manageaccounts',
		'monitoring/:channel(/:subchannel)(/:messageid)' : 'monitoring',
		'keywords' : 'managekeywords',
		'reports/:streamid' : 'reports',
		'statistics' : 'statistics',
		'statistics/:streamid' : 'statistics',
		'settings(/:sub)(/:service)' : 'settings',
		'firsttime' : 'firsttime',
		'work' : 'coworkdashboard',
		
		'resync' : 'resync',
		'home' : 'home',
		'logout' : 'home',
		'*path' : 'dashboard'
	},

	'initialize' : function (){},
	
	/**
	 *	Demo
	 **/
	 
	 'demo' : function (demotype)
	{
		// Parameters
		var channel = Cloudwalkers.Session.getChannel ('inbox');
		
		var type = "messages";
		
		// Visualisation
		Cloudwalkers.RootView.setView (new Cloudwalkers.Views.Demo({channel: channel, type: type, demotype: demotype}));
	},

	
	/**
	 *	Dashboard
	 **/

	'dashboard' : function ()
	{	
		//if(!Cloudwalkers.Session.isupdated())
			//return Cloudwalkers.RootView.resync('#dashboard');

		// Check first-timer
		if (Cloudwalkers.Session.getAccount().get("firstTime"))
			 
			return this.navigate("#firsttime", true);
			
		// Coworker level
		if (!Cloudwalkers.Session.isAuthorized('_CW_INBOX_VIEW'))			 
			return this.navigate("#work", true);
		
		
		Cloudwalkers.RootView.setView (new Cloudwalkers.Views.Dashboard());
	},
	
	/**
	 *	Account Switch
	 **/

	'changeaccount' : function (accountid)
	{	
		if(accountid != Cloudwalkers.Session.get("currentAccount"))
		{
			Cloudwalkers.Session.updateSetting("currentAccount", accountid, {success: this.home}); //patch: true
		}
	},
	
	/**
	 *	Message board
	 **/
	 
	
	'write' : function ()
	{
		//var view = new Cloudwalkers.Views.Write ();
		Cloudwalkers.RootView.compose();
	},
	
	'share' : function ()
	{
		Cloudwalkers.RootView.viewshare ("general");
	},
	
	/**
	 *	Co-workers wall
	 **/
	 
	'coworkers' : function ()
	{
		var view = new Cloudwalkers.Views.Coworkers()
		var roles = '_CW_COWORKERS_VIEW';

		this.validate(view, roles);
	},
	
	
	/**
	 *	Inbox
	 **/
	 
	 'ib-drafts' : function()
	 {
		// Visualisation
		Cloudwalkers.RootView.setView (new Cloudwalkers.Views.IB({channeltype: 'draft', filter: 'editors', title: "Drafts"}));
	 },
	 
	 'inbox' : function (type, streamid)
	{
		var types = {
			'MESSAGE_READ_INBOX_NOTIFICATIONS' : '#messages/notifications',
			'MESSAGE_READ_INBOX_SCHEDULE' : '#scheduled',
			'MESSAGE_READ_DRAFTS' : '#drafts',
			'ACCOUNT_NOTES_VIEW' : '#notes'
			}

		// "Manual" validation
		//if(!Cloudwalkers.Session.isupdated())
			//return Cloudwalkers.RootView.resync('#'+Backbone.history.fragment);

		var available = _.intersection(_.keys(types), Cloudwalkers.Session.getUser().authorized);

		// Parameters
		var channel = Cloudwalkers.Session.getChannel ('inbox');

		if (!channel)	return this.home();		
		if (!available || !available.length) return this.home();
		if (!type) type = "messages";		
		
		if (!Cloudwalkers.Session.isAuthorized('MESSAGE_READ_INBOX_'+ type.toUpperCase()))
		{
			if(Cloudwalkers.Session.getUser().authorized && available.length)
				return this.navigate(types[available[0]], {trigger: true});
			else 
				window.location = "/";
		}

		Cloudwalkers.RootView.setView (new Cloudwalkers.Views.Inbox({channel: channel, type: type, streamid: streamid}));
	},
	
	'drafts' : function ()
	{	
		var view = new Cloudwalkers.Views.Drafts();
		var roles = 'MESSAGE_READ_DRAFTS';

		this.validate(view, roles);
	},

	'outbox' : function(type)
	{
		if (!type) type = "sent";
		
		var view = new Cloudwalkers.Views.Sent();
		var roles = 'MESSAGE_READ_DRAFTS';

		this.validate(view, roles);
	},

	'notes' : function ()
	{	
		var view = new Cloudwalkers.Views.Notes();
		var roles = 'ACCOUNT_NOTES_VIEW';

		this.validate(view, roles);
	},
	
	'scheduled' : function ()
	{	
		var view = new Cloudwalkers.Views.Scheduled();
		var roles = 'MESSAGE_READ_SCHEDULE';

		this.validate(view, roles);
	},
	
	'calendar' : function ()
	{
		Cloudwalkers.RootView.setView (new Cloudwalkers.Views.Calendar());
	},
	
	/**
	 * Timeline
	**/
	
	'timeline' : function (channelid, streamid)
	{	
		// Get model from url
		var model = streamid?
			Cloudwalkers.Session.getStream(Number(streamid)) :
			Cloudwalkers.Session.getChannel(Number(channelid));

		var id = streamid? streamid: channelid;

		var account = Cloudwalkers.Session.getAccount ();
		var news = account.channels.findWhere({type: "news"})? account.channels.findWhere({type: "news"}).id: null;
		var profiles = account.channels.findWhere({type: "profiles"})? account.channels.findWhere({type: "profiles"}).id: null;

		var type =  channelid == profiles? 'company' : 'thirdparty';
		var showcontact = type == 'thirdparty';

		var view =new Cloudwalkers.Views.Timeline({model: model, showcontact: showcontact, parameters: {records: 40, markasread: true}})
		var roles = type == 'MESSAGE_READ_'+type.toUpperCase();

		this.validate(view, roles);
	},
	
	/**
	 * Trending
	**/
	
	'trending' : function (channelid, streamid)
	{

		// Get model from url
		var channel = Cloudwalkers.Session.getChannel(Number(channelid));
		var model = streamid? Cloudwalkers.Session.getStream(Number(streamid)): channel;
			
		// Parameters
		var span = channel.get('type') == "news"? 1: 7;
		var params = {
			since: Math.round(Date.now()/3600000) *3600 - 86400 *span,
			sort: 'engagement',
			records: 40,
			markasread: true
		}

		var id = streamid? streamid: channelid;		

		var view = new Cloudwalkers.Views.Timeline({model: model, trending: true, parameters: params});
		var roles = 'MESSAGE_READ_THIRDPARTY';

		this.validate(view, roles);
	},
	
	'manageaccounts' : function ()
	{
		// Parameters
		var channel = Cloudwalkers.Session.getChannel ('news');
		
		var view = new Cloudwalkers.Views.ManageAccounts ({channel: channel});
		Cloudwalkers.RootView.setView (view);
	},

	/**
	 *	Monitoring
	 **/
	'monitoring' : function (id, catid, messageid)
	{	
		var view = new Cloudwalkers.Views.KeywordMonitoring({category: Cloudwalkers.Session.getChannel(Number(catid))});
		var roles = 'MESSAGE_READ_MONITORING';

		this.validate(view, roles);
	},
	
	'managekeywords' : function ()
	{
		var view = new Cloudwalkers.Views.ManageKeywords ();
		var roles = 'CHANNEL_MANAGE_EDIT_MONITORING';

		this.validate(view, roles);
	},
	
	
	/**
	 *	Reports
	 **/

	'reports' : function (streamid)
	{			
		var view = new Cloudwalkers.Views.Reports ({ 'stream' : Cloudwalkers.Session.getStream (Number(streamid)) });
		var roles = 'STATISTICS_VIEW';
		
		if (streamid)	view.subnavclass = 'reports_' + streamid;

		this.validate(view, roles);
	},
	
	
	/**
	 *	Stats (new Reports)
	 **/

	'statistics' : function (streamid)
	{
		var model = Cloudwalkers.Session.getAccount();
		var view = streamid?
			new Cloudwalkers.Views.StatStream({model: model, streamid: streamid}):
			new Cloudwalkers.Views.Statistics({model: model})

		var roles = 'STATISTICS_VIEW';

		this.validate(view, roles);
	},

	
	/**
	 *	Settings
	 **/
	 
	'settings' : function (endpoint, serviceid)
	{	
		var roles;

		if (endpoint == 'users')			roles = 'USER_INVITE';
		if (endpoint == 'services')			roles = 'SERVICE_CONNECT';
		if (endpoint == 'account')			roles = 'CAMPAIGN_DELETE';

		var view = new Cloudwalkers.Views.Settings ({endpoint: endpoint, serviceid: serviceid});

		this.validate(view, roles);
	},
	
	/**
	 *	First-time
	 **/

	'firsttime' : function ()
	{	
		Cloudwalkers.RootView.setView (new Cloudwalkers.Views.Firsttime());
	},
	
	/**
	 *	Co-worker Dashboard
	 **/

	'coworkdashboard' : function ()
	{	
		Cloudwalkers.RootView.setView (new Cloudwalkers.Views.Coworkdashboard());
	},
	/**
	 * Manage User Groups
	 **/
	
	'manageusergroups' : function ()
	{	
		Cloudwalkers.RootView.setView (new Cloudwalkers.Views.ManageUserGroups ());
	},

	/*'checkauth' : function(view)
	{
		if(!Cloudwalkers.Session.getUser().authorized)
			Cloudwalkers.RootView.resync(view);
		else
			window.location = "/";
	},*/	

	'resync' : function(view)
	{
		this.navigate('#resync')
		Cloudwalkers.RootView.setView (new Cloudwalkers.Views.Resync({returnto: view}));
	},

	'home' : function ()
	{	
		$.ajax({ url: config.authurl + "revoke", headers : {
            'Authorization': 'Bearer ' + Cloudwalkers.Session.authenticationtoken,
            'Accept': "application/json"
        },
        success: function()
        {
        	window.location = "/";
        }});
		
		Cloudwalkers.RootView.view.remove();
		Cloudwalkers.RootView.navigation.remove();
		Cloudwalkers.Session.reset();
		
		return false;
	},

	'validate' : function(view, roles)
	{
		//if (!Cloudwalkers.Session.isAuthorized('MESSAGE_READ_DRAFTS'))  return Cloudwalkers.RootView.resync("#drafts");
		//Cloudwalkers.RootView.setView (new Cloudwalkers.Views.Drafts());

		//if(!Cloudwalkers.Session.isupdated())
			//return Cloudwalkers.RootView.resync('#'+Backbone.history.fragment);

		if(Cloudwalkers.Session.isAuthorized && Cloudwalkers.Session.isAuthorized(roles))
			Cloudwalkers.RootView.setView(view)
		else
			this.home();
	},
	
	'exception' : function (errno)
	{ 
		var red = "/";
		
		switch(errno)
		{
			case 401 : red = "/401.html";
			case 503 : red = "/503.html";

			default : window.location = red;
		}
	}

});