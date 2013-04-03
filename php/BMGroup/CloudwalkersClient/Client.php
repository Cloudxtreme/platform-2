<?php

function objectToArray($d) {
	if (is_object($d)) {
		// Gets the properties of the given object
		// with get_object_vars function
		$d = get_object_vars($d);
	}

	if (is_array($d)) {
		/*
		* Return array converted to object
		* Using __FUNCTION__ (Magic constant)
		* for recursive call
		*/
		return array_map(__FUNCTION__, $d);
	}
	else {
		// Return array
		return $d;
	}
}

class BMGroup_CloudwalkersClient_Client
{
	private $api;
	private $server;

	public static function getInstance ()
	{
		static $in;
		if (!isset ($in))
		{
			$in = new self ();
		}
		return $in;
	}

	private function __construct ()
	{
		$this->server = 'http://localhost/cloudwalkers/engine/';
		$server = $this->server;

		$key = '686537c9fffe2c451a07c6c9c40bd91a0515af265'; // this is your consumer key
		$secret = 'f2e4f67d6e7dc04af18ca19990f579fd'; // this is your secret key

		$this->api = new oauth_client_class ();

		$this->api->session_started = true;
		$this->api->client_id = $key;
		$this->api->client_secret = $secret;

		$this->api->debug = 1;
		$this->api->debug_http = 1;

		$this->api->oauth_version = '1.0a';
		$this->api->request_token_url = $server . 'oauth1/requesttoken';
		$this->api->dialog_url = $server . 'oauth1/authorize';
		$this->api->access_token_url = $server . 'oauth1/accesstoken';
		$this->api->append_state_to_redirect_uri = '';
		$this->api->authorization_header = false;
		$this->api->url_parameters = false;

		if (isset ($_SESSION['oauth_token']))
		{
			$this->api->access_token = $_SESSION['oauth_token'];
		}

		if (isset ($_SESSION['oauth_secret']))
		{
			$this->api->access_token_secret = $_SESSION['oauth_secret'];
		}
	}

	public function isLogin ()
	{
		if (isset ($_SESSION['isLogin']))
		{
			return $_SESSION['isLogin'];
		}
		return false;
	}

	public function logout ()
	{
		$_SESSION['isLogin'] = false;
		$_SESSION['oauth_token'] = null;
		$_SESSION['oauth_secret'] = null;

		session_destroy ();

		$redirect_url = Neuron_URLBuilder::getURL ();
		$logouturl = $this->server . 'logout?return=' . urlencode ($redirect_url);
		header ('Location: ' . $logouturl);
	}

	public function login ()
	{
		if (!$this->isLogin ())
		{
			$client = $this->api;

			$client->redirect_uri = 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];

			$client->scope = '';

			unset ($_GET['rewritepagemodule']);
			unset ($_REQUEST['rewritepagemodule']);

			if ($success = $client->Initialize())
			{
				if($success = $client->Process())
				{
					if(strlen($client->access_token))
					{
						$success = $client->CallAPI
						(
							$this->server . 'user/me', 'GET', 
							array
							(
								'format'=>'json'
							), 
							array('FailOnAccessError' => true
						), $user);
					}
				}
				$success = $client->Finalize($success);
			}

			if (!empty ($client->error))
			{
				echo $client->error;
				exit;
				return false;
			}

			if(strlen($client->authorization_error))
			{
				$client->error = $client->authorization_error;
				echo $client->error;

				$success = false;
			}

			if($client->exit)
			{
				return false;
			}

			if ($success)
			{
				$this->afterAuth ();
			}

			return $success;
		}
		else
		{
			return '<p>You are already logged in.</p>';
		}
	}

	public function get ($url, $input = array ())
	{
		return $this->call ($url, $input, 'GET');
	}

	public function put ($url, $input = array ())
	{
		return $this->call ($url, $input, 'PUT');
	}

	public function post ($url, $input = array ())
	{
		return $this->call ($url, $input, 'POST');
	}

	public function delete ($url, $input = array ())
	{
		return $this->call ($url, $input, 'DELETE');
	}

	private function call ($url, $input = array (), $method = 'GET')
	{
		if (!$this->isLogin ())
		{
			return false;
		}

		$success = $this->api->CallAPI
		(
			$this->server . $url, 
			$method, 
			$input, 
			array
			(
				'FailOnAccessError' => true
			), 
			$data
		);

		if (!$success)
		{
			echo '<h1>API ERROR:</h1>';
			echo $data;
			exit;
		}

		if (!is_array ($data) && !is_object ($data))
		{
			echo '<h1>API ERROR:</h1>';
			echo $data;
			exit;	
		}
		$data = objectToArray ($data);
		
		return $data;
	}

	private function afterAuth ()
	{
		$_SESSION['isLogin'] = true;

		$_SESSION['oauth_token'] = $this->api->access_token;
		$_SESSION['oauth_secret'] = $this->api->access_token_secret;

		header ('Location: ' . Neuron_URLBuilder::getURL ());
	}
}