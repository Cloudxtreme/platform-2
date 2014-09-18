/**
 * Require dependencies
 */
require.config({baseUrl: '/js/'});

require(
	['lib/jquery/jquery', 'config'],
	function($, config)
	{
		config.hasToken();
	}
);

/**
 * Origin function
 */
var origin = function ()
{
	return (window.location.origin)? window.location.origin : window.location.protocol + "//" + window.location.hostname;
}