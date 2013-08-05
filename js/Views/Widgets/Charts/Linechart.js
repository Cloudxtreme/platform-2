Cloudwalkers.Views.Widgets.Charts.Linechart = Cloudwalkers.Views.Widgets.Widget.extend ({

	'title' : 'Line chart',

	'innerRender' : function (element)
	{
		var self = this;

		var placeholder = $('<div class="chart" style="position: relative;"></div>');
		element.html ('');
		element.append (placeholder);

		setTimeout (function ()
		{

			$.ajax 
			(
				self.options.dataurl,
				{
					'success' : function (data)
					{
						//console.log (data);
						var values = [];

						for (var i = 0; i < data.statistics.values.length; i ++)
						{
							var date = (new Date(data.statistics.values[i].date).getTime ());
							console.log (date);

							values.push 
							([ 
								date,
								data.statistics.values[i].value
							])
						}

						//var data = [ [[0, 0], [1, 1]] ];
						$.plot (placeholder, values, {});
					}
				}
			);

		}, 1);
	},

});