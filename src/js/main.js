/**
 * Require dependencies
 */
require.config({
	baseUrl: '/js/',
	paths: {
		'jquery': 'lib/jquery/jquery.min',
		'jqueryui': 'lib/jquery-ui/jquery-ui.min',
		'underscore': 'lib/underscore/underscore',
		'backbone': 'lib/backbone/backbone',
		'bootstrap': 'lib/bootstrap/docs/assets/js/bootstrap.min',
		'bootstrap-modal': 'lib/bootstrap-modal/js/bootstrap-modal',
		'bootstrap-modalmanager': 'lib/bootstrap-modal/js/bootstrap-modalmanager',
		'mustache': 'lib/mustache/mustache',
		'moment': 'lib/moment/moment',
		'datepicker': 'lib/bootstrap-datepicker/js/bootstrap-datepicker',
		'timepicker': 'lib/bootstrap-timepicker/js/bootstrap-timepicker.min',
		'calheatmap': 'lib/cal-heatmap/cal-heatmap.min',
		'chosen': 'lib/chosen/chosen.jquery.min',
		'd3': 'lib/d3/d3.min',
		'crossdomain': 'lib/backbone.crossdomain/Backbone.CrossDomain',
		'polyglot': 'lib/polyglot/lib/polyglot',
		'slimscroll': 'lib/slimscroll/jquery.slimscroll.min',
		'gritter': 'lib/jquery.gritter/js/jquery.gritter.min',
		'async' : 'lib/requirejs-plugins/src/async',
		'goog': 'lib/requirejs-plugins/src/goog',
        'propertyParser' : 'lib/requirejs-plugins/src/propertyParser'
	},
	shim: {
		'bootstrap': {
			deps: ['jquery'],
			exports: 'bootstrap'
		},
		'underscore': {
			exports: '_'
		},
		'jqueryui': {
			deps: ['jquery'],
			exports: 'jqueryui'
		},
		'bootstrap-modal': {
			deps: ['jquery', 'bootstrap', 'bootstrap-modalmanager'],
			exports: 'bootstrap-modal'
		},
		'bootstrap-modalmanager': {
			deps: ['jquery'],
			exports: 'bootstrap-modalmanager'
		},
		'backbone': {
			deps: ['underscore', 'jquery', 'mustache', 'jqueryui', 'bootstrap-modal'],
			exports: 'backbone'
		},
		'crossdomain': {
			deps: ['backbone'],
			exports: 'crossdomain'
		},
		'calheatmap': {
			deps: ['d3'],
			exports: 'calheatmap'
		},
		'd3': {
			exports: 'd3'
		}
	},
	urlArgs: "bust=" +  (new Date()).getTime()
});

// Set up global Cloudwalkers & translation global reference
var Cloudwalkers;
var trans;

require(
	['backbone', 'bootstrap', 'Cloudwalkers'],
	function(Backbone, bootstrap, Cwd)
	{
		$(document).ready(function()
		{			
			Store = new StorageClassLocal();		

			//MIGRATION -> easy way to instance the global before anything, may be wrong
			Cloudwalkers = Cwd;
			Cloudwalkers.init();
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