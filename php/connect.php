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