<?php
class BMGroup_CloudwalkersClient_Tools
{
	public static function arrayPostToPlainPost ()
	{
		$data = array ();
		self::arrayToFlatArray ($_POST, $data, '');

		return $data;
	}

	private static function arrayToFlatArray ($a, &$data, $name, $level = 0)
	{
		foreach ($a as $k => $v)
		{
			if ($level > 0)
			{
				$key = $name . '[' . $k . ']';
			}
			else
			{
				$key = $k;	
			}

			if (is_array ($v))
			{
				self::arrayToFlatArray ($v, $data, $key, $level + 1);
			}
			else
			{
				$data[$key] = $v;
			}
		}
	}
}