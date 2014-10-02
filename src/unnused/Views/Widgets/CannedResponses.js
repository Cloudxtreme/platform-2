define(
	['Views/Entry'],
	function (Entry)
	{
		var CannedResponses = Entry.extend({
	
	'initialize' : function(options)
	{	
		if(options) $.extend(this, options);
	},

	'render' : function()
	{

	}

	