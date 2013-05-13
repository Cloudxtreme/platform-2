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

			var container = jQuery(".comment-box");
			container.html ('<div class="comment-heading"><h3>Co-Workers</h3></div>');

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
				url: CONFIG_BASE_URL + "json/channel/" + strExtra + '?records=20', 
				success:function(objData)
				{
					var view = Templates.message;

					//{"id":"134","body":{"html":"<p>iPad in Q4 2012 opnieuw meest verkochte tablet. - http:\/\/bit.ly\/UFQDnh<\/p>","plaintext":"iPad in Q4 2012 opnieuw meest verkochte tablet. - http:\/\/bit.ly\/UFQDnh"},"from":[{"name":"Cloudwalkers","avatar":"https:\/\/graph.facebook.com\/272752359511949\/picture"}],"attachments":[{"url":"http:\/\/bit.ly\/UFQDnh","type":"link"},{"url":"http:\/\/platform.ak.fbcdn.net\/www\/app_full_proxy.php?app=218457351622813&v=1&size=z&cksum=a225b0f241f4b974ec469bedba2ad157&src=http%3A%2F%2Fstatic.macworld.nl%2Fthumbnails%2F88x97%2F2%2F2%2F22f40e9d3100ee605b72fc0b58a61c00.jpg","type":"image"}],"date":"2013-01-31T14:26:00+00:00","actions":[{"token":"like","name":"Like","parameters":[]},{"token":"comment","name":"Comment","parameters":[{"token":"message","name":"Message","type":"string","required":true,"max-size":140}]}],"children_count":0,"likes":0}
					var messages = 0;
					jQuery.each
					(
						objData.channel.messages, 
						function(nbrIndex, data)
						{
							console.log (data);
							messages ++;

							data.sortedattachments = {};

							// Go trough all attachments and put them in groups
							if (typeof (data.attachments) != 'undefined')
							{
								for (var i = 0; i < data.attachments.length; i ++)
								{
									if (typeof (data.sortedattachments[data.attachments[i].type]) == 'undefined')
									{
										data.sortedattachments[data.attachments[i].type] = [];
									}
									data.sortedattachments[data.attachments[i].type].push(data.attachments[i]);
								}
							}

							html = $(Mustache.render(view, data));

							// Go trough actions and add onclick event
							jQuery.each 
							(
								data.actions,
								function(nbrIndex, actionData)
								{
									html.find ('.action.' + actionData.token).click (function ()
									{
										messageAction (data, actionData);
									})
								}
							);

							container.append (html);
						}
					);

					if (messages == 0)
					{
						container.append ('<p>No messages found.');
					}

					container.append ('<div class="button-row"><a href="#"><span>more web alerts</span></a></div>');
					container.find ('.loading').remove ();

					updateTimers ();
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

function messageAction (messagedata, actiondata)
{
	// Needs parameters?
	if (actiondata.parameters.length > 0)
	{
		// Popup!
		var data = {};

		data.action = actiondata;
		data.title = actiondata.name;

		data.input = {};

		jQuery.each (actiondata.parameters, function (i, v)
		{
			if (typeof (data.input[v.type]) == 'undefined')
			{
				data.input[v.type] = [];
			}

			data.input[v.type] = v;
		});

		var popup = Mustache.render(Templates['action-parameters'], data);

		lightboxPopup (popup, function (form)
		{
			var input = $(form).serializeArray ();
			doMessageAction (messagedata, actiondata.token, input);
		});
	}
	else
	{
		// Go straight to display
		doMessageAction (messagedata, actiondata.token);
	}
}

function doMessageAction (message, action, input)
{
	// Simulating, don't want to push to real network :)
	alert ('Doing "' + action + '" on message ' + message.id + ' with parameters in console.');
	console.log (input);
}

function getTimeSince (date)
{
 	var interval = Math.floor(seconds / 31536000);
 	var seconds = Math.floor((new Date() - date) / 1000);

    if (interval > 1) {
        return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}

function updateTimers ()
{
	$('.time-since').each (function ()
	{
		var date = new Date($(this).attr ('data-date'));
		$(this).html (getTimeSince (date) + ' ago');
	});	
}

setInterval (updateTimers, 1000);