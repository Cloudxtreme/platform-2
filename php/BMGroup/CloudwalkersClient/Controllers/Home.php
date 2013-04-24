<?php
class BMGroup_CloudwalkersClient_Controllers_Home
	extends BMGroup_CloudwalkersClient_Controllers_Base
{
	public function getContent ()
	{
		$client = BMGroup_CloudwalkersClient_Client::getInstance ();
		if (!$client->isLogin ())
		{
			//return '<p>Please login.</p>' . Neuron_URLBuilder::getUrl ('login');
			$client->logout (Neuron_URLBuilder::getURL('login'));
		}

		$userdata = $client->get ('user/me');

		$page = new Neuron_Core_Template ();
		$page->set ('user', $userdata);
		
    if(DEBUG) echo 'userdata<pre>' . print_r($userdata, true) . '</pre>';
		
		//$notifications = $client->get ('account/' . $userdata['accounts'][0]['id'] . '/notifications');
		//if(DEBUG) echo 'notifications<pre>' . print_r($notifications, true) . '</pre>';
		
		if(DEBUG){
			$notifications2 = $client->get ('stream/' . $userdata['accounts'][0]['channels'][0]['id'] . '');
			echo 'inbox<pre>' . print_r($notifications2, true) . '</pre>';
		
			$notifications3 = $client->get ('stream/' . $userdata['accounts'][0]['channels'][1]['id'] . '');
			echo 'profiles<pre>' . print_r($notifications3, true) . '</pre>';
		
			$notifications4 = $client->get ('stream/' . $userdata['accounts'][0]['channels'][2]['id'] . '');
			echo 'stream<pre>' . print_r($notifications4, true) . '</pre>';
		}

		return $page->parse ('modules/cloudwalkersclient/pages/home/home.phpt');
	}
}