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

	/**
	 * @return BMGroup_CloudwalkersClient_Client
	 */
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
		$this->server = OAUTH_SERVER;
		$server = $this->server;

		$key = OAUTH_CONSUMER_KEY; // this is your consumer key
		$secret = OAUTH_CONSUMER_SECRET; // this is your secret key

		$this->api = new oauth_client_class ();

		$this->api->session_started = true;
		$this->api->client_id = $key;
		$this->api->client_secret = $secret;

		$this->api->debug = 1;
		$this->api->debug_http = 1;

		$this->api->oauth_version = '1.0a';
		$this->api->request_token_url = $server . 'oauth1/requesttoken';
		$this->api->dialog_url = $server . 'oauth1/authorize/web';
		$this->api->access_token_url = $server . 'oauth1/accesstoken';
		$this->api->append_state_to_redirect_uri = '';
		$this->api->authorization_header = true;
		$this->api->url_parameters = true;

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
	
	public function logout ($redirect_url = '')
	{
		$_SESSION['isLogin'] = false;
		$_SESSION['oauth_token'] = null;
		$_SESSION['oauth_secret'] = null;

		session_destroy ();

		if (empty ($redirect_url))
		{
			$redirect_url = Neuron_URLBuilder::getURL ();
		}
		
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
							$this->server . '1/user/me/info', 'GET',
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
				echo 'Error: ' . $client->error;
				var_dump ($user);
				exit;
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

	public function getUserData ()
	{
		$user = $this->get ('user/me/info');
		return $user['user'];
	}

	public function get ($url, $get = array ())
	{
		$url .= '?' . http_build_query ($get);
		return $this->call ($url, array (), 'GET');
	}

	public function put ($url, $get, $input = array ())
	{
		$url .= '?' . http_build_query ($get);
		return $this->call ($url, $input, 'PUT');
	}

	public function post ($url, $get, $input = array ())
	{
		$url .= '?' . http_build_query ($get);
		return $this->call ($url, $input, 'POST');
	}

	public function delete ($url, $get, $input = array ())
	{
		$url .= '?' . http_build_query ($get);
		return $this->call ($url, $input, 'DELETE');
	}

	public function getNoLogin ($url)
	{
		return json_decode (file_get_contents ($this->server . $url), true);
	}

	private function call ($url, $input = array (), $method = 'GET')
	{
		if (!$this->isLogin ())
		{
			return false;
		}

		$url = '1/' . $url;

		$success = $this->api->CallAPI
		(
			$this->server . $url, 
			$method, 
			$input, 
			array
			(
				'FailOnAccessError' => false,
				'RequestContentType' => 'application/json'
			), 
			$data
		);

		//var_dump ($this->api->response_status);
		http_response_code ($this->api->response_status);

		if (Neuron_Core_Tools::getInput ('_GET', 'output', 'varchar') == 'table')
		{
			header('Content-Type: text/html; charset=utf-8');

			echo '<h1>TABLE OUTPUT: ' . $this->server . $url . '</h1>';
			echo '<h2>Sent</h2>';
			echo '<pre>';
			print_r ($input);
			echo '</pre>';
			echo '<h2>Received</h2>';
			echo ($data);
			exit;
		}

		if (!$success)
		{
			header('Content-Type: text/html; charset=utf-8');

			echo '<h1>API ERROR: ' . $this->server . $url . '</h1>';
			echo '<h2>Sent</h2>';
			echo '<pre>';
			print_r ($input);
			echo '</pre>';
			echo '<h2>Received</h2>';
			print_r ($data);
			exit;
		}

		if (!is_array ($data) && !is_object ($data))
		{
			header('Content-Type: text/html; charset=utf-8');

			echo '<h1>API ERROR: ' . $this->server . $url . '</h1>';
			echo '<h2>Sent</h2>';
			echo '<pre>';
			print_r ($input);
			echo '</pre>';
			echo '<h2>Received</h2>';
			echo $data;
			exit;	
		}

		$dataarr = objectToArray ($data);

		if (!$dataarr)
		{
			var_dump ($data);
		}

		/*
		if (isset ($dataarr['error']))
		{
			echo '<h1>API ERROR: ' . $this->server . $url . '</h1>';
			echo '<h2>Sent</h2>';
			echo '<pre>';
			print_r ($input);
			echo '</pre>';
			echo '<h2>Received</h2>';
			echo '<p>' . $dataarr['error']['message'] . '</p>';
			echo '<pre>';
			print_r ($dataarr['error']);
			echo '</pre>';

			exit;	
		}
		*/
		
		return $dataarr;
	}

	private function afterAuth ()
	{
		$_SESSION['isLogin'] = true;

		$_SESSION['oauth_token'] = $this->api->access_token;
		$_SESSION['oauth_secret'] = $this->api->access_token_secret;

		header ('Location: ' . Neuron_URLBuilder::getURL ('/'));
	}
}