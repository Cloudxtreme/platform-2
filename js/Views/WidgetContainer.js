/**
* Standard widget container
*/
Cloudwalkers.Views.Widgets.WidgetContainer = Backbone.View.extend({

	'widgets' : [],
	'title' : 'Widget Container',
	'isLoaded' : false,
	'currentLine' : null,

	'initialize' : function ()
	{
		var self = this;

		this.widgets = [];
		this.initializeWidgets ();
		this.isLoaded = false;

		this.on ('destroy', function ()
		{
			for (var i = 0; i < this.widgets.length; i ++)
			{
				self.widgets[i].widget.trigger ('destroy');
			}
		});
	},

	'initializeWidgets' : function ()
	{

	},

	'addHalfWidget' : function (widget, newline)
	{
		if (typeof (newline) == 'undefined')
		{
			newline = false;
		}

		var self = this;
		widget.on ('content:change', function () { self.trigger ('content:change'); });

		this.widgets.push ({ 'widget' : widget, 'size' : 'half', 'newline' : newline });

		if (this.isLoaded)
		{
			this.addWidgetsDOM ([{ 'widget' : widget, 'size' : 'half', 'newline' : newline }]);
		}
	},

	'addWidget' : function (widget, newline)
	{
		if (typeof (newline) == 'undefined')
		{
			newline = false;
		}

		var self = this;
		widget.on ('content:change', function () { self.trigger ('content:change'); });

		this.widgets.push ({ 'widget' : widget, 'size' : 'full', 'newline' : newline });

		if (this.isLoaded)
		{
			this.addWidgetsDOM ([{ 'widget' : widget, 'size' : 'full', 'newline' : newline }]);
		}
	},

	'addWidgetSize' : function (widget, newline, size)
	{
		if (typeof (newline) == 'undefined')
		{
			newline = false;
		}

		var self = this;
		widget.on ('content:change', function () { self.trigger ('content:change'); });

		this.widgets.push ({ 'widget' : widget, 'size' : size, 'newline' : newline });

		if (this.isLoaded)
		{
			this.addWidgetsDOM ([{ 'widget' : widget, 'size' : size, 'newline' : newline }]);
		}
	},

	'render' : function ()
	{
		var self = this;
		this.isLoaded = true;

		this.$el.html (Mustache.render (Templates.widgetcontainer, { 'title' : this.title }));

		var container;

		this.currentline = $(document.createElement ('div'));
		this.currentline.addClass ('row-fluid');
		this.$el.find ('#widgetcontainer').append (this.currentline);

		this.addWidgetsDOM (this.widgets);

		return this;
	},

	'addWidgetsDOM' : function (widgets)
	{
		var self = this;

		for (var i = 0; i < widgets.length; i ++)
		{
			if (widgets[i].newline)
			{
				this.currentline = $(document.createElement ('div'));
				this.currentline.addClass ('row-fluid');
				this.$el.find ('#widgetcontainer').append (this.currentline);				
			}

			container = $(document.createElement ('div'));

			if (widgets[i].size == 'half')
			{
				container.addClass ('span6');
			}
			else if (widgets[i].size == 'full')
			{
				container.addClass ('span12');
			}
			else
			{
				container.addClass ('span' + widgets[i].size);	
			}

			container.append (widgets[i].widget.render ().el);

			this.currentline.append (container);
		}

		setTimeout (function ()
		{
			self.trigger ('content:change');
		}, 1);
	}

});