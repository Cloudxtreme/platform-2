Cloudwalkers.Views.Widgets.Charts.Table = Cloudwalkers.Views.Widgets.Widget.extend ({

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

		for (var i = 0; i < values.header.length; i ++)
		{
			mustachedata.header.push ({ 'name' : values.header[i], 'class' : typeof (values.classes[i]) != 'undefined' ? values.classes[i] : null });

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