/**
* to be DEPRECATED -> Reports stuff
*/
define(
	['Views/Panels/Panel', 'mustache'],
	function (Panel, Mustache)
	{
		var Table = Panel.extend ({

			'title' : 'Line chart',
			'placeholder' : null,
			'size' : 'full',
			'icon' : 'reorder',

			'getDataset' : function ()
			{
				return this.options.model;
			},

			'innerRender' : function (element)
			{
				var self = this;

				this.placeholder = $('<div class="table-container"></div>');

				element.html ('');
				element.append (this.placeholder);

				this.options.model.getValues (function (values)
				{
					self.plot (values);
				});

				this.options.model.on ('dataset:change', function (values)
				{
					self.plot (values[0].values);
				});
			},

			'plot' : function (values)
			{
				var mustachedata = {};
				mustachedata.header = [];

				var columns = [];

				for (var n = 0; n < values.header.length; n ++)
				{
					mustachedata.header.push ({ 'name' : values.header[n], 'class' : typeof (values.classes[n]) != 'undefined' ? values.classes[n] : null });

					columns.push ({
						'sSortDataType' : 'dom-text'
					});
				}

				mustachedata.rows = [];
				for (var i = 0; i < values.rows.length; i ++)
				{
					var tmp = [];
					for (var j = 0; j < values.rows[i].length; j ++)
					{
						tmp.push ({ 
							'value' : values.rows[i][j], 
							'class' : (typeof (values.classes[j]) != 'undefined' ? values.classes[j] : null ) 
						});
					}
					mustachedata.rows.push ({ 'columns' : tmp });
				}

				this.placeholder.html (Mustache.render (Templates.charttable, mustachedata));
			}

		});

		return Table;
});