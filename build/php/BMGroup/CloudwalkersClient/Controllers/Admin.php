<?php
class BMGroup_CloudwalkersClient_Controllers_Admin
	extends BMGroup_CloudwalkersClient_Controllers_Base
{
	public function dispatch (Neuron_Page $page)
	{
		header ('Location: ' . OAUTH_SERVER . 'admin');
	}
}