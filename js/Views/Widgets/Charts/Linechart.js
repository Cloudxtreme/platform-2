Cloudwalkers.Views.Widgets.Charts.Linechart = Cloudwalkers.Views.Widgets.Widget.extend ({

	'title' : 'Line chart',
	'placeholder' : null,
	'icon' : 'reorder',

	'innerRender' : function (element)
	{
		var self = this;

		this.placeholder = $('<div class="chart" style="position: relative;"></div>');

		element.html ('');
		element.append (this.placeholder);

		this.options.dataset.getValues (function (values)
		{
			self.plot (values);
		});

		this.options.dataset.on ('dataset:change', function (values)
		{
			self.plot (values);
		});
	},

    'showTooltip' : function (x, y, contents) {
        $('<div id="tooltip">' + contents + '</div>').css({
                position: 'absolute',
                display: 'none',
                top: y + 5,
                left: x + 15,
                border: '1px solid #333',
                padding: '4px',
                color: '#fff',
                'border-radius': '3px',
                'background-color': '#333',
                opacity: 0.80
            }).appendTo(this.$el).fadeIn(200);
    },

	'plot' : function (values)
	{
		var self = this;

		$.plot 
		(
			this.placeholder, 
			[ values ], 
			{
				'xaxis' : {
					'mode' : 'time'
				},

				'yaxis' : {
					'tickDecimals' : 0
				},

				series: {
					lines: {
						show: true,
						lineWidth: 2,
						fill: true,
						fillColor: {
							colors: [{
									opacity: 0.05
								}, {
									opacity: 0.01
								}
							]
						}
					},
					points: {
						show: true
					},
					shadowSize: 2
				},

                grid: {
                    hoverable: true,
                    clickable: true,
                    tickColor: "#eee",
                    borderWidth: 0
                },
                colors: ["#d12610", "#37b7f3", "#52e136"]
			}
		);

        var previousPoint = null;
        this.placeholder.bind("plothover", function (event, pos, item) {
            $("#x").text(pos.x.toFixed(2));
            $("#y").text(pos.y.toFixed(2));

            if (item) {
                if (previousPoint != item.dataIndex) {
                    previousPoint = item.dataIndex;

                    $("#tooltip").remove();
                    var x = item.datapoint[0],
                        y = item.datapoint[1];

                    x = (new Date(x)).toLocaleDateString();

                    self.showTooltip(item.pageX, item.pageY, x + ': ' + y);
                }
            } else {
                $("#tooltip").remove();
                previousPoint = null;
            }
        });
	}

});