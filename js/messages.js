var objBlocks = {
	"inbox":{ "class":"block-inbox", "display":true }, 
	"links":{ "class":"block-links", "display":true }, 
	"schedule":{ "class":"block-schedule", "display":true }, 
	"statistics":{ "class":"block-statistics", "display":true }, 
	"filters":{ "class":"block-filters", "display":true }
};

function change_content(strType, strExtra){
	switch(strType){
		case "users":
			break;
		case "notifications":
			if(jQuery(".notification-box .popup").css("display") == "none"){
				jQuery.ajax({
					async:true, 
					cache:false, 
					data:"", 
					dataType:"json", 
					type:"get", 
					url: CONFIG_BASE_URL + "json/account/" + strExtra + "/notifications", 
					success:function(objData){
						jQuery(".notification-box ul li:not(.prototype)").remove();
						//{"id":1,"message":"This is a message"}
						jQuery.each(objData.notifications, function(nbrIndex, objValue){
							var objClone = jQuery(".notification-box ul li.prototype").first().clone();
							objClone.find("a").text(objValue.message);
							objClone.removeClass("prototype").appendTo(jQuery(".notification-box ul"));
						});
						jQuery(".notification-amount").text("0");
						jQuery(".notification-box .popup").show();
					}
				});
			}else{
				jQuery(".notification-box .popup").hide();
			}
			break;
		case "channel":

			jQuery.each(objBlocks, function(nbrIndex, objValue){
				jQuery("." + objValue.class).hide();
			});

			jQuery(".dash-only").hide();
			jQuery(".block-inbox").show();

			var container = jQuery(".block-inbox .scrollable-area");

			var loading = $(document.createElement ('div'));
			loading.html ('<p class="loading">Loading... please wait</p>');

			container.html (loading);

			jQuery.ajax
			({
				async:true, 
				cache:false, 
				data:"", 
				dataType:"json", 
				type:"get", 
				url: CONFIG_BASE_URL + "json/channel/" + strExtra, 
				success:function(objData)
				{
					//{"id":"134","body":{"html":"<p>iPad in Q4 2012 opnieuw meest verkochte tablet. - http:\/\/bit.ly\/UFQDnh<\/p>","plaintext":"iPad in Q4 2012 opnieuw meest verkochte tablet. - http:\/\/bit.ly\/UFQDnh"},"from":[{"name":"Cloudwalkers","avatar":"https:\/\/graph.facebook.com\/272752359511949\/picture"}],"attachments":[{"url":"http:\/\/bit.ly\/UFQDnh","type":"link"},{"url":"http:\/\/platform.ak.fbcdn.net\/www\/app_full_proxy.php?app=218457351622813&v=1&size=z&cksum=a225b0f241f4b974ec469bedba2ad157&src=http%3A%2F%2Fstatic.macworld.nl%2Fthumbnails%2F88x97%2F2%2F2%2F22f40e9d3100ee605b72fc0b58a61c00.jpg","type":"image"}],"date":"2013-01-31T14:26:00+00:00","actions":[{"token":"like","name":"Like","parameters":[]},{"token":"comment","name":"Comment","parameters":[{"token":"message","name":"Message","type":"string","required":true,"max-size":140}]}],"children_count":0,"likes":0}
					var objCommentClone = jQuery(".block-inbox .scrollable-area .comment-box.prototype").first().clone();
					var messages = 0;

					jQuery.each
					(
						objData.channel.messages, 
						function(nbrIndex, objValue)
						{
							var objPostClone = objCommentClone.find(".post-row.prototype").first().clone();
							objPostClone.find(".text-post").html('<div class="picture"><img src="images/img10.jpg" alt="image description" width="93" height="68" /></div>' + objValue.body.html);
							objPostClone.removeClass("prototype").appendTo(container);

							messages ++;
						}
					);

					if (messages == 0)
					{
						container.append ('<p>No messages found.');
					}

					objCommentClone.removeClass("prototype").appendTo(container);
							
					loading.remove ();
				}
			});
			break;

		case "reports":
			
			break;
		default://dashboard
			jQuery.each(objBlocks, function(nbrIndex, objValue){
				jQuery("." + objValue.class).show();
			});
			jQuery(".dash-only").show();
	}
}

