<?php
class BMGroup_CloudwalkersClient_Controllers_Logout
	extends BMGroup_CloudwalkersClient_Controllers_Base
{
	public function getContent ()
	{
		$client = BMGroup_CloudwalkersClient_Client::getInstance ();
		$client->logout ();
		$client->login ();
	}
	
	public function dispatch (Neuron_Page $page)
	{
		$page->setContent ($this->getContent ());
		echo $page->getOutput ();
	}
}