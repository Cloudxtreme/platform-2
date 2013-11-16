Cloudwalkers.Views.Settings.Container = Backbone.View.extend({

	'events' : {

	},

	'navclass' : 'settings',
	'action' : null,

	'setAction' : function (action)
	{
		this.action = action;
	},

	'render' : function ()
	{
		var self = this;
		var data = {};
		var account = Cloudwalkers.Session.getAccount ();
		
		data.level = Number(account.attributes.currentuser.level);
		
		// Initiate tabs
		data.tabs = [];
		
		data.tabs.push ({
			'url' : '#settings/profile',
			'name' : 'Profile settings',
			'active' : this.action == 'profile'
		});

		if(data.level)
		{
			data.tabs.push ({
				'url' : '#settings/users',
				'name' : 'Manage users',
				'active' : this.action == 'users'
			});
	
			data.tabs.push ({
				'url' : '#settings/services',
				'name' : 'Social connections',
				'active' : this.action == 'services'
			});
	
			data.tabs.push ({
				'url' : '#settings/account',
				'name' : 'Account settings',
				'active' : this.action == 'account'
			});
		}

		// Render
		self.$el.html (Mustache.render (Templates.settings.container, data));

		var view;
		if (this.action == 'profile')
		{
			view = new Cloudwalkers.Views.Settings.Profile ();
		}

		else if (this.action == 'users')
		{
			view = new Cloudwalkers.Views.Settings.Users ();
		}

		else if (this.action == 'services')
		{
			view = new Cloudwalkers.Views.Settings.Services ();
		}

		else if (this.action == 'account')
		{
			view = new Cloudwalkers.Views.Settings.Account ();
		}

		else
		{
			view = new Cloudwalkers.Views.Settings.Users ();
			this.action = 'profile';
		}

		// Set correct tab
		this.$el.find ('.nav-tabs li').removeClass ('active');
		this.$el.find ('.nav-tabs li a[href="#settings/'+this.action+'"]').parent ().addClass ('active');

		// Set the view
		this.$el.find ('.tab-content').html (view.render ().el);
		
		return this;
	}
});