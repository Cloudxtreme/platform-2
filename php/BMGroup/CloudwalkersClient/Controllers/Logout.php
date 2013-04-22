<?php
class BMGroup_CloudwalkersClient_Controllers_Logout
	extends BMGroup_CloudwalkersClient_Controllers_Base
{
	public function getContent ()
	{
		$client = BMGroup_CloudwalkersClient_Client::getInstance ();
		$client->logout ();
	}
	
	public function dispatch (Neuron_Page $page)
	{
		$page = new Neuron_Core_Template ();
		//$page->set ('accounts', $accountdata);
		return $page->parse ('logout.phpt');
		
		//$page->setContent ($this->getContent ());
		//echo $page->getOutput ();
	}
}