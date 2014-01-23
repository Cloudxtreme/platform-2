<?php
abstract class BMGroup_CloudwalkersClient_Controllers_Base
	implements Neuron_Interfaces_FrontController
{
	private $rootController;

	public final function __construct ()
	{
		$accountid = Neuron_Core_Tools::getInput ('_GET', 'account', 'int');
		if ($accountid)
		{
			$_SESSION['account'] = $accountid;
		}
	}

	public function canDispatch ()
	{
		return true;
	}

	/**
	* Get the currently selected account
	*/
	protected function getAccount ()
	{
		if (isset ($_SESSION['account']))
		{
			return $_SESSION['account'];
		}
		return false;
	}

	/**
	* Dialog to select which account to use.
	*/
	protected function selectAccount ()
	{
		$client = BMGroup_CloudwalkersClient_Client::getInstance ();

		if (!$client->isLogin ())
		{
			return '<p>You must login.</p>';
		}

		else
		{
			$userdata = $client->get ('user/me');
			$accounts = $userdata['user']['accounts'];

			$accountdata = array ();
			foreach ($accounts as $v)
			{
				$v['url'] = Neuron_URLBuilder::getUrl (implode ('/', $this->getInput ()), array ('account' => $v['id']));
				$accountdata[] = $v;
			}

			$page = new Neuron_Core_Template ();
			$page->set ('accounts', $accountdata);
			return $page->parse ('modules/cloudwalkersclient/pages/selectaccount.phpt');
		}
	}

	public function dispatch (Neuron_Page $page)
	{
		$page->setContent ($this->getContent ());
		echo $page->getOutput ();
	}

	public function setParentController (Neuron_FrontController $input)
	{
		$this->rootController = $input;
	}

	public function getInput ($id = null)
	{
		$input = $this->rootController->getInput ();
		if (isset ($id))
		{
			return isset ($input[$id]) ? $input[$id] : null;
		}
		return $input;
	}

	public function getContent ()
	{
		return '<p>No content.</p>';
	}
}