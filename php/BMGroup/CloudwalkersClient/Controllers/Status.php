<?php
class BMGroup_CloudwalkersClient_Controllers_Status
	extends BMGroup_CloudwalkersClient_Controllers_Base
{
	private $colors = array (
		300 => array ('#FFFFCC', 'black'),
		600 => array ('#FFFF99', 'black'),
		1200 => array ('#FFCC33', 'black'),
		2400 => array ('#FF3333', 'white'),
		3600 => array ('#FF0000', 'white')
	);

	public function dispatch (Neuron_Page $page)
	{
		ksort ($this->colors, SORT_DESC);
		$this->colors = array_reverse ($this->colors, true);

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
				$user['accounts'][$kaccount]['streams'][$kstream]['warningcolor'] = $this->getWarningColor ($stream['lastRefresh']);
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