<?php
class BMGroup_CloudwalkersClient_Controllers_Post
	extends BMGroup_CloudwalkersClient_Controllers_Base
{
	public function dispatch (Neuron_Page $page)
	{
		$data = $this->getData ();
		header ('Content-type: application/json');
		echo json_encode ($data);
	}

	private function getData ()
	{
		$client = BMGroup_CloudwalkersClient_Client::getInstance ();
		if (!$client->isLogin ())
		{
			return array ('error' => array ('message' => 'You are not authenticated.'));
		}

		return array ('success' => false, 'error' => 'Not implemented yet.');
	}
}