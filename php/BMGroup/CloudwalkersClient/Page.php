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

		$html->set ('header', $this->getHeader ());
		$html->set ('footer', $this->getFooter ());

		$client = BMGroup_CloudwalkersClient_Client::getInstance ();
		
		$html->set ('login', $client->isLogin ());

		return $html->parse ('index.phpt');
	}

	public function getHeader ()
	{
		$page = new Neuron_Core_Template ();

		$client = BMGroup_CloudwalkersClient_Client::getInstance ();
		if ($client->isLogin ())
		{
			$page->set ('user', $client->getUserData ());
		}

		return $page->parse ('modules/cloudwalkersclient/blocks/header.phpt');
	}

	public function getFooter ()
	{
		$page = new Neuron_Core_Template ();
		return $page->parse ('modules/cloudwalkersclient/blocks/footer.phpt');
	}
}