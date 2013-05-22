Cloudwalkers.Views.Channel = Backbone.View.extend({

	'render' : function ()
	{
		var data = {};

		data.title = 'Inbox';

		$(this.el).html (Mustache.render (Templates.messagecontainer, data));

			jQuery.each(objBlocks, function(nbrIndex, objValue){
				jQuery("." + objValue.class).hide();
			});

			jQuery(".dash-only").hide();
			jQuery(".block-inbox").show();

			var container = jQuery(".channel-container");

			var loading = $(document.createElement ('div'));
			loading.addClass ('loading');
			loading.html ('<p>Loading... please wait</p>');

			container.append (loading);

			jQuery.ajax
			({
				async:true, 
				cache:false, 
				data:"", 
				dataType:"json", 
				type:"get", 
				url: CONFIG_BASE_URL + "json/channel/" + 1 + '?records=20', 
				success:function(objData)
				{
					container.html ('<div class="comment-heading"><h3>' + objData.channel.name + '</h3></div>');
					addMessages (objData);
				}
			});

		return this;
	}

});