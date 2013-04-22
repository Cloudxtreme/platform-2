<?php
class BMGroup_CloudwalkersClient_Controllers_Login
	extends BMGroup_CloudwalkersClient_Controllers_Base
{
	public function getContent ()
	{
		$client = BMGroup_CloudwalkersClient_Client::getInstance ();

		if ($client->isLogin ())
		{
			return '<p>' . __('You are already logged in.') . '</p>';
		}

		else
		{
			return $client->login ();
		}
	}
	
	public function dispatch (Neuron_Page $page)
	{
		//$page = new Neuron_Core_Template ();
		//$page->set ('accounts', $accountdata);
		//return $page->parse ('login.phpt');
		
		$page->setContent ($this->getContent ());
		echo $page->getOutput ();
	}
}