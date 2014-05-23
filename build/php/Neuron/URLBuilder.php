<?php
/**
* Static class to build URLs.
* I haven't really figured out a perfect method for this.
*/
class Neuron_URLBuilder 
{
	public static function getURL ($module = '', $data = array ())
	{
		$params = '';
		foreach ($data as $k => $v)
		{
			$params .= htmlentities ($k) . '=' . htmlentities ($v) . '&';
		}
		$params = substr ($params, 0, -1);

		if (!empty ($params))
		{
			return BASE_URL . $module . '?' . $params;
		}
		else
		{
			// Google likes these.
			return BASE_URL . $module;	
		}
	}
}