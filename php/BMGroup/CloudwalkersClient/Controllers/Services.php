<?php
class BMGroup_CloudwalkersClient_Controllers_Services
	extends BMGroup_CloudwalkersClient_Controllers_Base
{
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

		// Since every use can have multiple accounts, make sure there is one selected.
		$account = $this->getAccount ();
		if (!$account)
		{
			return $this->selectAccount ();
		}

		$input = $this->getInput ();
		$action = isset ($input[1]) ? $input[1] : null;

		switch ($action)
		{
			case 'add':
				return $this->getAddAccount ();
			break;

			case 'settings':
				return $this->getSettings ();
			break;

			case 'list':
			default:
				return $this->getListAccounts ();
			break;
		}
	}

	/**
	* Show a list of all accounts that are set for current user.
	*/
	private function getListAccounts ()
	{
		$client = BMGroup_CloudwalkersClient_Client::getInstance ();

		$remove = Neuron_Core_Tools::getInput ('_GET', 'remove', 'int');
		if ($remove)
		{
			$client->delete ('services/' . $remove, array ('account' => $this->getAccount ()));
		}

		$data = $client->get ('services', array ('account' => $this->getAccount ()));
		$data = $data['services'];

		$page = new Neuron_Core_Template ();
		$page->set ('accounts', $data);

		return $page->parse ('modules/cloudwalkersclient/pages/accounts/list.phpt');
	}

	private function getSettings ()
	{
		$input = $this->getInput ();
		$id = isset ($input[2]) ? $input[2] : null;

		// Parse the input
		if (!empty ($_POST))
		{
			$this->processSettings ($id);
		}

		$client = BMGroup_CloudwalkersClient_Client::getInstance ();

		$data = $client->get ('services/' . $id, array ('account' => $this->getAccount ()));
		$data = $data['service'];
		
		$userdata = $client->get ('account/' . $this->getAccount ());
		$channels = $userdata['channels'];

		$page = new Neuron_Core_Template ();
		$page->set ('account', $data);
		$page->set ('channels', $channels);

		$page->set ('errors', $data['errors']);

		return $page->parse ('modules/cloudwalkersclient/pages/accounts/settings.phpt');
	}

	private function processSettings ($id)
	{
		$client = BMGroup_CloudwalkersClient_Client::getInstance ();

		$data = $_POST;

		$data['account'] = $this->getAccount ();

		if (isset ($data['streams']))
		{
			foreach ($data['streams'] as $streamid => $stream)
			{
				if (isset ($data['streams'][$streamid]['channels']))
				{
					$data['streams'][$streamid]['channels'] = array_keys ($stream['channels']);
				}
			}
		}

		$data = $client->put ('services/' . $id, array ('account' => $this->getAccount ()), $data);
	}

	/**
	* Link a new account
	*/
	private function getAddAccount ()
	{
		$client = BMGroup_CloudwalkersClient_Client::getInstance ();

		$addid = Neuron_Core_Tools::getInput ('_GET', 'id', 'varchar');
		if (!empty ($addid))
		{
			// Add the service
			$data = $client->post ('services', array ('account' => $this->getAccount ()), array ('id' => $addid));

			header ('Location: ' . Neuron_URLBuilder::getURL ('services/', $data['id']));
		}

		$data = $client->get ('services/available', array ('account' => $this->getAccount ()));
		$data = $data['services'];

		$page = new Neuron_Core_Template ();
		$page->set ('available', $data);
		//$page->set ('returnafterlink', Neuron_URLBuilder::getURL ('services'));

		return $page->parse ('modules/cloudwalkersclient/pages/accounts/add.phpt');
	}
}