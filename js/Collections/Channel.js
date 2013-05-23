Cloudwalkers.Collections.Channel = Backbone.Collection.extend({

	'model' : Cloudwalkers.Models.Message,

	'sync' : function(method, model, options) {

		console.log (this);

		// Default JSON-request options.
		var params = _.extend({
			type:         'POST',
			dataType:     'json',
			url:			method == 'read' ? CONFIG_BASE_URL + 'json/channel/' + 1 : ''
		}, options);

		// Make the request.
		return $.ajax(params);
	}

});