<?php
class BMGroup_CloudwalkersClient_Controllers_Slowlog
	extends BMGroup_CloudwalkersClient_Controllers_Base
{
	public function getContent ()
	{
		$client = BMGroup_CloudwalkersClient_Client::getInstance ();
		
		$data = $client->getNoLogin ('/slowlog');

		if (!$data['processes'])
		{
			var_dump ($data);
			exit;
		}

		$page = new Neuron_Core_Template ();
		$page->set ('data', $data);
		return $page->parse ('modules/cloudwalkersclient/pages/slowlog/slowlog.phpt');
	}

	public function dispatch (Neuron_Page $page)
	{
		$page = new Neuron_Core_Template ();
		$page->set ('content', $this->getContent ());
		echo $page->parse ('modules/cloudwalkersclient/setting-index.phpt');
	}
}