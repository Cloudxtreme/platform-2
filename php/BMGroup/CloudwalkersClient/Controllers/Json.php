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

		$data = $this->getInput ();
		array_shift ($data);

		$action = implode ('/', $data);


		$client = BMGroup_CloudwalkersClient_Client::getInstance ();
		unset ($_GET['rewritepagemodule']);
		return $client->get ($action, $_GET);

		/*
		$request = strtolower ($this->getInput (1));

		switch ($request)
		{
			case 'notifications':
				return $this->getNotifications ();
			break;

			case 'channel':
				return $this->getChannel ();
			break;

			default:
				return array ('error' => array ('message' => 'Invalid input: action not found'));
			break;
		}
		*/
	}

	/*
	private function getNotifications ()
	{
		$id = $this->getInput (2);

		$client = BMGroup_CloudwalkersClient_Client::getInstance ();
		return $client->get ('account/' . $id . '/notifications');
	}

	private function getChannel ()
	{
		$id = $this->getInput (2);

		$client = BMGroup_CloudwalkersClient_Client::getInstance ();
		return $client->get ('channel/' . $id);
	}
	*/
}