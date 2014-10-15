define(	
	['backbone', 'Models/Me', 'moment', 'Utilities/Polyglot'],
	function (Backbone, Me, moment, Polyglot)
	{
		var Session = 
		{
			user : null,

			isLoaded : function ()
			{
				return this.user != null;
			},
			
			loadEssentialData : function (callback)
			{	
				this.user = new Me();
				//this.getversion();

				//getLang and then callback
				this.user.once("activated", function ()
				{	
					// Save account language
					this.lang = this.user.attributes.locale;

					// Translations
					Cloudwalkers.Polyglot = Polyglot.init({lang: this.lang });

					trans = Cloudwalkers.Polyglot.trans;

					this.listenTo(Cloudwalkers.Polyglot, 'translations:done', callback);

				}.bind(this));
				
				this.user.fetch({error: this.user.offline.bind(this.user)});
			},
			
			reset : function (changeaccount)
			{	
				var token;

				if(changeaccount)
					token = window.localStorage.getItem('token');
				
				window.localStorage.clear();

				if(changeaccount && token)
					window.localStorage.setItem('token', token);
				
			},
			
			home : function()
			{
				Cloudwalkers.Router.home();	
			},
			
			/**
			 *	Session settings functions
			 **/
			
			updateSetting : function(attribute, value, callbacks)
			{
				
				if( Cloudwalkers.Session.user.attributes.settings[attribute] != value)
				{
					// Update session and save on user
					Cloudwalkers.Session.user.attributes.settings[attribute] = value;
					
					callbacks = ($.extend(callbacks, {patch: true}) || {patch: true});
					
					Cloudwalkers.Session.user.save({settings: Cloudwalkers.Session.user.attributes.settings}, callbacks);
				}
			},
			
			get : function(attribute)
			{
				// Update session
				return this.user.get("settings")[attribute];
			},
			
			clone : function(obj)
			{
				if(obj == null || typeof(obj) != 'object') return obj;
				
				var output = obj.constructor();
				
				for (var key in obj)
					output[key] = this.clone(obj[key]);
				
				return output;
			},
			
			viewsettings : function(value, content)
			{
				// Split into accounts
				var pointer = "account_" + this.getAccount().id;
				
				if(!Cloudwalkers.Session.user.attributes.settings.viewsettings)
					Cloudwalkers.Session.user.attributes.settings.viewsettings = {};
				
				if(!Cloudwalkers.Session.user.attributes.settings.viewsettings[pointer])
					Cloudwalkers.Session.user.attributes.settings.viewsettings[pointer] = Cloudwalkers.RootView.navigation.mapViews();

				// Sent hack to add the object
				if(value == 'sent' && !Cloudwalkers.Session.user.attributes.settings.viewsettings[pointer].sent)
					Cloudwalkers.Session.user.attributes.settings.viewsettings[pointer].sent = {streams: []};

				// Timeline hack to add the object
				if(value == 'profiles' && !Cloudwalkers.Session.user.attributes.settings.viewsettings[pointer].profiles)
					Cloudwalkers.Session.user.attributes.settings.viewsettings[pointer].profiles = {streams: []};

				// Timeline hack to add the object
				if(value == 'news' && !Cloudwalkers.Session.user.attributes.settings.viewsettings[pointer].news)
					Cloudwalkers.Session.user.attributes.settings.viewsettings[pointer].news = {streams: []};
				
				var viewsettings = this.clone(this.get("viewsettings"));
				
				if(!content) return viewsettings[pointer][value];
				
				else if(value && content)
				{
					viewsettings[pointer][value] = $.extend(viewsettings[pointer][value], content);
					this.updateSetting("viewsettings", viewsettings);
					
					return viewsettings[pointer][value];
				
				} else throw TypeError ("Not the right parameters were met for function viewsettings");
			},
			
			/**
			 *	Manage storage
			 **/

			manage : function ()
			{

				// Limit messages
				
				var messagecount = Store.count("messages");
				
				// MIGRATION -> temporatily comment due to ping "complications"
				/*if(messagecount > 200)
					Store.filter("messages", null, function(list)
					{
						// Sort list timestamp ASC
						list.sort(function (a, b) {
							if (a.stamp > b.stamp) return 1;
							if (a.stamp < b.stamp) return -1;
							return 0;
						});
						
						// Save newest, remove oldest
						list = list.slice(0, 100);
						Store.write("messages", list);
						
						// Clean touch id-lists
						Store.filter("touches", null, function(list)
						{
							var cursor = Cloudwalkers.Session.getPing().cursor;
							
							list = list.filter(function(touch){ return touch.ping == cursor; });
							
							Store.write("touches", list);
						});
					});
				*/
					
				// Limit reports
				
				var reportcount = Store.count("reports");
				
				if(reportcount > 25)
					Store.filter("reports", null, function(list)
					{
						// Sort list timestamp ASC
						list.sort(function (a, b) {
							if (a.stamp > b.stamp) return 1;
							if (a.stamp < b.stamp) return -1;
							return 0;
						});
						
						// Save newest, remove oldest
						list = list.slice(0, 10);
						Store.write("messages", list);
					});

			},


			/**
			 *	Role permissions
			 *  Checks for permission or returns the authorized list
			 **/

			isAuthorized : function(actions)	
			{	
				if (!this.user)	return false;

				return (actions)? this.user.isauthorized(actions): this.user.authorized;
			},

			/* 	Generate permission tokens for templates */
			censuretemplate : function(data)
			{
				if(!data)		data = {};
				if(!this.user)	return data;

				var authorized = this.user.censuretokens;		

				data.authorized = authorized;
			},
			
			/**
			 *	Ping shortcut function
			 **/

			getPing : function ()
			{
				return this.user.account.ping;
			},
			
			ping : function ()
			{
				this.user.account.ping.forceping();
			},
			
			/**
			 *	Accounts shortcut functions
			 **/

			getAccount : function (id)
			{
				return (id)? this.user.accounts.get(id):  this.user.account;
			},

			

			getAccounts : function (id)
			{
				return this.user.accounts;
			},
			
			/**
			 *	Channels shortcut functions
			 **/
			
			getChannel : function (id)
			{
				return (typeof id == "number")? this.user.account.channels.get(id): this.user.account.channels.findWhere({type: id});
			},
			
			getChannels : function (id)
			{
				return this.user.account.channels;
			},
			
			storeChannel : function(channel)
			{
				// Store child channels
				if( channel.channels && channel.channels.length)
					channel.channels = channel.channels.map(function(el)
					{ 
						Cloudwalkers.Session.storeChannel(el);
						return el.id;
					});
				
				// Store child streams
				if( channel.streams && channel.streams.length)
					channel.streams = channel.streams.map(function(el)
					{ 
						Store.post("streams", el);
						return el.id;
					});
					
				Store.post("channels", channel);
			},
			
			
			
			/**
			 *	Streams shortcut functions
			 **/
			
			getStream : function (id)
			{
				return (typeof id == "number")?  this.user.account.streams.get (id):  this.user.account.streams.findWhere({token: id});
			},
			
			getStreams : function ()
			{
				return this.user.account.streams;
			},

			addStream : function(stream)
			{
				return this.user.account.streams.add(stream);
			},	
			
			/**
			 *	Users shortcut functions
			 **/
			
			getUser : function (id)
			{
				return (id)? this.user.account.users.get (id):  this.user;
			},
			
			getUsers : function ()
			{
				return this.user.account.users;
			},
			
			/**
			 *	Contacts shortcut functions
			 **/
			
			getContact : function (id)
			{
				return this.user.account.contacts.get (id);
			},
			
			getContacts : function ()
			{
				return this.user.account.contacts;
			},
			
			/**
			 *	Messages shortcut functions
			 **/
			
			getMessage : function (id)
			{
				return this.user.account.messages.get (id);
			},
			
			getMessages : function ()
			{
				return this.user.account.messages;
			},

			/**
			 *	Messages shortcut functions
			 **/
			
			getCannedResponse : function (id)
			{
				return this.user.account.cannedresponses.get(id);
			},
			

			getCannedResponses : function ()
			{
				return this.user.account.cannedresponses;
			},
			
			
			/**
			 *	Notifications shortcut functions
			 **/
			
			getNotification : function (id)
			{
				return this.user.account.notifications.get (id);
			},
			
			getNotifications : function ()
			{
				return this.user.account.notifications;
			},
			
			/**
			 *	Statistics shortcut functions
			 **/
			
			getStatistic : function (id)
			{
				return this.user.account.statistics.get (id);
			},
			
			getStatistics : function ()
			{
				return this.user.account.statistics;
			},
			
			/**
			 *	Reports shortcut functions
			 *	Deprectated?
			 **/
			
			getReport : function (id)
			{
				return this.user.account.reports.get (id);
			},
			
			getReports : function ()
			{
				return this.user.account.reports;
			},
			
			/**
			 *	Messages shortcut functions - deprecated
			 **/
			
			getComment : function (id)
			{
				return this.user.account.comments.get (id);
			},
			
			getComments : function ()
			{
				return this.user.account.comments;
			},

			/*
			 * Responsible for translating data.
			 */
			/*translate : function(translatedata)
			{
				if(this.polyglot)	return this.polyglot.t(translatedata);
				else				return translatedata;	
			},

			/*
			 * Responsible for translating template/mustache data.
			 */
			/*translatetemplate : function()
			{
				return function(string, render) {
				    return render(this.translate(string));
				}.bind(this);
			},

			/* setLang - get default language 
			setLang : function(callback)
			{
				var lang = this.user.attributes.locale;
				var extendLang;

				if(lang){
					this.language = lang;
					this.trigger("setlang:done");
				}
					
				/*
				moment.locale(lang);
				
				extendLang = new PolyglotUtil();
				extendLang.fetch({
					success: function (){
						this.translationLang = extendLang.get("translation");
						this.polyglot = new Polyglot({phrases: this.translationLang});
						this.trigger("setlang:done");
					}.bind(this),

					error: function (){ this.trigger("setlang:done"); }.bind(this)
				});

				// Trigger independantly of success or fail of translations
			}*/

			
			/* DEPRECATED
			refresh : function ()
			{
				
				console.log("Cloudwalkers.Session.refresh triggered")
				
				//this.getAccount ().refresh (function ()
				//{
				//	Cloudwalkers.Session.trigger ('channels:change');
				//});
			},
	
			'updateSettings' : function(user)
			{
				// Hack: solve array issue
				if(user && user.get("settings").length === 0) return null;
				
				
				
				//$.extend(Cloudwalkers.Session.settings, user.get("settings"));
			},

			getversion : function()
			{	
				Store.get("version", null, function(version)
				{	
					if(version)	this.localversion = version.version;	//Really need to validate this as a valid version, or we will get loops		
				}.bind(this));
			},
			
			// Simple check, full check is in resync.js
			isupdated : function()
			{	
				return this.localversion? this.localversion == this.version: false;
			},

			'setChannels' : function (list)
			{
				if(list && list.length) this.user.account.channels.add(list, {merge: true});
				
				return this;
			},

			'setStreams' : function (list)
			{
				if(list && list.length) this.user.account.streams.add(list, {merge: true});
				
				return this;
			},

			*/
		}

		// Add events
		_.extend(Session, Backbone.Events);

		return Session;
	});
