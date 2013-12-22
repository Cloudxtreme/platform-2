<?php
class BMGroup_CloudwalkersClient_Controllers_Login
	extends BMGroup_CloudwalkersClient_Controllers_Base
{
	public function dispatch (Neuron_Page $page)
	{
		$client = BMGroup_CloudwalkersClient_Client::getInstance ();

		$_SESSION['account'] = null;

		if ($client->isLogin ())
		{
			echo '<p>' . __('You are already logged in.') . '</p>';
		}

		else
		{
			return $client->login ();
		}
	}
}