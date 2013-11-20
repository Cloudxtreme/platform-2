/*function getTimeSince (date)
{
 	var interval;
 	var seconds = Math.floor((new Date() - date) / 1000);

    
    
    
    if (seconds < 0)
    {
        return 'just now';
    }

    if (seconds < 60 * 60 * 12)
    {
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
            return interval + " hours ago";
        }
        interval = Math.floor(seconds / 60);
        if (interval >= 1) {
            return interval + " minutes ago";
        }        

        return Math.floor(seconds) + " seconds ago";
    }
    else
    {

        date.setFullYear (date.getFullYear (), date.getMonth (), date.getDate ());

        seconds = (new Date() - (date)) / 1000;

        interval = Math.floor(seconds / 31536000);
        if (interval >= 1) {
            return interval + " years ago";
        }

        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) {
            return interval + " months ago";
        }

        interval = Math.floor(seconds / 86400);
        if (interval >= 1) {
            return interval + " days ago";
        }

        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
            return interval + " hours ago";
        }
    }


}

function updateTimers ()
{
	$('.time-since').each (function ()
	{
		var date = new Date($(this).attr ('data-date'));
		$(this).html (getTimeSince (date));
	});	
}

setInterval (updateTimers, 50);*/