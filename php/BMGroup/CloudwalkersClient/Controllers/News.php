<?php
class BMGroup_CloudwalkersClient_Controllers_News
	extends BMGroup_CloudwalkersClient_Controllers_Home
{
	public function dispatch (Neuron_Page $page)
	{
		$page->setContent ($this->getContent ());
		$page->set ('header-nav-active', 'news');
		echo $page->getOutput ();
	}
}