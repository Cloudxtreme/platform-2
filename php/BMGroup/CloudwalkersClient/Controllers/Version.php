<?php
class BMGroup_CloudwalkersClient_Controllers_Version
	extends BMGroup_CloudwalkersClient_Controllers_Base
{
	public function dispatch (Neuron_Page $page)
	{
		$client = BMGroup_CloudwalkersClient_Client::getInstance ();

		$version = $client->get ('version');
		$api = array ('error' => array ('message' => 'Not connected'));
		if ($version)
		{
			$api = $version['platform'];
		}

		$out = array (
			'client' => array (
				'version' => VERSION
			),
			'api' => $api
		);

		header ('Content-type: application/json');
		echo json_encode (array ('platform' => $out));
	}
}