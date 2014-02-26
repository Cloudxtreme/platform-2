<?php
class BMGroup_CloudwalkersClient_Controllers_Status
	extends BMGroup_CloudwalkersClient_Controllers_Base
{
	private $colors = array (
		300 => '#FFFFCC',
		600 => '#FFFF99',
		1200 => '#FFCC33',
		2400 => '#FF3333',
		3600 => '#FF0000'
	);

	public function dispatch (Neuron_Page $page)
	{
		$page = new Neuron_Core_Template ();
		$page->set ('content', $this->getContent ());
		echo $page->parse ('modules/cloudwalkersclient/setting-index.phpt');
	}

	/**
	* Return the HTML that will be put in the body.
	*/
	public function getContent ()
	{
		$client = BMGroup_CloudwalkersClient_Client::getInstance ();
		if (!$client->isLogin ())
		{
			$client->logout (Neuron_URLBuilder::getURL('login'));
		}

		$status = $client->get ('user/me/status');

		//return '<pre> '. print_r ($status['user'], true);
		$user = $status['user'];

		foreach ($user['accounts'] as $kaccount => $account)
		{
			foreach ($account['streams'] as $kstream => $stream)
			{
				$user['accounts'][$kaccount][$kstream]['warningcolor'] = $this->getWarningColor ($stream['lastRefresh']);
			}
		}

		$page = new Neuron_Core_Template ();
		$page->set ('user', $user);
		return $page->parse ('status.phpt');
	}

	private function getWarningColor ($date)
	{
		$since = time () - $date;

		if ($since <= 300)
		{
			return '#ffffff';
		}

		foreach ($this->colors as $k => $v)
		{
			if ($since > $k)
			{
				return $v;
			}
		}

		return '#990000';
	}
}