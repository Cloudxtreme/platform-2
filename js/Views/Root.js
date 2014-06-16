Cloudwalkers.Views.Root = Backbone.View.extend({

	'view' : null,
	'header' : null,
	'footer' : null,

	'initialize' : function ()
	{
		var self = this;

		// // this.bind ('view:change', this.render, this);

		this.navigation = new Cloudwalkers.Views.Navigation ();
		this.navigation.fit();
		
		//this.share = new Cloudwalkers.Views.Share ();
		//this.share.fit();

		//this.on ('content:change', this.onchange, this);
		$(window).on("resize", this.resize.bind(this));
		
		this.resize();
		
		//$(window).on("resize", this.resize);

		//Cloudwalkers.Session.on("change:first", this.rebuild, this);

		// // $('.add-button').click (this.writeMessage);

		// // Cloudwalkers.Session.on ('account:change', function (account) { self.setAccount (account); } );
		//Cloudwalkers.Session.on ('channels:change', function () { self.renderNavigation (); } );
	},

	'render' : function ()
	{
		// Emergency break
		if(!this.view) return null;
		
		// Do some rendering
		$('#inner-content').html (this.view.render ().el);
		
		// Tell your view
		this.view.$el.trigger("rendered");
		
		// Deprecated!
		if(this.view.finish) this.view.finish();
		
		this.navigation.handleSidebarMenu();
	},

	'setView' : function (view)
	{
		
		if (this.view) this.view.remove();
		Cloudwalkers.Session.trigger('destroy:view');
		
		this.view = view;	
			
		this.render();
		
		Cloudwalkers.Session.manage();

		/*setTimeout (function ()
		{
			self.trigger ('view:change');
			self.trigger ('content:change');
		}, 1);*/
	},
	
	'viewshare' : function ()
	{
		this.share.show();
		
	},
	
	'height' : function (strict)
	{
		var view = $(window).height(); 
		var document = $(document).height();
		
		return (strict)?
			(document > view? document: view): view;
	},
	
	'resize' : function()
	{
		// Trigger resize and catch height
		var height = this.height(true);
		this.trigger("resize", height);
		
		$("#inner-content").css("min-height", height-42 + "px");
	},
	
	'popup_new' : function (view)
	{

		// Parameters
		var content = view.render().el;
		
		var params = {title: view.title, actions: view.actions};
		
		// View
		var modal = $(Mustache.render (Templates.popup, params)).modal();
		modal.find(".modal-body").html(content);
		
		// Actions
		if (view.actions)
			modal.find(".modal-footer [data-action]").on("click", function(popup, e){ this.trigger($(e.currentTarget).data("action"), popup)}.bind(view, modal));
		
		// Close listener
		modal.on ("hide", function (){ this.remove(); }.bind(view));
	},

	
	'popup' : function (view)
	{
		var self = this;

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
	
	'compose' : function (options)
	{
		// Create Compose view
		if(options)		options.type = "post";
		else			var options = {type: "post"};
		
		var view = new Cloudwalkers.Views.Compose(options);
		
		view.render().$el.modal({backdrop: 'static'});
	},

	'writeMessage' : function (e)
	{
		e.preventDefault ();
		//Cloudwalkers.RootView.popup (new Cloudwalkers.Views.Write ());
		if(options)		options.type = "post";
		else			var options = {type: "post"};

		options.redirect = false;
		
		var view = new Cloudwalkers.Views.Compose(options);
		this.setView(view);
		//this.setView (new Cloudwalkers.Views.Write ({ 'redirect' : false }));
	},

	'editMessage' : function (model)
	{
		//Cloudwalkers.RootView.popup (new Cloudwalkers.Views.Write ({ 'model' : model.clone (), 'redirect' : false }));
		this.compose({'model' : model.clone(), 'redirect' : false});
		
		
		//this.setView (new Cloudwalkers.Views.Write ({ 'model' : model.clone () }));
	},

	'writeDialog' : function (model, action)
	{
		var clone = true;
		var parameters = action.parameters;

		if (action.token == 'edit')
		{
			this.compose({'model' : model.clone(), 'clone' : false, 'redirect' : false});
			/*this.popup
			(
				new Cloudwalkers.Views.Write
				(
					{
						'model' : model.clone (),
						'clone' : false,
						'redirect': false
					}
				)
			);*/
		}

		else
			//Switch between old and new module
			{ 
			this.compose({'model' : model.clone (), 'clone' : clone, 'actionparameters' : parameters, 'redirect' : false, 'type' : "post"});
		}
		/*{
			this.popup_new
				(
					new Cloudwalkers.Views.Write
					(
						{
							'model' : model.clone (),
							'clone' : clone,
							'actionparameters' : parameters,
							'redirect' : false,
							'type' : "post"
						}
					)
				);
		}*/
	},

	'shareMessage' : function (model)
	{
		//Cloudwalkers.RootView.popup (new Cloudwalkers.Views.Write ({ 'model' : model.clone (), 'clone' : true }));
		this.compose({'model' : model.clone(), 'clone' : true, 'redirect' : false});
		//this.popup (new Cloudwalkers.Views.Write ({ 'model' : model.clone (), 'clone' : true, 'redirect' : false }));
	},

	

	/*'setAccount' : function (account)
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
		$('.dropdown.user .username').html (Cloudwalkers.Session.getUser ().get ('displayname'));

		this.renderNavigation ();
	},*/

	/*'renderNavigation' : function ()
	{
		var account = Cloudwalkers.Session.getAccount ();
		
		// Redo navigation
		var data = {};
		data.level = Number(account.attributes.currentuser.level);
		
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
	},*/

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
	
	'growl' : function (title, message)
	{
		$.gritter.add({title: title, text: message, time: 4000});
	},
	
	/*'information' : function (title, message)
	{
		$("#inner-content .container-fluid").prepend("<div class='alert alert-info'><button type='button' class='close' data-dismiss='alert'>&times;</button><strong>" + title + "</strong> " + message + "</div>");
	},*/
	
	'information' : function (title, message, target)
	{
		if(!target) target = "#inner-content .container-fluid";
		
		$(target).prepend("<div class='alert alert-info'><button type='button' class='close' data-dismiss='alert'>&times;</button><strong>" + title + "</strong> " + message + "</div>");
	},
	
	'closeInformation' : function (title, message, target)
	{
		$("div.alert.alert-info").remove();
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

	'imagePopups' : function ()
	{
		$('a.image-popup-viewer').fancybox ();
	}
});