<?php
class BMGroup_CloudwalkersClient_Controllers_Home
	extends BMGroup_CloudwalkersClient_Controllers_Base
{
	public function getContent ()
	{
		$client = BMGroup_CloudwalkersClient_Client::getInstance ();
		if (!$client->isLogin ())
		{
			//return '<p>Please login.</p>' . Neuron_URLBuilder::getUrl ('login');
			$client->logout (Neuron_URLBuilder::getURL('login'));
		}

		$_SESSION['account'] = null;

		//$userdata = $client->get ('user/me');

		return '<p>No content.</p>';

		/*
		$page = new Neuron_Core_Template ();
		$page->set ('user', $userdata);

		return $page->parse ('modules/cloudwalkersclient/pages/home/home.phpt');
		*/
	}
	
	public function dispatch (Neuron_Page $page)
	{
		$GLOBALS['header-nav-active'] = 'home';
		$page->setContent ($this->getContent ());
		echo $page->getOutput ();
	}
}