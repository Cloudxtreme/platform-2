<?php

if (isset ($_GET['session_id']))
{
	session_id ($_GET['session_id']);
}
session_start ();

date_default_timezone_set ('Europe/Brussels');

define ('BASEPATH', dirname (dirname (__FILE__))  . '/');
define ('PHP_BASEPATH', dirname (__FILE__)  . '/');

// Set include path to "php" folder.
set_include_path (PHP_BASEPATH);

// Config
require_once 'config/config.php';
require_once 'functions.php';

define ('UPLOAD_FILEPATH', BASEPATH . 'public/');
define ('UPLOAD_URL', BASE_URL . 'public/');

/*
* Autoload method, loads classes when required
* Location based on classname: BMGroup_Pages_Base will be 
* loaded from BMGroup/Pages/Base.php
*/
function __autoload ($class_name) 
{
	$v = explode ('_', $class_name);
	
	$p = count ($v) - 1;
	
	$url = '';
	foreach ($v as $k => $vv)
	{
		if ($k == $p)
		{
			$url .= '/'.$vv.'.php';
		}
		else 
		{
			$url .= '/'.$vv;
		}
	}
	
	foreach (explode (PATH_SEPARATOR, get_include_path ()) as $v)
	{
		if (file_exists ($v . $url))
		{
			require_once ($v . $url);
			return true;
		}
	}
	
	//echo get_include_path ();
	//throw new Exception ("Could not load class: " . $class_name);
	
	return false;
}

/*
	Stupid magic quotes
*/
// Strip magic quotes from request data.
if (function_exists('get_magic_quotes_gpc') && get_magic_quotes_gpc()) {
    // Create lamba style unescaping function (for portability)
    $quotes_sybase = strtolower(ini_get('magic_quotes_sybase'));
    $unescape_function = (empty($quotes_sybase) || $quotes_sybase === 'off') ? 'stripslashes($value)' : 'str_replace("\'\'","\'",$value)';
    $stripslashes_deep = create_function('&$value, $fn', '
        if (is_string($value)) {
            $value = ' . $unescape_function . ';
        } else if (is_array($value)) {
            foreach ($value as &$v) $fn($v, $fn);
        }
    ');
    
    // Unescape data
    $stripslashes_deep($_POST, $stripslashes_deep);
    $stripslashes_deep($_GET, $stripslashes_deep);
    $stripslashes_deep($_COOKIE, $stripslashes_deep);
    $stripslashes_deep($_REQUEST, $stripslashes_deep);
}

if (!function_exists('http_response_code')) {
	function http_response_code($code = NULL) {

		if ($code !== NULL) {

			switch ($code) {
				case 100: $text = 'Continue'; break;
				case 101: $text = 'Switching Protocols'; break;
				case 200: $text = 'OK'; break;
				case 201: $text = 'Created'; break;
				case 202: $text = 'Accepted'; break;
				case 203: $text = 'Non-Authoritative Information'; break;
				case 204: $text = 'No Content'; break;
				case 205: $text = 'Reset Content'; break;
				case 206: $text = 'Partial Content'; break;
				case 300: $text = 'Multiple Choices'; break;
				case 301: $text = 'Moved Permanently'; break;
				case 302: $text = 'Moved Temporarily'; break;
				case 303: $text = 'See Other'; break;
				case 304: $text = 'Not Modified'; break;
				case 305: $text = 'Use Proxy'; break;
				case 400: $text = 'Bad Request'; break;
				case 401: $text = 'Unauthorized'; break;
				case 402: $text = 'Payment Required'; break;
				case 403: $text = 'Forbidden'; break;
				case 404: $text = 'Not Found'; break;
				case 405: $text = 'Method Not Allowed'; break;
				case 406: $text = 'Not Acceptable'; break;
				case 407: $text = 'Proxy Authentication Required'; break;
				case 408: $text = 'Request Time-out'; break;
				case 409: $text = 'Conflict'; break;
				case 410: $text = 'Gone'; break;
				case 411: $text = 'Length Required'; break;
				case 412: $text = 'Precondition Failed'; break;
				case 413: $text = 'Request Entity Too Large'; break;
				case 414: $text = 'Request-URI Too Large'; break;
				case 415: $text = 'Unsupported Media Type'; break;
				case 500: $text = 'Internal Server Error'; break;
				case 501: $text = 'Not Implemented'; break;
				case 502: $text = 'Bad Gateway'; break;
				case 503: $text = 'Service Unavailable'; break;
				case 504: $text = 'Gateway Time-out'; break;
				case 505: $text = 'HTTP Version not supported'; break;
				default:
					exit('Unknown http status code "' . htmlentities($code) . '"');
					break;
			}

			$protocol = (isset($_SERVER['SERVER_PROTOCOL']) ? $_SERVER['SERVER_PROTOCOL'] : 'HTTP/1.0');

			header($protocol . ' ' . $code . ' ' . $text);

			$GLOBALS['http_response_code'] = $code;

		} else {

			$code = (isset($GLOBALS['http_response_code']) ? $GLOBALS['http_response_code'] : 200);

		}

		return $code;

	}
}