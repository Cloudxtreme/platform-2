/**
* to be DEPRECATED -> Reports stuff
*/
define(
	['Views/Widgets/Widget'],
	function (Widget)
	{
		var Numberstat = Widget.extend ({
	
			// {widget: "report", size: "3", stream: reportables[n], report: {url: "/stream/" + reportables[n].id + "/statistics/numbercomparison/likes", type: "comparison", name: "Fans"}}
			
			'title' : 'Number stat',
			'icon' : 'reorder',
			'color' : null,
			'network' : null,
			'template' : 'dashboardstat',
			'size' : 3,
			'showLink' : true,
			'showStreamName' : true,
			
			'getDataset' : function ()
			{	
				return this.options.model;
			},

			'render' : function ()
			{
				
				var element = this.$el;
				var self = this;

				if (this.color)
					this.options.color = this.color;

				if (this.network)
					this.options.network = this.network;

				if (this.dashboard)
					this.options.dashboard = this.dashboard;
				
				if (this.showLink)
					this.options.showLink = this.showLink;

				if (this.showStreamName)
					this.options.showStreamName = this.showStreamName;

				element.html (Mustache.render (Templates[this.template], this.options));

				this.options.model.getValues (function (values)
				{
					self.setValue (values);
				});

				this.options.model.on ('dataset:change', function (values)
				{
					self.setValue (values[0].values);
				});

				return this;
			},

			'numberOutput' : function (number, plus)
			{
				if (typeof (plus) == 'undefined')
				{
					plus = false;
				}

				if (number < 0)
				{
					return '- ' + Math.abs (number);
				}

				else if (plus)
				{
					return '+ ' + Math.abs (number);	
				}

				return number;
			},

			'setValue' : function (values)
			{
				var element = this.$el;
				var display = this.options.model.getDisplay ();

				var data = {};
				$.extend (true, data, this.options);

				var interval = this.options.model.getInterval ();

				data.details = [];
				data.footer = '&nbsp;';

				data.report = this.options.report.attributes;

				var title;

				if (values && values.length > 0)
				{
					// Always last available value
					if (display == 'comparison')
					{
						var text = this.numberOutput (values[0][1]);

						if (values.length > 1)
						{
							data.footer = '<strong>' + this.numberOutput (values[0][1] - values[1][1], true) + '</strong> (';
							data.footer += this.numberOutput (Math.round(this.options.model.getEvolution () * 100), true) + '%) ' + 'Since last ' + interval;
							//data.details.push ({ 'content' : '(' + this.numberOutput (Math.round(this.options.model.getEvolution () * 100), true) + '%)', 'descr' : 'Evolution' });

							//text += ' (' + this.numberOutput (Math.round(this.options.model.getEvolution () * 100), true) + '%)';

							//data.details.push ({ 'content' : this.numberOutput (values[1][1], true), 'descr' : 'Previous' });
							//data.details.push ({ 'content' : this.numberOutput (values[0][1] - values[1][1], true), 'descr' : 'Difference' });
						}
						else
						{
							data.footer = 'Last ' + interval;
						}

						if (this.options.showStreamName)
						{
							title = "Foo" + ' ' + data.title;//data.stream.get("customname") + ' ' + data.title;
						}
						else
						{
							title = data.title;	
						}

						data.details.push ({ 'content' : text, 'descr' : title });
					}

					else
					{
						this.$el.find ('.number').html (this.numberOutput (values[values.length - 1][1]));
					}
				}
				else
				{
					data.details.push ({ 'content' : '☹', 'descr' : 'No info' });
				}

				this.trigger ('content:change');
				element.html (Mustache.render (Templates[this.template], data));
				element.find('.portlet-loading').toggleClass('portlet-loading');
			}

		});

		return Numberstat;
});