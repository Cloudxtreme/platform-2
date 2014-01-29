<?php

define ('VERSION', '0.9.3.2');

error_reporting (-1);
ini_set ('display_errors', 1);

// If db-local.php is found, use that one.
// Otherwise use db.php
if (file_exists (PHP_BASEPATH . 'config/db-local.php'))
{
	require_once ('config/db-local.php');
}

else
{
	require_once ('config/db.php');
}

if (!defined ('OAUTH_CONSUMER_KEY') || !defined ('OAUTH_CONSUMER_SECRET'))
{
	die ('You must define a consumer key and consumer secret in order to use the application. Go to /engine/oauth1/register');
}

if (!defined ('OAUTH_SERVER'))
{
	define ('OAUTH_SERVER', 'http://api.cloudwalkers.be/');
}

error_reporting (-1);
ini_set ('display_errors', 1);

if (!defined ('BASE_URL'))
{
	define ('BASE_URL', (isset ($_SERVER['HTTPS']) && $_SERVER['HTTPS'] ? 'https' : 'http') . '://' . $_SERVER['SERVER_NAME'] . '/');
}

if (!defined ('BASE_SSL_URL'))
{
	define ('BASE_SSL_URL', 'https://' . $_SERVER['SERVER_NAME'] . '/');	
}

// Template directory
Neuron_Core_Template::setTemplatePath ('templates/');

Neuron_Core_Text::setLanguagePath ('languages/');

if (isset ($_GET['language']))
{
	$_SESSION['language'] = $_GET['language'];
}

if (isset ($_SESSION['language']))
{
	define ('LANGUAGE_TAG', $_SESSION['language']);
}
else
{
	define ('LANGUAGE_TAG', 'nl');	
}
