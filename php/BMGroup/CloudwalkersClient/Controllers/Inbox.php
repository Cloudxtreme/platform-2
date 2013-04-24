<?php
class BMGroup_CloudwalkersClient_Controllers_Inbox
	extends BMGroup_CloudwalkersClient_Controllers_Home
{
	public function dispatch (Neuron_Page $page)
	{
		$GLOBALS['header-nav-active'] = 'inbox';
		$page->setContent ($this->getContent ());
		echo $page->getOutput ();
	}
}