<?php
class BMGroup_CloudwalkersClient_Controllers_Account
	extends BMGroup_CloudwalkersClient_Controllers_Base
{
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

		// Since every use can have multiple accounts, make sure there is one selected.
		$account = $this->getAccount ();
		if (!$account)
		{
			return $this->selectAccount ();
		}

		$errors = array ();

		$action = Neuron_Core_Tools::getInput ('_POST', 'action', 'varchar');
		switch ($action)
		{
			case 'edit':
				$input = array ();
				$input['name'] = Neuron_Core_Tools::getInput ('_POST', 'name', 'varchar');

				$data = $client->put ('account/' . $account, array (), $input);
				if (isset ($data['error']))
				{
					$errors[] = $data['error']['message'];
				}

			break;

			case 'invite':

				$input = array ();
				$input['email'] = Neuron_Core_Tools::getInput ('_POST', 'email', 'varchar');

				$data = $client->post ('account/' . $account . '/user', array (), $input);
				if (isset ($data['error']))
				{
					$errors[] = $data['error']['message'];
				}
				else
				{
					$errors[] = $input['email'] . ' was invited.';
				}

			break;
		}

		$account = $client->get ('account/' . $account);

		$page = new Neuron_Core_Template ();
		$page->set ('account', $account);
		$page->set ('errors', $errors);
		return $page->parse ('modules/cloudwalkersclient/pages/account/account.phpt');
	}
}