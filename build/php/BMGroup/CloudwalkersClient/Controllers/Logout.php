<?php
class BMGroup_CloudwalkersClient_Controllers_Logout
	extends BMGroup_CloudwalkersClient_Controllers_Base
{
	public function getContent ()
	{
		$client = BMGroup_CloudwalkersClient_Client::getInstance ();
		$client->logout (Neuron_URLBuilder::getURL('login'));

		$_SESSION['account'] = null;
	}
}