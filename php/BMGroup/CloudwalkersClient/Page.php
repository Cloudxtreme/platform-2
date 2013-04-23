<?php
class BMGroup_CloudwalkersClient_Page
	extends Neuron_Page
{
	protected $user;
	
	public function getOutput ()
	{
		$html = new Neuron_Core_Template ();

		$html->set ('title', $this->title);
		$html->set ('content', $this->content);

		$client = BMGroup_CloudwalkersClient_Client::getInstance ();
		
		$html->set ('login', $client->isLogin ());

		return $html->parse ('index.phpt');
	}
}