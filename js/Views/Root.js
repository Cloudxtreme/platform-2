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

		/*

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
*/
		var tmpl = [
		// tabindex is required for focus
		'<div class="modal hide fade" tabindex="-1">',
			'<div class="modal-header">',
				'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>',
			'</div>',
			'<div class="modal-body modalcontainer">',
				'<p>Please wait, we are loading your content</p>',
			'</div>',
			'<div class="modal-footer">',
			'</div>',
		'</div>'
		].join('');
		
		var modal = $(tmpl).modal();
		modal.find ('.modalcontainer').html (view.render ().el);

		view.on ('popup:close', function ()
		{
			modal.modal ('hide');
		});

		view.on ('content:change', function ()
		{
			self.trigger ('content:change');
		});
	},

	'writeMessage' : function (e)
	{
		e.preventDefault ();
		//Cloudwalkers.RootView.popup (new Cloudwalkers.Views.Write ());
		this.setView (new Cloudwalkers.Views.Write ());
	},

	'editMessage' : function (model)
	{
		//Cloudwalkers.RootView.popup (new Cloudwalkers.Views.Write ({ 'model' : model.clone () }));
		this.setView (new Cloudwalkers.Views.Write ({ 'model' : model.clone () }));
	},

	'writeDialog' : function (model, action)
	{
		this.popup
		(
			new Cloudwalkers.Views.Write 
			(
				{ 
					'model' : model.clone (), 
					'clone' : true, 
					'actionparameters' : action.parameters 
				}
			)
		);
	},

	'shareMessage' : function (model)
	{
		//Cloudwalkers.RootView.popup (new Cloudwalkers.Views.Write ({ 'model' : model.clone (), 'clone' : true }));
		this.popup (new Cloudwalkers.Views.Write ({ 'model' : model.clone (), 'clone' : true }));
	},

	'translateMenuIcon' : function (channel)
	{
		if (channel.type == 'news')
		{
			return 'globe';
		}

		else if (channel.type == 'profiles')
		{
			return 'briefcase';
		}

		else if (channel.type == 'inbox')
		{
			return 'inbox';
		}

		else if (channel.type == 'monitoring')
		{
			return 'tags';
		}

		return channel.type;
	},

	'setAccount' : function (account)
	{
		// Redo navigation
		var data = {};
		var channels = account.channels ();

		var sortedchannels = {};

		data.channels = [];
		for (var i = 0; i < channels.length; i ++)
		{
			var obj = channels[i];
			obj.channelid = channels[i].id;

			obj.icon = this.translateMenuIcon (channels[i]);

			data.channels.push (obj);

			// Sort on type
			if (typeof (sortedchannels[obj.type]) == 'undefined')
			{
				sortedchannels[obj.type] = [];	
			}
			sortedchannels[obj.type].push (obj);
		}
		data.sortedchannels = sortedchannels;

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