<?php
class BMGroup_CloudwalkersClient_Controllers_Templates
	extends BMGroup_CloudwalkersClient_Controllers_Home
{
	public function dispatch (Neuron_Page $page)
	{
		$dir = BASEPATH . 'php/BMGroup/CloudwalkersClient/templates/javascript';

		$out = array ();
		$this->scanDir ($dir, $out);

		header ('Content-type: application/json');
		echo 'var Templates = ' . json_encode ($out);
	}

	private function scanDir ($dir, &$out)
	{
		$files = scandir ($dir);

		foreach ($files as $file)
		{
			if (is_file ($dir . '/' . $file))
			{
				$name = substr ($file, 0, -5);

				$out[$name] = '<!-- ' . $file . ' -->';
				$out[$name] .= file_get_contents ($dir . '/' . $file);
				$out[$name] .= '<!-- /' . $file . ' -->';
			}

			elseif ($file != '.' && $file != '..' && is_dir ($dir . '/' . $file))
			{
				$name = $file;

				$tmp = array ();
				$this->scanDir ($dir . '/' . $file, $tmp);

				$out[$name] = $tmp;
			}
		}
	}
}