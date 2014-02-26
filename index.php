<?php

require ('php/connect.php');

// Check for https redirect
if (substr (BASE_URL, 0, 5) == 'https' && !isset($_SERVER['HTTPS'] ) )
{
	header ('Location: ' . BASE_URL);
	return;
}

define ('DEBUG', ((isset($_GET['debug'])) && (in_array($_SERVER['REMOTE_ADDR'], array('94.224.104.197'/*Roel*/, '78.22.195.135'/*Bureau*/)))));

$module = Neuron_Core_Tools::getInput ('_GET', 'rewritepagemodule', 'varchar');
$input = array ();
if ($module)
{
	$input = explode ('/', $module);
}

$frontcontroller = Neuron_FrontController::getInstance ();
$frontcontroller->setInput ($input);

// Add controllers
$frontcontroller->addController (new BMGroup_CloudwalkersClient_FrontController ());

$frontcontroller->setPage (new BMGroup_CloudwalkersClient_Page ());

$frontcontroller->dispatch ();