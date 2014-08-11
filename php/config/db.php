<?php
define ('OAUTH_CONSUMER_KEY', 'cdc736ef4be58c8b78498218d076213e0516febae');
define ('OAUTH_CONSUMER_SECRET', 'd0de26391ba12bd5de555f3057228aff');

//define ('OAUTH_SERVER', 'http://devapi.cloudwalkers.be/');
define ('OAUTH_SERVER', 'http://stagingapi.cloudwalkers.be/');
//define ('BASE_URL', 'http://localhost/cloudwalkers/website/');

define ('ERROR_REPORTING', -1);
define ('DEBUG', ((isset($_GET['debug'])) && (in_array($_SERVER['REMOTE_ADDR'], array('94.224.104.197'/*Roel*/, '78.22.195.135'/*Bureau*/)))));
define ('DEBUG_LOG', false);
