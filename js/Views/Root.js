Cloudwalkers.Views.Root = Backbone.View.extend({

	'view' : null,

	'header' : null,
	'footer' : null,

	'initialize' : function ()
	{
		var self = this;

		this.bind ('view:change', this.render, this);

		this.header = new Cloudwalkers.Views.Header ();

		$('#header').html (this.header.render ().el);

		this.on ('content:change', function ()
		{
			self.onchange ();
		});

		$('.add-button').click (this.writeMessage);

		Cloudwalkers.Session.on ('account:change', function (account) { self.setAccount (account); } );
	},

	'render' : function ()
	{
		$('#inner-content').html (this.view.render ().el);
	},

	'setView' : function (view, showMenu)
	{
		var self = this;

		if (this.view)
		{
			this.view.trigger ('destroy');
		}

		if (typeof (showMenu) == 'undefined')
		{
			showMenu = true;
		}

		$('#header').toggle (showMenu);
		$('#footer').toggle (showMenu);

		this.view = view;

		$('.page-sidebar-menu li').removeClass ('active');
		$('.page-sidebar-menu .' + this.view.navclass).addClass ('active');

		this.view.on ('content:change', function () { self.trigger ('content:change'); });

		setTimeout (function ()
		{
			self.trigger ('view:change');
			self.trigger ('content:change');
		}, 1);
	},

	'popup' : function (view)
	{
		var self = this;

		$.fancybox
		(
			'<p>Please wait, we are loading your content.</p>',
			{
				content : view.render ().el,
				padding: 0,
				cyclic: false,
				overlayShow: true,
				overlayOpacity: 0.4,
				overlayColor: '#000000',
				titlePosition: 'inside',
				onComplete : function ()
				{
					self.trigger ('content:change');
				}
			}
		);

		view.on ('popup:close', function ()
		{
			$.fancybox.close ();
		});

		view.on ('content:change', function ()
		{
			self.trigger ('content:change');
		});
	},

	'writeMessage' : function (e)
	{
		e.preventDefault ();
		Cloudwalkers.RootView.popup (new Cloudwalkers.Views.Write ());
	},

	'editMessage' : function (model)
	{
		//Cloudwalkers.RootView.popup (new Cloudwalkers.Views.Write ({ 'model' : model.clone () }));
		this.setView (new Cloudwalkers.Views.Write ({ 'model' : model.clone () }));
	},

	'shareMessage' : function (model)
	{
		//Cloudwalkers.RootView.popup (new Cloudwalkers.Views.Write ({ 'model' : model.clone (), 'clone' : true }));
		this.setView (new Cloudwalkers.Views.Write ({ 'model' : model.clone (), 'clone' : true }));
	},

	'setAccount' : function (account)
	{
		// Redo navigation
		var data = {};
		var channels = account.channels ();

		data.channels = [];
		for (var i = 0; i < channels.length; i ++)
		{
			var obj = channels[i];
			obj.channelid = channels[i].id;
			data.channels.push (obj);
		}

		data.scheduledstreams = account.streams ( { 'outgoing' : true });

		//console.log (data);

		$('.navigation-container').html (Mustache.render(Templates.navigation, data))

		// Set user
		$('.dropdown.user img.avatar').attr ('src', Cloudwalkers.Session.getUser ().get ('avatar'));
		$('.dropdown.user .username').html (Cloudwalkers.Session.getUser ().get ('name'));
	},

	'confirm' : function (message, callback)
	{
		if (confirm (message))
		{
			callback ();
		}
	},

	'updatePlaceholder' : function ()
	{
		if(!Modernizr.input.placeholder){

			$('[placeholder]').focus(function() {
			  var input = $(this);
			  if (input.val() == input.attr('placeholder')) {
				input.val('');
				input.removeClass('placeholder');
			  }
			}).blur(function() {
			  var input = $(this);
			  if (input.val() == '' || input.val() == input.attr('placeholder')) {
				input.addClass('placeholder');
				input.val(input.attr('placeholder'));
			  }
			}).blur();
			$('[placeholder]').parents('form').submit(function() {
			  $(this).find('[placeholder]').each(function() {
				var input = $(this);
				if (input.val() == input.attr('placeholder')) {
				  input.val('');
				}
			  })
			});
		}
	},

	'imagePopups' : function ()
	{
		$('a.image-popup-viewer').fancybox ();
	},

	'onchange': function ()
	{
		var self = this;

		/*

		setTimeout (function ()
		{
			jcf.customForms.replaceAll();
			self.imagePopups ();
		}, 1);
		*/

		this.updatePlaceholder ();
	}

});