<?php
class BMGroup_CloudwalkersClient_Controllers_User
	extends BMGroup_CloudwalkersClient_Controllers_Base
{
	public function getContent ()
	{
		$client = BMGroup_CloudwalkersClient_Client::getInstance ();

		if (!$client->isLogin ())
		{
			echo '<p>Please login.</p>' . Neuron_URLBuilder::getUrl ('login');
			$client->logout (Neuron_URLBuilder::getURL('login'));

			exit;
		}

		$errors = array ();

		$action = Neuron_Core_Tools::getInput ('_POST', 'action', 'varchar');
		switch ($action)
		{
			case 'edit':

				$data = array ();

				$data['name'] = Neuron_Core_Tools::getInput ('_POST', 'name', 'varchar');
				$data['firstname'] = Neuron_Core_Tools::getInput ('_POST', 'firstname', 'varchar');

				if (isset ($_FILES['avatar']))
				{
					if (!$_FILES['avatar']['error'])
					{
						// Let's use base64.
						$data['avatar'] = array (
							'data' => base64_encode (file_get_Contents ($_FILES['avatar']['tmp_name']))
						);
					}
				}

				$data = $client::getInstance ()->put ('/user/me', array (), $data);

				if (isset ($data['error']))
				{
					$errors[] = $data['error']['message'];
				}

			break;

			case 'password':

				$data = array ();
				$data['oldpassword'] = Neuron_Core_Tools::getInput ('_POST', 'oldpassword', 'varchar');
				$data['newpassword'] = Neuron_Core_Tools::getInput ('_POST', 'newpassword', 'varchar');

				$data = $client::getInstance ()->put ('/user/me/password', array (), $data);

				if (isset ($data['error']))
				{
					$errors[] = $data['error']['message'];
				}
			break;
		}

		$userdata = $client->getUserData ();

		$page = new Neuron_Core_Template ();
		$page->set ('user', $userdata);
		$page->set ('errors', $errors);

		return $page->parse ('modules/cloudwalkersclient/pages/user/user.phpt');
	}

	public function dispatch (Neuron_Page $page)
	{
		$page = new Neuron_Core_Template ();
		$page->set ('content', $this->getContent ());
		echo $page->parse ('modules/cloudwalkersclient/setting-index.phpt');
	}
}