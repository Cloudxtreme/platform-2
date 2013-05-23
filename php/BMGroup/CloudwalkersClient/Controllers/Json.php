<?php
class BMGroup_CloudwalkersClient_Controllers_Json
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

		session_commit ();

		$data = $this->getInput ();
		array_shift ($data);

		$action = implode ('/', $data);


		$client = BMGroup_CloudwalkersClient_Client::getInstance ();
		unset ($_GET['rewritepagemodule']);
		return $client->get ($action, $_GET);
	}
}