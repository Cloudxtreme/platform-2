<?php
require_once dirname (__FILE__) . '/libraries/http.php';;
require_once dirname (__FILE__) . '/libraries/oauth_client.php';


class BMGroup_CloudwalkersClient_FrontController
	implements Neuron_Interfaces_FrontController
{
	private $rootController;
	private $client;

	public function __construct ()
	{
		// Link the local templates folder 
		Neuron_Core_Template::addTemplatePath (dirname (__FILE__).'/templates', 'modules/cloudwalkersclient/');
	}

	public function canDispatch ()
	{
		return true;
	}

	private function getController ()
	{
		$input = $this->rootController->getInput ();
		$action = isset ($input[0]) ? $input[0] : null;

		$module = $this->getControllerFromInput ($action);
		if (!$module)
		{
			throw new Neuron_Exceptions_DataNotSet ("No Login controller found.");
		}

		$module->setParentController ($this->rootController);

		return $module;
	}

	private function getControllerFromInput ($module)
	{
		if (empty ($module))
		{
			$classname = 'BMGroup_CloudwalkersClient_Controllers_Home';
		}

		else
		{
			$classname = 'BMGroup_CloudwalkersClient_Controllers_' . ucfirst ($module);
		}

		if (class_exists ($classname))
		{
			return new $classname ();
		}

		http_response_code (404);

		$page = new Neuron_Core_Template ();
		echo $page->parse ('404.phpt');

		exit;

		//return new BMGroup_CloudwalkersClient_Controllers_Home ();
	}

	public function dispatch (Neuron_Page $page)
	{
		$controller = $this->getController ();
		$controller->dispatch ($this->rootController->getPage ());
	}

	public function setParentController (Neuron_FrontController $rootController)
	{
		$this->rootController = $rootController;
	}
}