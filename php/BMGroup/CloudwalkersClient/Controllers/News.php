<?php
class BMGroup_CloudwalkersClient_Controllers_News
	extends BMGroup_CloudwalkersClient_Controllers_Home
{
	public function dispatch (Neuron_Page $page)
	{
		$GLOBALS['header-nav-active'] = 'news';
		$page->setContent ($this->getContent ());
		echo $page->getOutput ();
	}
}