/**
* Standard widget container
*/
Cloudwalkers.Views.Widgets.WidgetContainer = Backbone.View.extend({

	'widgets' : [],
	'title' : 'Widget Container',

	'initialize' : function ()
	{
		this.widgets = [];
		this.initializeWidgets ();
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
	},

	'render' : function ()
	{
		var self = this;

		this.$el.html (Mustache.render (Templates.widgetcontainer, { 'title' : this.title }));

		var container;

		var currentline = $(document.createElement ('div'));
		currentline.addClass ('row-fluid');
		this.$el.find ('#widgetcontainer').append (currentline);

		for (var i = 0; i < this.widgets.length; i ++)
		{
			if (this.widgets[i].newline)
			{
				currentline = $(document.createElement ('div'));
				currentline.addClass ('row-fluid');
				this.$el.find ('#widgetcontainer').append (currentline);				
			}

			container = $(document.createElement ('div'));

			if (this.widgets[i].size == 'half')
			{
				container.addClass ('span6');
			}
			else if (this.widgets[i].size == 'full')
			{
				container.addClass ('span12');
			}

			container.append (this.widgets[i].widget.render ().el);

			currentline.append (container);
		}

		setTimeout (function ()
		{
			self.trigger ('content:change');
		}, 1);

		return this;
	}

});