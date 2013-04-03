<?php
abstract class BMGroup_CloudwalkersClient_Controllers_Base
	implements Neuron_Interfaces_FrontController
{
	private $rootController;

	public function canDispatch ()
	{
		return true;
	}

	public function dispatch (Neuron_Page $page)
	{
		$page->setContent ($this->getContent ());
		echo $page->getOutput ();
	}

	public function setParentController (Neuron_FrontController $input)
	{
		$this->rootController = $input;
	}

	public function getInput ()
	{
		return $this->rootController->getInput ();
	}

	abstract public function getContent ();
}