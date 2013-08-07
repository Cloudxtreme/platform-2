function getTimeSince (date)
{
 	var interval;
 	var seconds = Math.floor((new Date() - date) / 1000);

    if (seconds < 60 * 60 * 12)
    {
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
            return interval + " hours";
        }
        interval = Math.floor(seconds / 60);
        if (interval >= 1) {
            return interval + " minutes";
        }        

        return Math.floor(seconds) + " seconds";
    }
    else
    {
        /*
        var y = (new Date()).getFullYear ();
        if (y - date.getFullYear () > 0)
        {
            return y - date.getFullYear () + ' years';
        }

        var m = (new Date()).getMonth ();
        if (m - date.getMonth () > 0)
        {
            return m - date.getMonth () + ' months';
        }
        */

        var date = new Date ();
        date.setFullYear (date.getFullYear (), date.getMonth (), date.getDate ());

        seconds = ((date).getTime ()) / 1000;
        console.log (seconds);

        interval = Math.floor(seconds / 31536000);
        if (interval >= 1) {
            return interval + " years";
        }
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) {
            return interval + " months";
        }

        interval = Math.floor(seconds / 86400);
        if (interval >= 1) {
            return interval + " days";
        }

        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
            return interval + " hours";
        }
    }

    /*
    if (interval >= 1) {
        return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
        return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
        return interval + " days";
    }

    return Math.floor(seconds) + " seconds";
    */
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