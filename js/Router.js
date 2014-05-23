Cloudwalkers.Router = Backbone.Router.extend ({

	'routes' : {
		
		'demo(/:demotype)' : 'demo',
		
		'write' : 'write',
		'share' : 'share',
		'inbox(/:type)(/:streamid)' : 'inbox',
		'drafts' : 'drafts',
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
		'reports' : 'statistics',
		'settings(/:sub)' : 'settings',
		'firsttime' : 'firsttime',
		'work' : 'coworkdashboard',
		'dashboard/:accountid' : 'changeaccount',
		'home' : 'home',
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
		// Check first-timer
		if (Cloudwalkers.Session.getAccount().get("firstTime"))
			 
			return this.navigate("#firsttime", true);
			
		// Check administrator level
		if (!Cloudwalkers.Session.getAccount().get('currentuser').level)
			 
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
		Cloudwalkers.RootView.setView (new Cloudwalkers.Views.Coworkers());
	},
	
	
	/**
	 *	Inbox
	 **/
	 
	 'inbox' : function (type, streamid)
	{
		// Parameters
		var channel = Cloudwalkers.Session.getChannel ('inbox');
		
		if (!channel) return this.home();
		if (!type) type = "messages";
		
		// Visualisation
		Cloudwalkers.RootView.setView (new Cloudwalkers.Views.Inbox({channel: channel, type: type, streamid: streamid}));
	},
	
	'drafts' : function ()
	{
		Cloudwalkers.RootView.setView (new Cloudwalkers.Views.Drafts());
	},
	
	'scheduled' : function ()
	{
		Cloudwalkers.RootView.setView (new Cloudwalkers.Views.Scheduled());
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

		// Visualisation
		Cloudwalkers.RootView.setView (new Cloudwalkers.Views.Timeline({model: model, parameters: {records: 40, markasread: true}}));
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

		// Visualisation
		Cloudwalkers.RootView.setView (new Cloudwalkers.Views.Timeline({model: model, trending: true, parameters: params}));
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
		Cloudwalkers.RootView.setView (new Cloudwalkers.Views.KeywordMonitoring({category: Cloudwalkers.Session.getChannel(Number(catid))}));	
	},
	
	'managekeywords' : function ()
	{
		var view = new Cloudwalkers.Views.ManageKeywords ();
		Cloudwalkers.RootView.setView (view);
	},
	
	
	/**
	 *	Reports
	 **/

	'reports' : function (streamid)
	{
		
		var view = new Cloudwalkers.Views.Reports ({ 'stream' : Cloudwalkers.Session.getStream (Number(streamid)) });

		if (streamid)
		{
			view.subnavclass = 'reports_' + streamid;
		}

		Cloudwalkers.RootView.setView (view);
	},
	
	
	/**
	 *	Stats (new Reports)
	 **/

	'statistics' : function (streamid)
	{
		
		var model = streamid?	Cloudwalkers.Session.getStream(Number(streamid)) :
								Cloudwalkers.Session.getAccount();
		
		Cloudwalkers.RootView.setView (new Cloudwalkers.Views.Statistics({model: model}));
		
		/*var view = new Cloudwalkers.Views.Reports ({ 'stream' : Cloudwalkers.Session.getStream (streamid) });

		if (streamid)
		{
			view.subnavclass = 'reports_' + streamid;
		}

		Cloudwalkers.RootView.setView (view);*/
		
	},

	
	/**
	 *	Settings
	 **/
	 
	'settings' : function (endpoint)
	{
		
		var view = new Cloudwalkers.Views.Settings ({endpoint: endpoint});
		Cloudwalkers.RootView.setView (view);
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
	

	'home' : function ()
	{
		Cloudwalkers.Session.reset();
		window.location = "/";
		
		return false;
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