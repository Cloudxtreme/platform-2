<?php
class BMGroup_CloudwalkersClient_Controllers_Profiles
	extends BMGroup_CloudwalkersClient_Controllers_Home
{
	public function dispatch (Neuron_Page $page)
	{
		$GLOBALS['header-nav-active'] = 'profiles';
		$page->setContent ($this->getContent ());
		echo $page->getOutput ();
	}
}