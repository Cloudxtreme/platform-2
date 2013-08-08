<?php
class BMGroup_CloudwalkersClient_Controllers_Login
	extends BMGroup_CloudwalkersClient_Controllers_Base
{
	public function getContent ()
	{
		$client = BMGroup_CloudwalkersClient_Client::getInstance ();

		$_SESSION['account'] = null;

		if ($client->isLogin ())
		{
			return '<p>' . __('You are already logged in.') . '</p>';
		}

		else
		{
			return $client->login ();
		}
	}
}