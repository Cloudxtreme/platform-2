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

		$message = Neuron_Core_Tools::getInput ('_POST', 'message', 'varchar');
		$subject = Neuron_Core_Tools::getInput ('_POST', 'title', 'varchar');
		$url = Neuron_Core_Tools::getInput ('_POST', 'url', 'varchar');

		$tags = Neuron_Core_Tools::getInput ('_POST', 'tags', 'varchar');

		$channels = array ();
		if (isset ($_POST['channel']) && is_array ($_POST['channel']))
		{
			$channels = array_values ($_POST['channel']);
		}

		// Scheduling

		$data = array ();

		if ($subject)
			$data['subject'] = $subject;

		if ($message)
			$data['body'] = $message;

		$data['channels'] = $channels;

		var_dump ($data);

		// Contact the system.
		$client->post ('message', array ('account' => 1), $data);

		return array ('success' => false, 'error' => 'Not implemented yet.');
	}
}