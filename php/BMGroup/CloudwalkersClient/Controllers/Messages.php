<?php
class BMGroup_CloudwalkersClient_Controllers_Home
	extends BMGroup_CloudwalkersClient_Controllers_Base
{
	public function getContent ()
	{
		$client = BMGroup_CloudwalkersClient_Client::getInstance ();
		if (!$client->isLogin ())
		{
			return '<p>Please login.</p>';
		}

		$message = Neuron_Core_Tools::getInput ('_GET', 'message', 'int');
		if ($message)
		{
			return $this->getMessage ($message);
		}

		$streamid = Neuron_Core_Tools::getInput ('_GET', 'stream', 'int');
		if (!$streamid)
		{
			return '<p>No stream selected.</p>';
		}

		$stream = $client->get ('stream/' . $streamid);
		$stream = $stream['stream'];

		$page = new Neuron_Core_Template ();

		$page->set ('messages', $stream['messages']);

		return $page->parse ('modules/cloudwalkersclient/pages/messages/messages.phpt');
	}

	public function getMessage ($id)
	{
		$client = BMGroup_CloudwalkersClient_Client::getInstance ();

		// Actions!
		$action = Neuron_Core_Tools::getInput ('_GET', 'action', 'varchar');
		if ($action)
		{
			$actions = array ();

			// No parameters for now...
			$actions[] = array (
				'token' => $action,
				'parameters' => array (
					// 'message' => 'Hoera! Ik post comments zonder facebook te openen!'
				)
			);

			$chk = $client->put ('message/' . $id, array (), array ('actions' => $actions));

			if ($chk['success'])
			{
				return 'OK';
			}
			else
			{
				return '<pre>' . print_r ($chk, true) . '</pre>';
			}
		}

		$message = $client->get ('message/' . $id);

		$page = new Neuron_Core_Template ();
		$page->set ('message', $message);
		return $page->parse ('modules/cloudwalkersclient/pages/messages/message.phpt');
	}
}