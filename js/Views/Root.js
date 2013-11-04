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
		Cloudwalkers.Session.on ('channels:change', function () { self.renderNavigation (); } );
	},

	'render' : function ()
	{
		$('#inner-content').html (this.view.render ().el);
		
		this.handleSidebarMenu();
		
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

		this.view = view;
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
		var tmpl = Templates.uipopup;
		
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
		this.setView (new Cloudwalkers.Views.Write ({ 'redirect' : false }));
	},

	'editMessage' : function (model)
	{
		Cloudwalkers.RootView.popup (new Cloudwalkers.Views.Write ({ 'model' : model.clone (), 'redirect' : false }));
		//this.setView (new Cloudwalkers.Views.Write ({ 'model' : model.clone () }));
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
					'actionparameters' : action.parameters,
					'redirect' : false
				}
			)
		);
	},

	'shareMessage' : function (model)
	{
		//Cloudwalkers.RootView.popup (new Cloudwalkers.Views.Write ({ 'model' : model.clone (), 'clone' : true }));
		this.popup (new Cloudwalkers.Views.Write ({ 'model' : model.clone (), 'clone' : true, 'redirect' : false }));
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
		function navAddAccount (a)
		{
			$('<li class="account-selector"><a href="javascript:void(0);"><i class="icon-star"></i> ' + a.get ('name') + '</a></li>')
				.prependTo ($('.dropdown.user ul'))
				.addClass (account.get ('id') == a.get ('id') ? 'active' : null)
				.find ('a').click (function ()
				{
					Cloudwalkers.Session.setAccount (a);
					Cloudwalkers.Router.Instance.navigate ('dashboard/' + a.get ('id'), { 'trigger' : true });
				}
			);
		}

		function setUnreadCount (newnumber)
		{
			if (newnumber > 0)
			{
				$('.unread-messages-count').html (newnumber).show ();
			}
			else
			{
				$('.unread-messages-count').html (0).hide ();	
			}
		}

		// New messages
		Cloudwalkers.Session.getUser ().on ('change:unread', function (newnumber)
		{
			setUnreadCount (newnumber);
		});

		// Set accounts
		var accounts = Cloudwalkers.Session.getUser ().getAccounts ();

		$('.dropdown.user li.account-selector').remove ();
		$('.dropdown.user ul').prepend ('<li class="account-selector divider"></li>');
		for (var i = accounts.length - 1; i >= 0; i --)
		{
			navAddAccount (accounts[i]);
		}

		setUnreadCount (Cloudwalkers.Session.getUser ().countUnreadMessages ());

		// Set user
		$('.dropdown.user img.avatar').attr ('src', Cloudwalkers.Session.getUser ().get ('avatar'));
		$('.dropdown.user .username').html (Cloudwalkers.Session.getUser ().get ('name'));

		this.renderNavigation ();
	},

	'renderNavigation' : function ()
	{
		var account = Cloudwalkers.Session.getAccount ();

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

		data.statisticchannels = [];
		jQuery.each (account.statisticchannels (), function (i, v)
		{
			data.statisticchannels.push (v.attributes);
		});

		data.scheduledstreams = [];
		jQuery.each (account.streams ( { 'outgoing' : true } ), function (i, v)
		{
			data.scheduledstreams.push (v.attributes);
		});
		
		// Remove all empty second level channels
		if (typeof (data.sortedchannels.monitoring) != 'undefined')
		{
			for (var i = 0; i < data.sortedchannels.monitoring.length; i ++)
			{
				var toremove = [];
				for (var j = 0; j < data.sortedchannels.monitoring[i].channels.length; j ++)
				{
					if (data.sortedchannels.monitoring[i].channels[j].channels.length == 0)
					{
						//data.sortedchannels.monitoring[i].channels.splice (i, 1);
						toremove.push (data.sortedchannels.monitoring[i].channels[j]);
					}
				}

				for (var k = 0; k < toremove.length; k ++)
				{
					data.sortedchannels.monitoring[i].channels.splice 
					(
						data.sortedchannels.monitoring[i].channels.indexOf (toremove[k]), 
						1
					);
				}
			}
		}

		$('.navigation-container').html (Mustache.render(Templates.navigation, data))
		
		//this.handleSidebarMenu();
	},
	
	'handleSidebarMenu' : function () {
		
		$('#sidebar .active').removeClass ('active');
		$('a[href="#' + Backbone.history.fragment + '"]').parents('#sidebar > ul *').addClass ('active');
		
		//if(this.view.navclass)
		//	$(').addClass ('active');
		
		/*$('.page-sidebar-menu li').removeClass ('active');
		$('.page-sidebar-menu li.' + this.view.navclass).addClass ('active');

		if (typeof (this.view.subnavclass) != 'undefined')
		{
			$('.page-sidebar-menu li ul li.' + this.view.subnavclass).addClass ('active');
		}

		if (typeof (this.view.subsubnavclass) != 'undefined')
		{
			//console.log (this.view.subsubnavclass);
			$('.page-sidebar-menu li ul li ul li.' + this.view.subsubnavclass).addClass ('active');
		}*/

    },
	
	'handleSidebarMenu_old' : function () {
         
        jQuery('.page-sidebar').on('click', 'li > a', function (e) {
                
                if ($(this).next().hasClass('sub-menu') == false) {
                    if ($('.btn-navbar').hasClass('collapsed') == false) {
                        $('.btn-navbar').click();
                    }
                    
                    if ($(this).parent().parent().hasClass('sub-menu') == false) {
                    	$('.page-sidebar .sub-menu').slideUp(200);
                    	$('.page-sidebar .open').removeClass('open');
                    }
                    
                    return;
                }

                var parent = $(this).parent().parent();
				
                parent.children('li.open').children('a').children('.arrow').removeClass('open');
                parent.children('li.open').children('.sub-menu').slideUp(200);
                parent.children('li.open').removeClass('open');

                var sub = jQuery(this).next();
                if (sub.is(":visible")) {
                    jQuery('.arrow', jQuery(this)).removeClass("open");
                    jQuery(this).parent().removeClass("open");
                    sub.slideUp(200/*, function () {
                            handleSidebarAndContentHeight();
                        }*/);
                } else {
                    jQuery('.arrow', jQuery(this)).addClass("open");
                    jQuery(this).parent().addClass("open");
                    sub.slideDown(200/*, function () {
                            handleSidebarAndContentHeight();
                        }*/);
                }

                e.preventDefault();
            });

        // handle ajax links
        jQuery('.page-sidebar').on('click', ' li > a.ajaxify', function (e) {
                e.preventDefault();
                App.scrollTop();

                var url = $(this).attr("href");
                var menuContainer = jQuery('.page-sidebar ul');
                var pageContent = $('.page-content');
                var pageContentBody = $('.page-content .page-content-body');

                menuContainer.children('li.active').removeClass('active');
                menuContainer.children('arrow.open').removeClass('open');

                $(this).parents('li').each(function () {
                        $(this).addClass('active');
                        $(this).children('a > span.arrow').addClass('open');
                    });
                $(this).parents('li').addClass('active');

                App.blockUI(pageContent, false);

                $.post(url, {}, function (res) {
                        App.unblockUI(pageContent);
                        pageContentBody.html(res);
                        App.fixContentHeight(); // fix content height
                        App.initUniform(); // initialize uniform elements
                    });
            });
    },

	'confirm' : function (message, callback)
	{
		var data = {};

		data.message = message;
		data.options = [
			{
				'token' : 'confirm',
				'label' : 'Yes',
				'description' : 'Confirm your action'
			}
		];

		var tmpl = Mustache.render (Templates.uiconfirm, data);

		var element = $(tmpl);
		var modal = element.modal();

		element.find ('[data-response=confirm]').click (function ()
		{
			callback ();
			modal.modal ('hide');
		});
	},

	'alert' : function (message, callback)
	{
		var data = {};

		data.message = message;

		var tmpl = Mustache.render (Templates.uiconfirm, data);

		var element = $(tmpl);
		var modal = element.modal();

		element.find ('[data-response=confirm]').click (function ()
		{
			callback ();
			modal.modal ('hide');
		});
	},

	'dialog' : function (message, options, callback)
	{
		var data = {};

		data.message = message;
		data.options = options;

		var tmpl = Mustache.render (Templates.uidialog, data);

		var element = $(tmpl);
		var modal = element.modal();

		var addevent = function (option)
		{
			element.find ('[data-response=' + option.token + ']').click (function ()
			{
				callback (option);
				modal.modal ('hide');
			});
		}

		for (var i = 0; i < options.length; i ++)
		{
			addevent (options[i]);
		}
	},

	/*'updatePlaceholder' : function ()
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
	},*/

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

		//this.updatePlaceholder ();
	}
});
/*
	<<<<<<< .mine
});
=======
    'lockUI' : function ()
    {
        App.blockUI($('.page-content'), false);
    },

    'releaseUI' : function ()
    {
        App.unblockUI($('.page-content'));
    }
});>>>>>>> .r2136

	
*/