Cloudwalkers.Views.Widgets.Report = Cloudwalkers.Views.Widgets.Widget.extend ({

	'template' : 'report',
	'initialize' : function()
	{
		this.stream = this.options.stream;
	},

	'render' : function ()
	{
		// Preset template
		this.$el.html (Mustache.render (Templates[this.template], {network: this.stream.get("network")}));
		this.$el.find(".dashboard-stat").addClass("portlet-loading");
		
		// Load report data
		if(!this.stream.reports.processing)
			this.stream.reports.fetch({error: this.fail});
		
		else if(this.stream.reports.length)
			this.fill();

		this.stream.reports.on("sync", this.fill.bind(this));
		
		//element.html (Mustache.render (Templates[this.template], data));
		//element.find('.portlet-loading').toggleClass('portlet-loading');
		
		/*var element = this.$el;
		var self = this;

		if (this.color)
			this.options.color = this.color;

		if (this.network)
			this.options.network = this.network;

		this.options.footer = '&nbsp;';

		element.html (Mustache.render (Templates[this.template], this.options));

		this.options.dataset.getValues (function (values)
		{
			self.setValue (values);
		});

		this.options.dataset.on ('dataset:change', function (values)
		{
			self.setValue (values[0].values);
		});

		return this;*/
		return this;
	},
	
	'fill' : function ()
	{	
		
		//console.log(this.stream.reports)
		
		var report = this.stream.reports.findWhere({uniqueid: this.options.type});
		
		if(!report) return null;
		
		this.$el.html (Mustache.render (Templates[this.template],
		{
			dashbaord: this.dashboard,
			streamid: this.stream.id,
			network: this.stream.get("network"),
			details: report.getDetails()

		}));
		
		this.trigger ('content:change');
		
		/*
			<div class="dashboard-stat {{network.icon}}-color">
	<div class="visual">
		<i class="icon-{{network.icon}}"></i>
	</div>

	{{#details}}
	<div class="details">
		<div class="number">
			{{content}}
		</div>
		<div class="desc">                           
			{{descr}}
		</div>
	</div>
	{{/details}}

	<a class="more" {{#showLink}}href="#reports/{{#stream}}{{id}}{{/stream}}"{{/showLink}} >
		{{{footer}}}
		<i class="{{#dashboard}}icon-chevron-right{{/dashboard}}{{^dashboard}}icon-question-sign{{/dashboard}} m-icon-white tooltips" data-placement="top" data-original-title="{{report.description}}"></i>
	</a>
</div>
			
		*/
		//uniqueid: "numbercomparison/likes"
		
		/*this.$el.find('.inner-loading').toggleClass(collection.length? 'inner-loading': 'inner-empty inner-loading');
		
		// Go trough all messages
		collection.each (function (message)
		{
			message.attributes.network = message.getStream ().attributes.network;
			
			var parameters = {
				'model' : message,
				'streamid' : message.get("stream"),
				'template' : 'keywordentry'
			};
			
			var messageView = new Cloudwalkers.Views.Entry (parameters);
			this.entries.push (messageView);
			
			this.$el.find ('.messages-container').append(messageView.render().el);
			
		}.bind(this));
		
		this.toggleEntries(null);*/
	},
	
	'fail' : function ()
	{
		Cloudwalkers.RootView.growl ("Oops", "Something went sideways, please reload the page.");
	},

	'setValue' : function (values)
	{
		/*var element = this.$el;

		var data = {};
		$.extend (true, data, this.options);

		data.footer = '<strong>' + this.options.stream.get("customname") + '</strong> ' + this.options.title;

		data.details = [];

		if (values && values.length > 0)
		{
			// Always last available value
			data.details.push ({ 'content' : values[0][1], 'descr' : values[0][0] });
		}
		else
		{
			data.details.push ({ 'content' : '☹', 'descr' : 'No info' });
		}

		
		element.html (Mustache.render (Templates[this.template], data));
		element.find('.portlet-loading').toggleClass('portlet-loading');*/
	}

});