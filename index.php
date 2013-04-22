<?php

require ('php/connect.php');

define ('DEBUG', ((isset($_GET['debug'])) && (in_array($_SERVER['REMOTE_ADDR'], array('94.224.104.197'/*Roel*/)))));

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