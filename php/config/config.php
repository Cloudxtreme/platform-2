<?php

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