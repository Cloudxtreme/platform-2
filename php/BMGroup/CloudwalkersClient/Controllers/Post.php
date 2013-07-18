<?php
class BMGroup_CloudwalkersClient_Controllers_Post
	extends BMGroup_CloudwalkersClient_Controllers_Base
{
	public function dispatch (Neuron_Page $page)
	{
		$data = $this->getData ();
		header ('Content-type: application/json');

		echo json_encode ($data);
	}

	private function getCurrentAccount ()
	{
		return isset ($_GET['account']) ? $_GET['account'] : 0;
	}

	private function getData ()
	{
		$client = BMGroup_CloudwalkersClient_Client::getInstance ();
		if (!$client->isLogin ())
		{
			return array ('error' => array ('message' => 'You are not authenticated.'));
		}

		// Is remove?
		if (isset ($_GET['remove']))
		{
			$result = $client->delete ('message/' . $_GET['remove'], array (), array ());
			return array ('success' => $result ? true : false, 'error' => 'Something went wrong while removing.', 'result' => $result);
		}

		$message = Neuron_Core_Tools::getInput ('_POST', 'message', 'varchar');
		$subject = Neuron_Core_Tools::getInput ('_POST', 'title', 'varchar');
		$url = Neuron_Core_Tools::getInput ('_POST', 'url', 'varchar');

		$tags = Neuron_Core_Tools::getInput ('_POST', 'tags', 'varchar');

		$channels = array ();
		if (isset ($_POST['channel']) && is_array ($_POST['channel']))
		{
			$channels = array_values ($_POST['channel']);
		}

		// Scheduling

		$data = array ();

		if ($subject)
			$data['subject'] = $subject;

		if ($message)
			$data['body'] = $message;

		$data['streams'] = $channels;

		// Attachments
		$attachments = array ();

		if ($url)
		{
			$attachments[] = array ('url' => $url, 'type' => 'link');
		}

		if (isset ($_POST['files']))
		{
			foreach ($_POST['files'] as $file)
			{
				//$attachments[] = array ('data' => base64_encode (file_get_contents ($file)), 'type' => 'image');
				$attachments[] = array ('url' =>$file, 'type' => 'image');
			}
		}

		$data['attachments'] = $attachments;

		// Delay
		if ($delay = Neuron_Core_Tools::getInput ('_POST', 'delay', 'int'))
		{
			$data['date'] = date ('c', time () + $delay);
		}

		else
		{
			// Schedule
			$schedule_day = Neuron_Core_Tools::getInput ('_POST', 'schedule_day', 'int');
			$schedule_month = Neuron_Core_Tools::getInput ('_POST', 'schedule_month', 'int');
			$schedule_year = Neuron_Core_Tools::getInput ('_POST', 'schedule_year', 'int');
			$schedule_time = Neuron_Core_Tools::getInput ('_POST', 'schedule_time', 'varchar');

			if ($schedule_day && $schedule_month)
			{
				if (!$schedule_year)
				{
					$schedule_year = date ('Y');
				}

				if (!$schedule_time)
				{
					$schedule_time = '08:00';
				}

				$time = explode (':', $schedule_time);
				if (count ($time) !== 2)
				{
					$time = array (8, 0);
				}

				$data['date'] = date ('c', mktime ($time[0], $time[1], 0, $schedule_month, $schedule_day, $schedule_year));
			}
		}

		$repeat_delay_amount = Neuron_Core_Tools::getInput ('_POST', 'repeat_delay_amount', 'int');
		$repeat_delay_unit = Neuron_Core_Tools::getInput ('_POST', 'repeat_delay_unit', 'varchar');

		$data['repeat'] = array ();

		if ($repeat_delay_amount)
		{
			switch ($repeat_delay_unit)
			{
				case 'minutes':
					$data['repeat']['interval'] = $repeat_delay_amount * (60);
				break;

				case 'hours':
					$data['repeat']['interval'] = $repeat_delay_amount * (60 * 60);
				break;

				case 'days':
					$data['repeat']['interval'] = $repeat_delay_amount * (60 * 60 * 24);
				break;

				case 'weeks':
					$data['repeat']['interval'] = $repeat_delay_amount * (60 * 60 * 24 * 7);
				break;

				case 'months':
					$data['repeat']['interval'] = $repeat_delay_amount * (60 * 60 * 24 * 31);
				break;

				case 'years':
					$data['repeat']['interval'] = $repeat_delay_amount * (60 * 60 * 24 * 365);
				break;
			}
		}

		$days = array ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
		foreach ($days as $day)
		{
			if (Neuron_Core_Tools::getInput ('_POST', 'repeat_' . $day, 'varchar'))
			{
				if (!isset ($data['repeat']['weekdays']))
				{
					$data['repeat']['weekdays'] = array ();	
				}

				$data['repeat']['weekdays'][] = strtoupper ($day);
			}
		}

		// Repeat end
		$repeat_end_day = Neuron_Core_Tools::getInput ('_POST', 'repeat_end_day', 'int');
		$repeat_end_month = Neuron_Core_Tools::getInput ('_POST', 'repeat_end_month', 'int');
		$repeat_end_year = Neuron_Core_Tools::getInput ('_POST', 'repeat_end_year', 'int');
		$repeat_end_time = Neuron_Core_Tools::getInput ('_POST', 'repeat_end_time', 'varchar');

		if ($repeat_end_day && $repeat_end_month && $repeat_end_year)
		{
			$hour = 0;
			$minutes = 0;

			if ($repeat_end_time)
			{
				$time = explode (':', $repeat_end_time);

				if (count ($time) > 1 && is_numeric ($time[1]))
				{
					$minutes = $time[1];
				}

				if (is_numeric ($time[0]))
				{
					$hour = $time[0];
				}
			}

			$senddate = mktime ($hour, $minutes, 0, $repeat_end_month, $repeat_end_day, $repeat_end_year);
			$data['repeat']['end'] = date ('c', $senddate);
		}

		// Status: SCHEDULED or DRAFT
		$data['status'] = 'SCHEDULED';


		// If id is provided, this is an update.
		$id = Neuron_Core_Tools::getInput ('_GET', 'id', 'int');

		// Contact the system.
		if ($id)
		{
			$result = $client->put ('message/' . $id, array ('account' => $this->getCurrentAccount ()), $data);
		}
		else
		{
			$result = $client->post ('message', array ('account' => $this->getCurrentAccount ()), $data);
		}

		return array ('success' => true, 'error' => 'Message is scheduled.', 'result' => $result);
	}
}