Cloudwalkers.Views.Widgets.Charts.Table = Cloudwalkers.Views.Widgets.Widget.extend ({

	'title' : 'Line chart',
	'placeholder' : null,
	'size' : 'full',
	'icon' : 'reorder',

	'getDataset' : function ()
	{
		return this.options.dataset;
	},

	'innerRender' : function (element)
	{
		var self = this;

		this.placeholder = $('<div class="table-container"></div>');

		element.html ('');
		element.append (this.placeholder);

		this.options.dataset.getValues (function (values)
		{
			self.plot (values);
		});

		this.options.dataset.on ('dataset:change', function (values)
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

		//console.log (mustachedata);

		this.placeholder.html (Mustache.render (Templates.charttable, mustachedata));

		var table = this.placeholder.find ('table').dataTable({
            "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
            "sPaginationType": "bootstrap",
            "bPaginate": false,
            "bFilter" : false
		});

		

		table.fnSort ([ mustachedata.header.length - 1, 'desc' ]);
	}

});