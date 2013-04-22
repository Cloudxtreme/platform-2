<?php
class BMGroup_CloudwalkersClient_Page
	extends Neuron_Page
{
	public function getOutput ()
	{
		$html = new Neuron_Core_Template ();

		$html->set ('title', $this->title);
		$html->set ('content', $this->content);

		$client = BMGroup_CloudwalkersClient_Client::getInstance ();
		if($client->isLogin ())
		{
			$html->set ('login', true);
			$page->set ('user', $client->get ('user/me'));
		}
		else
		{
			$html->set ('login', false);
		}

		return $html->parse ('index.phpt');
	}
}