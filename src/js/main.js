/**
 * Require dependencies
 */
require.config({
	baseUrl: '/js/',
	paths: {
		'jquery': 'lib/jquery/jquery',
		'underscore': 'lib/underscore/underscore',
		'backbone': 'lib/backbone/backbone',
		'bootstrap': 'lib/bootstrap/dist/js/bootstrap',
		'mustache': 'lib/mustache/mustache',
		'backgrid': 'lib/backgrid/lib/backgrid',
		'pageable': 'lib/backbone-pageable/lib/backbone-pageable',
		'backbone.paginator': 'lib/backbone.paginator/lib/backbone.paginator',
		'paginator': 'lib/backgrid-paginator/backgrid-paginator',
		'backgrid-object-cell': 'lib/backgrid-object-cell/backgrid-object-cell'
	},
	shim: {
		'bootstrap': {
			deps: ['jquery'],
			exports: 'bootstrap'
		},
		'underscore': {
			exports: '_'
		},
		'backbone': {
			deps: ['underscore', 'jquery', 'mustache'],
			exports: 'backbone'
		},
		'backgrid': {
			deps: ['jquery','backbone','underscore'],
			exports: 'Backgrid'
		},
		'paginator': {
			deps: ['backgrid', 'pageable'],
			exports: 'Paginator'
		},
		'backgrid-object-cell': {
			deps: ['backgrid'],
			exports: 'ObjectCell'
		}
	}
});

// Set up global Cloudwalkers	
var Cloudwalkers;

require(
	['backbone', 'bootstrap', 'Cloudwalkers'],
	function(Backbone, bootstrap, cwd)
	{	
		// IDB Store
		Store = new StorageClassIDB("cwdSuperDB", 2, function()
		{
			Cloudwalkers = cwd.init();
		});
	}
);


/**
 *	Cloudwalkers level Exceptions
 */
function AuthorizationError (message)
{
	this.name = "Not Authorized";
	this.message = (message || "Not authorized for the current user (no matching authorization token)")
	this.stack = (new Error()).stack;
}

AuthorizationError.prototype = new Error();
AuthorizationError.prototype.constructor = AuthorizationError;

/**
 * Origin function
 */
var origin = function ()
{
	return (window.location.origin)? window.location.origin : window.location.protocol + "//" + window.location.hostname;
}