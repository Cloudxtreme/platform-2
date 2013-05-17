<?php
class BMGroup_CloudwalkersClient_Controllers_Upload
	extends BMGroup_CloudwalkersClient_Controllers_Base
{
	public function dispatch (Neuron_Page $page)
	{
		$data = $this->getData ();

		header('Vary: Accept');

		if (isset($_SERVER['HTTP_ACCEPT']) &&
			(strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false)) 
		{
				header('Content-type: application/json');
		} 
		else 
		{
			header('Content-type: text/plain');
		}

		echo json_encode ($data);
	}

	private function getData ()
	{
		$action = $this->getInput (1);
		
		if ($action == 'delete')
		{
			// Remove a certain file.
			return $this->delete ();
		}
		else
		{
			return $this->upload ();
		}
	}

	private function delete ()
	{
		return array ('success' => true);
	}

	private function upload ()
	{
		$data = array ();

		$data['files'] = array ();

		foreach ($_FILES as $file)
		{
			//print_r ($file);
			$ext = explode ('.', $file['name']);
			$ext = $ext[count ($ext) - 1];

			$name = time () . mt_rand (0, 1000000) . '.' . $ext;

			$uploadfile = BASEPATH . 'public/' . $name;
			if (move_uploaded_file($file['tmp_name'], $uploadfile)) 
			{
				$data['files'][] = array 
				(
					'id' => $name,
					'name' => $file['name'],
					'size' => $file['size'],
					'url' => BASE_URL . 'public/' . $name, 
					'thumbnail_url' => Neuron_URLBuilder::getURL ('upload/delete/'),
					'delete_url' => Neuron_URLBuilder::getURL ('upload/delete/'),
					'delete_type' => 'DELETE'
				);
			}
		}

		return $data;
	}
}