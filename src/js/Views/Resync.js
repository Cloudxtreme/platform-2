define(
	['backbone',  'Views/Root', 'Router'],
	function (Backbone, RootView, Router)
	{
		var Resync = Backbone.View.extend({

			className : 'container-loading',

			initialize : function(options)
			{	
				$.extend(this, options);
				
				this.listenTo(Cloudwalkers.Session.user, 'sync', this.activate);
				this.listenToOnce(Cloudwalkers.Session.user, 'activated', this.refresh)
			},	

			render : function ()
			{	
				this.$el.html(Mustache.render(Templates.loading));
			
				this.versioncheck();

				return this;
			},

			updateme : function()
			{
				Store.remove('me');
				Cloudwalkers.Session.user.fetch();
			},

			activate : function(data)
			{	
				var currversion = Cloudwalkers.Session.version;

				Store.write("version", [{version: currversion}]);

				//Force loaded
				Cloudwalkers.Session.localversion = currversion;
				Cloudwalkers.Session.user.activate(data);
			},

			refresh : function()
			{	
				// Reload navigation & stuff
				RootView.navigation.renderHeader();
				RootView.navigation.render();

				Router.Instance.navigate (this.returnto, true);
			},

			//Check type of update necessary - hardcoded "me" refresh
			versioncheck : function(view)
			{	
				/*var localversion = Cloudwalkers.Session.version;
				var currversion = Cloudwalkers.Session.version;
			
				if(localversion && this.parseversion(localversion) < this.parseversion(currversion))
					this.updateme();
				else
					window.location = "/";*/
				
				this.updateme();
				//else									window.location = "/";	
			},

			// Full check, needed now? Maybe for types of content update, according to version difference?
			parseversion : function (version)
			{
			    if (typeof(version) != 'string') { return false; }

			    var x = version.split('.');

			    var a = x[0];
			    var b = x[1];
			    var c = x[2];
			    var d = x[3];

			    return parseInt(a+b+c+d);
			}

		});

		return Resync;
	}
);