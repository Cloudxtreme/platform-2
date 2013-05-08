<?php
class BMGroup_CloudwalkersClient_Controllers_Templates
	extends BMGroup_CloudwalkersClient_Controllers_Home
{
	public function dispatch (Neuron_Page $page)
	{
		$dir = BASEPATH . 'php/BMGroup/CloudwalkersClient/templates/javascript/';

		$files = scandir ($dir);

		$out = array ();

		foreach ($files as $file)
		{
			if (is_file ($dir . $file))
			{
				$name = substr ($file, 0, -5);

				$out[$name] = file_get_contents ($dir . $file);
			}
		}

		header ('Content-type: application/json');
		echo 'var Templates = ' . json_encode ($out);
	}
}