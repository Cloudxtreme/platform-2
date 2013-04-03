<?php
class BMGroup_CloudwalkersClient_Controllers_Accounts
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
			return '<p>Please login.</p>';
		}

		$input = $this->getInput ();
		$action = isset ($input[1]) ? $input[1] : null;

		switch ($action)
		{
			case 'add':
				return $this->getAddAccount ();
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

		$data = $client->get ('accounts');

		$page = new Neuron_Core_Template ();
		$page->set ('accounts', $data);

		return $page->parse ('modules/cloudwalkersclient/pages/accounts/list.phpt');
	}

	/**
	* Link a new account
	*/
	private function getAddAccount ()
	{
		$client = BMGroup_CloudwalkersClient_Client::getInstance ();

		$data = $client->get ('accounts/available');

		$page = new Neuron_Core_Template ();
		$page->set ('available', $data);
		$page->set ('returnafterlink', Neuron_URLBuilder::getURL ('accounts'));

		return $page->parse ('modules/cloudwalkersclient/pages/accounts/add.phpt');
	}
}