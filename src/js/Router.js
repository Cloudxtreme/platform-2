define(
	['backbone', 'Session', 'Views/Root', 'Views/Dashboard', 'Views/Coworkers', 'Views/Inbox', 'Views/Drafts',
	 'Views/Sent', 'Views/Notes', 'Views/Scheduled', /*'Views/Calendar',*/ 'Views/Timeline', 'Views/ManageAccounts', 'Views/KeywordMonitoring',
	 'Views/ManageKeywords', 'Views/StatStream', 'Views/Statistics', 'Views/Settings', 'Views/Firsttime',
	 'Views/Coworkdashboard', /*'Views/ManageUserGroups'*/, 'Views/Resync', 'Views/RSSFeed'/*, 'Views/ManageRSS'*/],

	function (Backbone, Session, RootView, DashboardView, CoworkersView, InboxView, DraftsView, SentView, NotesView, ScheduledViews,
			  /*CalendarView,*/ TimelineView, ManageAccountsView, KeywordMonitoringView, ManageKeywordsView, StatStreamView, StatisticsView,
			  SettingsView, FirsttimeView, CoworkdashboardView, /*ManageUserGroupsView, */ResyncView, RSSFeedView/*, ManageRSSView*/)

	{
		var Router = Backbone.Router.extend (
		{
			routes : {
				'dashboard/:accountid' : 'changeaccount',

				'write' : 'write',
				'share' : 'share',
				'inbox(/:type)(/:streamid)' : 'inbox',
				'drafts' : 'drafts',
				'outbox(/:type)' : 'outbox',
				'notes' : 'notes',
				'scheduled' : 'scheduled',
				//'calendar' : 'calendar',
				'coworkers' : 'coworkers',
				'channel/:channel(/:subchannel)(/:stream)(/:messageid)' : 'channel',
				//'timeline/rss' : 'rssfeed',
				'timeline/:channel(/:stream)' : 'timeline',
				'trending/:channel(/:subchannel)(/:stream)(/:messageid)' : 'trending',
				//'monitoring/managerss' : 'managerss',
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

			initialize : function (){},
			
			/**
			 *	Dashboard
			 **/

			dashboard : function ()
			{	
				//if(!Session.isupdated())
					//return Cloudwalkers.RootView.resync('#dashboard');

				// Check first-timer
				if (Session.getAccount().get("firstTime"))
					 
					return this.navigate("#firsttime", true);
					
				// Coworker level
				if (!Session.isAuthorized('_CW_INBOX_VIEW'))			 
					return this.navigate("#work", true);
				
				
				RootView.setView (new DashboardView());
			},
			
			/**
			 *	Account Switch
			 **/

			changeaccount : function (accountid)
			{	
				if(accountid != Session.get("currentAccount"))
				{
					Session.updateSetting("currentAccount", accountid, {success: this.home.bind(this, true)}); //patch: true
				}
			},
			
			/**
			 *	Message board
			 **/
			 
			
			write : function ()
			{
				//var view = new Cloudwalkers.Views.Write ();
				RootView.compose();
			},
			
			share : function ()
			{
				RootView.viewshare ("general");
			},
			
			/**
			 *	Co-workers wall
			 **/
			 
			coworkers : function ()
			{
				var view = new CoworkersView()
				var roles = '_CW_COWORKERS_VIEW';

				this.validate(view, roles);
			},
			
			
			/**
			 *	Inbox
			 **/
			 
			inbox : function (type, streamid)
			{
				var types = {
					'MESSAGE_READ_INBOX_NOTIFICATIONS' : '#messages/notifications',
					'MESSAGE_READ_INBOX_SCHEDULE' : '#scheduled',
					'MESSAGE_READ_DRAFTS' : '#drafts',
					'ACCOUNT_NOTES_VIEW' : '#notes'
					}

				// "Manual" validation
				//if(!Session.isupdated())
					//return Cloudwalkers.RootView.resync('#'+Backbone.history.fragment);

				var available = _.intersection(_.keys(types), Session.getUser().authorized);

				// Parameters
				var channel = Session.getChannel ('inbox');

				if (!channel)	return this.home();		
				if (!available || !available.length) return this.home();
				if (!type) type = "messages";		
				
				if (!Session.isAuthorized('MESSAGE_READ_INBOX_'+ type.toUpperCase()))
				{
					if(Session.getUser().authorized && available.length)
						return this.navigate(types[available[0]], {trigger: true});
					else 
						window.location = "/";
				}

				RootView.setView (new InboxView({channel: channel, type: type, streamid: streamid}));
			},
			
			drafts : function ()
			{	
				var view = new DraftsView();
				var roles = 'MESSAGE_READ_DRAFTS';

				this.validate(view, roles);
			},

			outbox : function(type)
			{
				if (!type) type = "sent";
				
				var view = new SentView();
				var roles = 'MESSAGE_READ_DRAFTS';

				this.validate(view, roles);
			},

			notes : function ()
			{	
				var view = new NotesView();
				var roles = 'ACCOUNT_NOTES_VIEW';

				this.validate(view, roles);
			},
			
			scheduled : function ()
			{	
				var view = new ScheduledViews();
				var roles = 'MESSAGE_READ_SCHEDULE';

				this.validate(view, roles);
			},
			
			calendar : function ()
			{
				RootView.setView (new CalendarView());
			},
			
			/**
			 * Timeline
			**/
			
			timeline : function (channelid, streamid)
			{	
				// Get model from url
				var model = streamid?
					Session.getStream(Number(streamid)) :
					Session.getChannel(Number(channelid));

				var id = streamid? streamid: channelid;

				var account = Session.getAccount ();
				var news = account.channels.findWhere({type: "news"})? account.channels.findWhere({type: "news"}).id: null;
				var profiles = account.channels.findWhere({type: "profiles"})? account.channels.findWhere({type: "profiles"}).id: null;

				var type =  channelid == profiles? 'company' : 'thirdparty';
				var showcontact = type == 'thirdparty';
				
				var view =new TimelineView({model: model, showcontact: showcontact, parameters: {records: 40, markasread: true}})
				var roles = type == 'MESSAGE_READ_'+type.toUpperCase();

				this.validate(view, roles);
			},
			
			/**
			 * Trending
			**/
			
			trending : function (channelid, streamid)
			{

				// Get model from url
				var channel = Session.getChannel(Number(channelid));
				var model = streamid? Session.getStream(Number(streamid)): channel;
					
				// Parameters
				var span = channel.get('type') == "news"? 1: 7;
				var params = {
					since: Math.round(Date.now()/3600000) *3600 - 86400 *span,
					sort: 'engagement',
					records: 40,
					markasread: true
				}

				var id = streamid? streamid: channelid;		

				var view = new TimelineView({model: model, trending: true, parameters: params});
				var roles = 'MESSAGE_READ_THIRDPARTY';

				this.validate(view, roles);
			},
			
			manageaccounts : function ()
			{
				// Parameters
				var channel = Session.getChannel ('news');
				
				var view = new ManageAccountsView ({channel: channel});
				RootView.setView (view);
			},

			/**
			 *	Monitoring
			 **/
			monitoring : function (id, catid, messageid)
			{	
				var view = new KeywordMonitoringView({category: Session.getChannel(Number(catid))});
				var roles = 'MESSAGE_READ_MONITORING';

				this.validate(view, roles);
			},
			
			managekeywords : function ()
			{
				var view = new ManageKeywordsView ();
				var roles = 'CHANNEL_MANAGE_EDIT_MONITORING';

				this.validate(view, roles);
			},
			
			
			/**
			 *	Reports
			 **/

			reports : function (streamid)
			{			
				var view = new ReportsView ({ 'stream' : Session.getStream (Number(streamid)) });
				var roles = 'STATISTICS_VIEW';
				
				if (streamid)	view.subnavclass = 'reports_' + streamid;

				this.validate(view, roles);
			},
			
			
			/**
			 *	Stats (new Reports)
			 **/

			statistics : function (streamid)
			{
				var model = Session.getAccount();
				var view = streamid?
					new StatStreamView({model: model, streamid: streamid}):
					new StatisticsView({model: model})

				var roles = 'STATISTICS_VIEW';

				this.validate(view, roles);
			},

			
			/**
			 *	Settings
			 **/
			 
			settings : function (endpoint, serviceid)
			{	
				var roles;

				if (endpoint == 'users')			roles = 'USER_INVITE';
				if (endpoint == 'services')			roles = 'SERVICE_CONNECT';
				if (endpoint == 'account')			roles = 'CAMPAIGN_DELETE';

				var view = new SettingsView ({endpoint: endpoint, serviceid: serviceid});

				this.validate(view, roles);
			},
			
			/**
			 *	First-time
			 **/

			firsttime : function ()
			{	
				RootView.setView (new FirsttimeView());
			},
			
			/**
			 *	Co-worker Dashboard
			 **/

			coworkdashboard : function ()
			{	
				RootView.setView (new CoworkdashboardView());
			},
			/**
			 * Manage User Groups
			 **/
			
			manageusergroups : function ()
			{	
				RootView.setView (new ManageUserGroupsView ());
			},

			/*'checkauth' : function(view)
			{
				if(!Session.getUser().authorized)
					Cloudwalkers.RootView.resync(view);
				else
					window.location = "/";
			},*/	

			resync : function(view)
			{
				this.navigate('#resync')
				RootView.setView (new ResyncView({returnto: view}));
			},

			home : function (changeaccount)
			{	
				if(!changeaccount){

					$.ajax({ url: config.authurl + "revoke", headers : {
			            'Authorization': 'Bearer ' + Session.authenticationtoken,
			            'Accept': "application/json"
			        },
			        success: function()
			        {
			        	window.location = "/";
			        }});
				}else{
					window.location = "/";
				}
				
				RootView.view.remove();
				RootView.navigation.remove();
				Session.reset(changeaccount);
				
				return false;
			},

			validate : function(view, roles)
			{
				//if (!Session.isAuthorized('MESSAGE_READ_DRAFTS'))  return Cloudwalkers.RootView.resync("#drafts");
				//Cloudwalkers.RootView.setView (new DraftsView());

				//if(!Session.isupdated())
					//return Cloudwalkers.RootView.resync('#'+Backbone.history.fragment);

				if(Session.isAuthorized && Session.isAuthorized(roles))
					RootView.setView(view)
				else
					this.home();
			},
			
			exception : function (errno)
			{ 
				var red = "/";
				
				switch(errno)
				{
					case 401 : red = "/401.html";
					case 503 : red = "/503.html";

					default : window.location = red;
				}
			},

			rssfeed : function()
			{
				RootView.setView (new RSSFeedView());
			},

			managerss : function()
			{
				console.log("Manage RSS")
				RootView.setView (new ManageRSSView());
			}

		});
	
		return Router;
	}
);