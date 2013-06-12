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
			setTimeout (function ()
			{
				jcf.customForms.replaceAll();
			}, 1);

			self.updatePlaceholder ();
		});

		$('.add-button').click (this.writeMessage);
	},

	'render' : function ()
	{
		$('#inner-content').html (this.view.render ().el);
	},

	'setView' : function (view, showMenu)
	{
		if (typeof (showMenu) == 'undefined')
		{
			showMenu = true;
		}

		$('#header').toggle (showMenu);
		$('#footer').toggle (showMenu);

		this.view = view;
		this.trigger ('view:change');
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
	},

	'writeMessage' : function (e)
	{
		e.preventDefault ();
		Cloudwalkers.RootView.popup (new Cloudwalkers.Views.Write ());
	},

	'editMessage' : function (model)
	{
		Cloudwalkers.RootView.popup (new Cloudwalkers.Views.Write ({ 'model' : model }));
	},

	'setAccount' : function (account)
	{
		
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
	}

});