<?php
class BMGroup_CloudwalkersClient_Controllers_Json
	extends BMGroup_CloudwalkersClient_Controllers_Base
{
	public function dispatch (Neuron_Page $page)
	{
		$data = $this->getData ();
		header ('Content-type: application/json');
		echo json_encode ($data);
	}

	private function getData ()
	{
		$client = BMGroup_CloudwalkersClient_Client::getInstance ();
		if (!$client->isLogin ())
		{
			http_response_code (401);
			return array ('error' => array ('message' => 'You are not authenticated.'));
		}

		session_commit ();

		$data = $this->getInput ();
		array_shift ($data);

		$action = implode ('/', $data);


		$client = BMGroup_CloudwalkersClient_Client::getInstance ();
		unset ($_GET['rewritepagemodule']);

		$entityBody = file_get_contents('php://input');
		$method = isset ($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : 'GET';

		switch (strtolower ($method))
		{
			case 'post':
				return $client->post ($action, $_GET, json_decode ($entityBody));
			break;

			case 'put':
				return $client->put ($action, $_GET, json_decode ($entityBody));
			break;

            case 'patch':
                return $client->patch ($action, $_GET, json_decode ($entityBody));
            break;

			case 'delete':
				return $client->delete ($action, $_GET);
			break;

			case 'get':
			default:
				return $client->get ($action, $_GET);
			break;
		}
	}
}