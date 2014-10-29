/**
* to be DEPRECATED -> Reports stuff
*/
define(
	['Views/Charts/Numberstat'],
	function (Numberstat)
	{
		var Comparison = Numberstat.extend ({

			'template' : 'dashboardstat'

		});

		return Comparison;
});